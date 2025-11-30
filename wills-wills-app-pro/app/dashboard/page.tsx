"use client";

import { useState, useEffect } from "react";
import Questionnaire from "@/components/Questionnaire";

export default function Dashboard() {
  const [draft, setDraft] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("wills_wills_draft");
    if (stored) setDraft(stored);
  }, []);

  function handleDraftChange(text: string) {
    setDraft(text);
    window.localStorage.setItem("wills_wills_draft", text);
  }

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch("/api/generate", { method: "POST" });
    const data = await res.json();
    setGenerated(data.result);
    setLoading(false);
  }

  async function handleDownloadPdf() {
    const res = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: generated || draft }),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "will-draft.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Your Will Builder
          </h1>
          <p className="text-sm text-neutral-500">
            Answer the guided questions, then refine with AI and export as PDF.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-2xl px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate with AI"}
        </button>
      </section>

      <Questionnaire onDraftChange={handleDraftChange} />

      <section className="card-soft p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-700">
            Draft output
          </h2>
          <button
            onClick={handleDownloadPdf}
            className="text-xs rounded-full border border-neutral-300 px-3 py-1 hover:bg-neutral-50"
          >
            Download PDF
          </button>
        </div>
        <pre className="text-xs text-neutral-800 whitespace-pre-wrap min-h-[160px]">
          {generated || draft || "Your draft will appears here once you fill in the questionnaire or generate with AI."}
        </pre>
      </section>
    </div>
  );
}
