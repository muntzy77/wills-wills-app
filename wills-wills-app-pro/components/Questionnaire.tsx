"use client";

import { useEffect, useState } from "react";

type Props = {
  onDraftChange: (text: string) => void;
};

export default function Questionnaire({ onDraftChange }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    executorName: "",
    executorAddress: "",
    beneficiaries: "",
    specificGifts: "",
    guardians: "",
    otherWishes: "",
  });

  useEffect(() => {
    const stored = window.localStorage.getItem("wills_wills_form");
    if (stored) {
      const parsed = JSON.parse(stored);
      setForm(parsed);
      buildDraft(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    window.localStorage.setItem("wills_wills_form", JSON.stringify(updated));
    buildDraft(updated);
  }

  function buildDraft(data: typeof form) {
    const draft = `
Last Will and Testament

I, ${data.fullName || "____________"}, of ${data.address ||
      "____________"}, revoke all former wills and testamentary dispositions and declare this to be my last will.

1. APPOINTMENT OF EXECUTOR
I appoint ${data.executorName ||
      "____________"}, of ${data.executorAddress ||
      "____________"}, to be the Executor of this will.

2. BENEFICIARIES
I leave the residue of my estate to:
${data.beneficiaries || "____________"}.

3. SPECIFIC GIFTS
${data.specificGifts || "None specified."}

4. GUARDIANS FOR MINOR CHILDREN
${data.guardians || "None specified or not applicable."}

5. OTHER WISHES
${data.otherWishes || "None specified."}

Signed as a will on _________ 20___.

__________________________
Testator

__________________________      __________________________
Witness 1                        Witness 2
`;
    onDraftChange(draft.trim());
  }

  const steps = [
    {
      title: "About you",
      fields: [
        {
          key: "fullName",
          label: "Full legal name",
          placeholder: "Full name as it appears on ID",
        },
        {
          key: "address",
          label: "Residential address",
          placeholder: "Street, suburb, state, postcode",
        },
      ],
    },
    {
      title: "Executor",
      fields: [
        {
          key: "executorName",
          label: "Executor’s name",
          placeholder: "Person you trust to handle your estate",
        },
        {
          key: "executorAddress",
          label: "Executor’s address",
          placeholder: "Their usual residential address",
        },
      ],
    },
    {
      title: "Beneficiaries & gifts",
      fields: [
        {
          key: "beneficiaries",
          label: "Who should receive your estate?",
          placeholder:
            "e.g. 100% to my partner, or 50% to each of my two children...",
        },
        {
          key: "specificGifts",
          label: "Any specific gifts?",
          placeholder:
            "e.g. My car to my sister, my record collection to my friend...",
        },
      ],
    },
    {
      title: "Guardians & other wishes",
      fields: [
        {
          key: "guardians",
          label: "Guardians for minors",
          placeholder:
            "If you have children under 18, who should care for them?",
        },
        {
          key: "otherWishes",
          label: "Other wishes",
          placeholder:
            "Funeral preferences or anything else you’d like noted.",
        },
      ],
    },
  ] as const;

  const current = steps[step];

  return (
    <section className="card-soft p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-700">
          Step {step + 1} of {steps.length}: {current.title}
        </h2>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full ${
                i <= step ? "bg-brand-500" : "bg-neutral-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {current.fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">
              {field.label}
            </label>
            <textarea
              rows={2}
              value={form[field.key as keyof typeof form]}
              onChange={(e) =>
                update(field.key as keyof typeof form, e.target.value)
              }
              placeholder={field.placeholder}
              className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="text-xs px-3 py-1 rounded-full border border-neutral-200 disabled:opacity-40"
        >
          Back
        </button>
        <button
          disabled={step === steps.length - 1}
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          className="text-xs px-3 py-1 rounded-full bg-black text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  );
}
