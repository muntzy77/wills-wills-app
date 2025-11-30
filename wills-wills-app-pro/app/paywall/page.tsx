"use client";

import { useState } from "react";

export default function Paywall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Could not start checkout.");
      }
    } catch {
      setError("Something went wrong starting checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-soft max-w-lg mx-auto p-8 space-y-6 text-center">
      <div className="badge-soft mx-auto">Will Builder Access</div>
      <h1 className="text-3xl font-semibold tracking-tight">
        Unlock your Will in minutes
      </h1>
      <p className="text-neutral-600">
        Get instant access to the guided Will Builder, smart prompts, PDF
        export, and secure storage. One simple price.
      </p>

      <div className="space-y-2">
        <p className="text-4xl font-semibold">$29</p>
        <p className="text-xs text-neutral-500">
          One-time payment. No ongoing fees.
        </p>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium bg-black text-white hover:opacity-90 disabled:opacity-60 w-full"
      >
        {loading ? "Redirecting..." : "Pay with card (Stripe)"}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <p className="text-[11px] text-neutral-400">
        This tool does not replace legal advice. For complex estates, speak
        to a solicitor.
      </p>
    </div>
  );
}
