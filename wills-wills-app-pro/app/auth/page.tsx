"use client";

import { useEffect, useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("wills_wills_user");
    if (stored) setSavedEmail(stored);
  }, []);

  function handleLogin() {
    window.localStorage.setItem("wills_wills_user", email);
    setSavedEmail(email);
    setEmail("");
  }

  function handleLogout() {
    window.localStorage.removeItem("wills_wills_user");
    setSavedEmail(null);
  }

  return (
    <div className="card-soft max-w-md mx-auto p-8 space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight text-center">
        Sign in
      </h1>
      <p className="text-xs text-neutral-500 text-center">
        Lightweight account using your email stored in this browser. Not
        production authentication, but enough to personalise drafts.
      </p>

      {savedEmail ? (
        <div className="space-y-3 text-center">
          <p className="text-sm">
            Signed in as <span className="font-medium">{savedEmail}</span>
          </p>
          <button
            onClick={handleLogout}
            className="text-xs rounded-full border border-neutral-300 px-4 py-1 hover:bg-neutral-50"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <button
            onClick={handleLogin}
            className="w-full rounded-2xl px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90"
          >
            Save email
          </button>
        </div>
      )}
    </div>
  );
}
