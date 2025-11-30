import { NextResponse } from "next/server";

export async function POST() {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are generating a very clear, plain-English first draft of a simple Australian will. Keep it concise and structured.",
        },
        {
          role: "user",
          content:
            "Create a basic Australian will template with placeholders for name, executor, beneficiaries, specific gifts, guardians for minors, and residue of estate.",
        },
      ],
    }),
  });

  const data = await aiRes.json();

  return NextResponse.json({
    result: data.choices?.[0]?.message?.content || "No output from AI.",
  });
}
