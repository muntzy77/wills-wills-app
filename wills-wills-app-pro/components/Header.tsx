"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("wills_wills_user");
    if (stored) setUser(stored);
  }, []);

  return (
    <header className="w-full border-b border-neutral-100 bg-white/70 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-xs font-semibold text-white">
            WW
          </div>
          <div className="text-sm">
            <div className="font-semibold tracking-tight">Will’s Wills</div>
            <div className="text-[11px] text-neutral-500">
              Estate planning, without the beige.
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3 text-[11px] text-neutral-500">
          {user && (
            <span className="hidden sm:inline text-neutral-600">
              {user}
            </span>
          )}
          <Link href="/auth" className="underline">
            {user ? "Account" : "Sign in"}
          </Link>
        </div>
      </div>
    </header>
  );
}
