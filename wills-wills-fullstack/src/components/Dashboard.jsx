import React from 'react'
import { NavLink } from 'react-router-dom'

export function Dashboard() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Good evening, Alex.</h1>
          <p className="text-sm text-gray-600">
            Here&apos;s where your estate plan stands right now.
          </p>
        </div>
        <div className="flex gap-2">
          <NavLink
            to="/questionnaire"
            className="px-4 py-2 rounded-2xl border border-gray-300 text-xs font-medium hover:border-black"
          >
            Edit will
          </NavLink>
          <button className="px-4 py-2 rounded-2xl bg-black text-white text-xs font-semibold">
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 items-start">
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Overview</p>
                <p className="text-sm font-semibold mt-1">Your will</p>
              </div>
              <span className="px-3 py-1 text-[11px] rounded-full bg-ww-bg text-gray-700">
                In draft
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Your will is currently in draft. To finalise it, you&apos;ll need to confirm your
              executors and sign the document.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <CardStat label="Questionnaire" value="78% complete" />
              <CardStat label="Beneficiaries" value="3 added" />
              <CardStat label="Executors" value="1 of 2 confirmed" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/60 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-3">
              Next suggested actions
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>• Confirm your backup executor</li>
              <li>• Add instructions for digital assets and accounts</li>
              <li>• Add a short note to your beneficiaries</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/60 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-3">
              Account onboarding
            </p>
            <p className="text-sm text-gray-700 mb-3">
              Finish onboarding to unlock reminders and secure sharing with your executor.
            </p>
            <NavLink
              to="/onboarding"
              className="inline-flex items-center px-4 py-2 rounded-2xl bg-ww-green text-white text-xs font-semibold"
            >
              Continue onboarding
            </NavLink>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/60 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-3">Billing</p>
            <p className="text-sm text-gray-700 mb-2">
              You&apos;re on the <span className="font-semibold">Full Will Package</span>.
            </p>
            <NavLink
              to="/billing"
              className="inline-flex items-center px-4 py-2 rounded-2xl border border-gray-300 text-xs font-medium hover:border-black"
            >
              View billing details
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function CardStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-ww-bg px-3 py-3">
      <p className="text-[11px] text-gray-500 mb-1">{label}</p>
      <p className="text-xs font-semibold">{value}</p>
    </div>
  )
}
