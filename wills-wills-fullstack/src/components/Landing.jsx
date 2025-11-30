import React from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

export function Landing() {
  return (
    <section className="px-6 md:px-16 lg:px-32 pt-16 pb-24">
      <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm shadow-gray-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-ww-green" />
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-700">
              Life admin, done
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
            The world’s easiest way to create your will.
          </h1>
          <p className="mt-6 text-base md:text-lg text-gray-600 max-w-xl">
            No lawyers. No jargon. No doom. Just a guided experience that turns
            &quot;I should really sort my will&quot; into a 10-minute task.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <NavLink
              to="/paywall"
              className="px-7 py-3 rounded-2xl bg-ww-green text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Start my will
            </NavLink>
            <a
              href="#how-it-works"
              className="px-7 py-3 rounded-2xl border border-gray-300 text-sm font-medium hover:border-black transition"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Built for Australians. Bank-level encryption. Update anytime.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute -top-10 -right-4 w-40 h-40 rounded-[35px] bg-[#EAFBF2] blur-3xl opacity-70" />
          <div className="relative rounded-[32px] bg-white p-6 shadow-xl shadow-gray-200/70 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  Snapshot
                </p>
                <p className="text-sm font-semibold mt-1">Your estate plan</p>
              </div>
              <span className="px-3 py-1 text-[11px] rounded-full bg-ww-bg text-gray-700">
                78% complete
              </span>
            </div>
            <div className="space-y-4 text-sm">
              <Row label="Primary will" value="Draft" tone="amber" />
              <Row label="Beneficiaries" value="3 added" tone="green" />
              <Row label="Executors" value="1 confirmed" tone="green" />
              <Row label="Final wishes" value="In progress" tone="grey" />
            </div>
            <button className="mt-6 w-full px-4 py-3 rounded-2xl bg-black text-white text-sm font-semibold">
              Resume questionnaire
            </button>
          </div>
        </motion.div>
      </div>

      <section id="how-it-works" className="mt-24 space-y-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-2xl md:text-3xl font-bold"
        >
          How Will&apos;s Wills works.
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Step
            step="01"
            title="Answer simple questions"
            body="We ask you human questions (not legal riddles) about your life, assets and people."
          />
          <Step
            step="02"
            title="We generate your will"
            body="Our engine turns your answers into a clean, legally-sound document ready to sign."
          />
          <Step
            step="03"
            title="Update anytime"
            body="Life changes. Kids, houses, relationships. Log in and adjust your will in minutes."
          />
        </div>
      </section>
    </section>
  )
}

function Row({ label, value, tone }) {
  const toneMap = {
    green: 'bg-ww-green/12 text-ww-green',
    amber: 'bg-amber-100 text-amber-700',
    grey: 'bg-gray-100 text-gray-700'
  }
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <span className={`px-3 py-1 rounded-full text-[11px] ${toneMap[tone] || toneMap.grey}`}>
        {value}
      </span>
    </div>
  )
}

function Step({ step, title, body }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-3xl bg-white shadow-sm shadow-gray-200/70 border border-gray-100"
    >
      <div className="text-[11px] font-mono text-gray-500 mb-2">Step {step}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{body}</p>
    </motion.div>
  )
}
