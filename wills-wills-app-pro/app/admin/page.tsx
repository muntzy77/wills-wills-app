"use client";

import { useEffect, useState } from "react";

type Submission = {
  id: string;
  createdAt: string;
  summary: string;
};

export default function AdminPage() {
  const [subs, setSubs] = useState<Submission[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("wills_wills_submissions");
    if (stored) {
      setSubs(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Admin overview</h1>
      <p className="text-xs text-neutral-500">
        Prototype-only view of stored drafts in this browser. In a real build,
        this would connect to a database and Stripe webhooks.
      </p>

      <div className="card-soft p-4 space-y-3">
        {subs.length === 0 ? (
          <p className="text-xs text-neutral-500">
            No local submissions recorded yet.
          </p>
        ) : (
          <ul className="space-y-2 text-xs">
            {subs.map((s) => (
              <li
                key={s.id}
                className="flex items-start justify-between gap-3 border-b last:border-0 border-neutral-100 pb-2"
              >
                <div>
                  <p className="font-medium">{s.summary}</p>
                  <p className="text-[10px] text-neutral-500">
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-[10px] rounded-full bg-brand-50 text-brand-700 px-2 py-0.5">
                  local
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
