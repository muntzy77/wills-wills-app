const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const OpenAI = require("openai");

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "change-me";

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Persist database to a JSON file on disk. Render will mount a persistent disk at project root.
const DB_FILE = path.join(__dirname, "db.json");

function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { users: [], wills: [], accessRequests: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
  }
  const data = fs.readFileSync(DB_FILE, "utf8");
  return JSON.parse(data);
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Configure nodemailer using SMTP details from the environment
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Initialise OpenAI client if API key is provided
const hasOpenAI = !!process.env.OPENAI_API_KEY;
let openaiClient = null;
if (hasOpenAI) {
  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Utility to generate simple IDs
function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// JWT authentication middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ---------- Authentication Routes ----------

// Create a new account
app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password, phone } = req.body || {};

  if (!username || !email || !password || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const db = loadDb();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: genId(),
    username,
    email,
    phone,
    passwordHash,
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  saveDb(db);

  // Send confirmation email asynchronously if SMTP details are configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter
      .sendMail({
        from: process.env.EMAIL_FROM || "\"Will's Wills\" <no-reply@willswills.com.au>",
        to: email,
        subject: "Your Will's Wills account is ready",
        html: `
          <h2>Welcome to Will's Wills</h2>
          <p>Hi ${username},</p>
          <p>Your account has been created successfully.</p>
          <p>You can now log in and generate your customised Australian Will.</p>
        `
      })
      .catch(err => {
        console.error("Error sending confirmation email:", err.message);
      });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, phone: user.phone }
  });
});

// Log in to an existing account
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const db = loadDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, phone: user.phone }
  });
});

// Get current user details
app.get("/api/auth/me", authMiddleware, (req, res) => {
  const db = loadDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user.id, username: user.username, email: user.email, phone: user.phone });
});

// ---------- Will Routes ----------

// Create or update a user's will
app.post("/api/will", authMiddleware, async (req, res) => {
  const {
    fullName,
    address,
    state,
    maritalStatus,
    hasChildren,
    nextOfKinName,
    nextOfKinContact,
    lawyerName,
    lawyerContact,
    executorName,
    executorContact,
    assetsSummary,
    beneficiariesSummary,
    funeralWishes,
    customInstructions
  } = req.body || {};

  if (!fullName || !address || !state || !maritalStatus || !executorName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = loadDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  let willText;

  const basePrompt = `
You are a cautious Australian wills lawyer. Draft a plain-language but legally-structured Australian will (not jurisdiction-specific to a single state, but generally compatible) based on the following information.

Testator:
- Full name: ${fullName}
- Address: ${address}
- State/Territory of ordinary residence: ${state}
- Marital status: ${maritalStatus}
- Has children: ${hasChildren ? "Yes" : "No"}

Executor:
- Name: ${executorName}
- Contact: ${executorContact || "Not specified"}

Next of kin / nominated contact:
- Name: ${nextOfKinName || "Not specified"}
- Contact: ${nextOfKinContact || "Not specified"}

Lawyer (if any):
- Name: ${lawyerName || "Not specified"}
- Contact: ${lawyerContact || "Not specified"}

Estate:
- Assets summary: ${assetsSummary || "Not specified"}
- Beneficiaries summary: ${beneficiariesSummary || "Not specified"}

Funeral wishes:
${funeralWishes || "Not specified"}

Custom instructions:
${customInstructions || "None"}

IMPORTANT:
- Include standard clauses: revocation, appointment of executor, gifts and residue, funeral and remains, attestation.
- Add a clause requiring that third-party access to the will must only be granted upon provision and verification of an official Australian death certificate through a government-integrated API process.
- Add a bold disclaimer at the top that this is a draft only and is not legally effective until printed, signed and properly witnessed in accordance with applicable Australian law.
Return ONLY the will body in markdown-style text, no extra explanation.
`;

  // Try to use OpenAI if available
  if (hasOpenAI && openaiClient) {
    try {
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "You generate Australian will templates." },
          { role: "user", content: basePrompt }
        ],
        temperature: 0.3
      });
      willText = completion.choices[0].message.content.trim();
    } catch (err) {
      console.error("OpenAI error:", err.message);
      willText = null;
    }
  }

  // Fallback template if AI fails or not configured
  if (!willText) {
    willText = `
**DISCLAIMER: This is a draft will template only. It is not legally effective until printed, signed and properly witnessed in accordance with applicable Australian law. You should seek advice from an Australian legal practitioner.**

LAST WILL AND TESTAMENT OF ${fullName.toUpperCase()}

1. REVOCATION  
I revoke all former wills and testamentary dispositions made by me.

2. DECLARATION  
I, ${fullName}, of ${address}, ${state}, declare this to be my last will.

3. APPOINTMENT OF EXECUTOR  
I appoint ${executorName}${executorContact ? ` (${executorContact})` : ""} as Executor of this will.

4. NEXT OF KIN / NOMINATED CONTACT  
I record ${nextOfKinName || "[Not specified]"} as my next of kin / nominated contact for the administration of my estate and practical matters following my death.

5. LAWYER  
I record ${lawyerName || "[Not specified]"}${lawyerContact ? ` (${lawyerContact})` : ""} as my preferred legal practitioner to assist in administering my estate.

6. DISPOSITION OF ESTATE  
I give, devise and bequeath all of my estate, both real and personal, as follows:
${beneficiariesSummary || "[You must specify your beneficiaries and the shares or gifts they receive]."}

Assets overview (for reference only, not exhaustive or limiting):  
${assetsSummary || "[You have not provided any assets summary]"}

7. FUNERAL AND REMAINS  
My non-binding wish is as follows:  
${funeralWishes || "[No specific funeral wishes stated]"}

8. CUSTOM INSTRUCTIONS  
${customInstructions || "[No additional instructions]"}

9. THIRD PARTY ACCESS TO THIS WILL  
No third party (including any next of kin, lawyer or other person) is to be granted access to or copies of this will by any custodian platform unless and until a valid Australian death certificate in respect of me has been provided and electronically verified against the records of the relevant Australian registry via a secure government-integrated API, or by other legally accepted proof-of-death mechanism.

10. ATTESTATION  
Signed as a will by ${fullName} in the presence of the witnesses named below, who were present at the same time, and who each signed this will in my presence and in the presence of each other.

_____________________________  
Signature of testator: ${fullName}  

Witness 1: _____________________________  
Name: _________________________________  
Address: ______________________________  

Witness 2: _____________________________  
Name: _________________________________  
Address: ______________________________  
`;
  }

  // Save or update this user's will
  let willRecord = db.wills.find(w => w.userId === user.id);
  if (!willRecord) {
    willRecord = {
      id: genId(),
      userId: user.id,
      testatorFullName: fullName,
      createdAt: new Date().toISOString()
    };
    db.wills.push(willRecord);
  }

  willRecord.updatedAt = new Date().toISOString();
  willRecord.data = {
    fullName,
    address,
    state,
    maritalStatus,
    hasChildren,
    nextOfKinName,
    nextOfKinContact,
    lawyerName,
    lawyerContact,
    executorName,
    executorContact,
    assetsSummary,
    beneficiariesSummary,
    funeralWishes,
    customInstructions
  };
  willRecord.willText = willText;

  saveDb(db);

  res.json({ willId: willRecord.id, willText });
});

// ---------- ChatGPT-driven Will Generator ----------
// This endpoint provides a more structured integration with OpenAI's Chat Completion API.
// It accepts the same input payload as /api/will but constructs a rich conversation
// for the model and returns only the generated will text.  Users must be authenticated.
app.post("/api/generate-will", authMiddleware, async (req, res) => {
  const {
    fullName,
    address,
    state,
    maritalStatus,
    hasChildren,
    executorName,
    executorContact,
    nextOfKinName,
    nextOfKinContact,
    lawyerName,
    lawyerContact,
    assetsSummary,
    beneficiariesSummary,
    funeralWishes,
    customInstructions
  } = req.body || {};

  // Basic validation – ensure required fields are present
  if (!fullName || !address || !state || !maritalStatus || !executorName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Construct a structured conversation for ChatGPT
  const messages = [
    {
      role: "system",
      content:
        "You are a cautious Australian wills lawyer. Draft a plain‑language but legally structured Australian will based on user inputs. " +
        "Include standard clauses like revocation, appointment of executor, gifts and residue, funeral and remains, attestation. " +
        "Always include a disclaimer that this is a draft and not legal advice."
    },
    {
      role: "user",
      content: `
        Full name: ${fullName}
        Address: ${address}
        State: ${state}
        Marital status: ${maritalStatus}
        Has children: ${hasChildren ? "Yes" : "No"}

        Executor: ${executorName}${executorContact ? ` (${executorContact})` : ""}
        Next of kin: ${nextOfKinName || "Not specified"}${nextOfKinContact ? ` (${nextOfKinContact})` : ""}
        Lawyer: ${lawyerName || "Not specified"}${lawyerContact ? ` (${lawyerContact})` : ""}

        Assets summary: ${assetsSummary || "Not specified"}
        Beneficiaries summary: ${beneficiariesSummary || "Not specified"}
        Funeral wishes: ${funeralWishes || "None"}
        Custom instructions: ${customInstructions || "None"}
      `
    }
  ];

  let willText;
  if (hasOpenAI && openaiClient) {
    try {
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.3,
        max_tokens: 1000
      });
      willText = completion.choices[0].message.content.trim();
    } catch (err) {
      console.error("OpenAI generate-will error:", err.message);
      willText = null;
    }
  }

  // If AI fails or is not configured, fall back to the existing template generation
  if (!willText) {
    // Use the same fallback as /api/will but without saving to DB
    willText = `
**DISCLAIMER: This is a draft will template only. It is not legally effective until printed, signed and properly witnessed in accordance with applicable Australian law. You should seek advice from an Australian legal practitioner.**

LAST WILL AND TESTAMENT OF ${fullName.toUpperCase()}

1. REVOCATION  
I revoke all former wills and testamentary dispositions made by me.

2. DECLARATION  
I, ${fullName}, of ${address}, ${state}, declare this to be my last will.

3. APPOINTMENT OF EXECUTOR  
I appoint ${executorName}${executorContact ? ` (${executorContact})` : ""} as Executor of this will.

4. NEXT OF KIN / NOMINATED CONTACT  
I record ${nextOfKinName || "[Not specified]"} as my next of kin / nominated contact for the administration of my estate and practical matters following my death.

5. LAWYER  
I record ${lawyerName || "[Not specified]"}${lawyerContact ? ` (${lawyerContact})` : ""} as my preferred legal practitioner to assist in administering my estate.

6. DISPOSITION OF ESTATE  
I give, devise and bequeath all of my estate, both real and personal, as follows:
${beneficiariesSummary || "[You must specify your beneficiaries and the shares or gifts they receive]."}

Assets overview (for reference only, not exhaustive or limiting):  
${assetsSummary || "[You have not provided any assets summary]"}

7. FUNERAL AND REMAINS  
My non-binding wish is as follows:  
${funeralWishes || "[No specific funeral wishes stated]"}

8. CUSTOM INSTRUCTIONS  
${customInstructions || "[No additional instructions]"}

9. THIRD PARTY ACCESS TO THIS WILL  
No third party (including any next of kin, lawyer or other person) is to be granted access to or copies of this will by any custodian platform unless and until a valid Australian death certificate in respect of me has been provided and electronically verified against the records of the relevant Australian registry via a secure government-integrated API, or by other legally accepted proof-of-death mechanism.

10. ATTESTATION  
Signed as a will by ${fullName} in the presence of the witnesses named below, who were present at the same time, and who each signed this will in my presence and in the presence of each other.

_____________________________  
Signature of testator: ${fullName}  

Witness 1: _____________________________  
Name: _________________________________  
Address: ______________________________  

Witness 2: _____________________________  
Name: _________________________________  
Address: ______________________________  
`;
  }

  // Return the generated will text; note that this route does not save the data to db
  res.json({ willText });
});

// Retrieve the current user's will
app.get("/api/will", authMiddleware, (req, res) => {
  const db = loadDb();
  const will = db.wills.find(w => w.userId === req.user.id);
  if (!will) return res.status(404).json({ error: "No will found for this user" });
  res.json({ willId: will.id, willText: will.willText, data: will.data });
});

// Stubbed death certificate validation
async function validateDeathCertificateStub({ certificateNumber }) {
  if (certificateNumber === "TEST-OK") return { valid: true, issuer: "Stub BDM API" };
  return { valid: false, issuer: "Stub BDM API" };
}

// Request access to a will by submitting a death certificate
app.post("/api/will/request-access", async (req, res) => {
  const { certificateNumber, deceasedFullName, dob, requesterEmail } = req.body || {};

  if (!certificateNumber || !deceasedFullName || !dob || !requesterEmail) {
    return res.status(400).json({ error: "All fields required" });
  }

  const db = loadDb();
  const will = db.wills.find(
    w => (w.testatorFullName || "").toLowerCase().trim() === deceasedFullName.toLowerCase().trim()
  );
  if (!will) {
    return res.status(404).json({ error: "No will found for that name" });
  }

  const validation = await validateDeathCertificateStub({ certificateNumber, deceasedFullName, dob });

  const accessReq = {
    id: genId(),
    willId: will.id,
    certificateNumber,
    deceasedFullName,
    dob,
    requesterEmail,
    createdAt: new Date().toISOString(),
    valid: validation.valid
  };
  db.accessRequests.push(accessReq);
  saveDb(db);

  if (!validation.valid) {
    return res.status(403).json({
      error: "Death certificate could not be validated",
      detail: "Stub validation failed. Use TEST-OK as certificate number to simulate success."
    });
  }

  // In production you would not return the will text directly; you would handle access more securely.
  res.json({
    message: "Access granted (stubbed). In production, this would be controlled and audited.",
    willText: will.willText
  });
});

// Serve the SPA fallback for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});