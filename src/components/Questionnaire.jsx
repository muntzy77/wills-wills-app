import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  {
    id: 'about-you',
    title: 'About you',
    description: 'Tell us the basics about who you are.',
    fields: [
      { id: 'fullName', label: 'Full name', placeholder: 'Alex Example' },
      { id: 'dob', label: 'Date of birth', placeholder: 'DD/MM/YYYY' }
    ]
  },
  {
    id: 'relationships',
    title: 'Your people',
    description: 'Who and what matters most in your life?',
    fields: [
      { id: 'partner', label: 'Partner (optional)', placeholder: 'Name of partner' },
      {
        id: 'children',
        label: 'Children (optional)',
        placeholder: 'Names, separated by commas'
      }
    ]
  },
  {
    id: 'assets',
    title: 'Your assets',
    description: 'Give us a simple overview of what you own.',
    fields: [
      {
        id: 'property',
        label: 'Property',
        placeholder: 'Home, investment properties etc.'
      },
      {
        id: 'savings',
        label: 'Savings & investments',
        placeholder: 'Bank, shares, crypto...'
      }
    ]
  }
]

export function Questionnaire() {
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const isLast = stepIndex === steps.length - 1

  const handleChange = (fieldId, value) => {
    setForm(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleNext = () => {
    if (!isLast) setStepIndex(i => i + 1)
  }

  const handleBack = () => {
    setStepIndex(i => Math.max(0, i - 1))
  }

  const handleGeneratePreview = async () => {
    setLoading(true)
    setError('')
    setPreview(null)
    try {
      const res = await fetch('/api/will/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate preview')
      }
      setPreview(data.preview)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const current = steps[stepIndex]

  return (
    <section className="px-6 md:px-16 lg:px-32 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Demo questionnaire</h1>
            <p className="text-sm text-gray-600">
              This is a preview of the experience. The full version unlocks after payment.
            </p>
          </div>
          <span className="text-xs text-gray-500">
            Step {stepIndex + 1} of {steps.length}
          </span>
        </div>

        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-ww-green rounded-full transition-all"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6 items-start">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl shadow-sm shadow-gray-200/60 border border-gray-100 p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold mb-2">{current.title}</h2>
                <p className="text-sm text-gray-600 mb-6">{current.description}</p>
                <div className="space-y-4">
                  {current.fields.map(field => (
                    <div key={field.id}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={form[field.id] || ''}
                        onChange={e => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ww-green/70 focus:border-transparent bg-ww-bg"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={stepIndex === 0}
                className="text-xs text-gray-600 disabled:opacity-40 disabled:cursor-default"
              >
                Back
              </button>
              <div className="flex gap-2">
                {!isLast && (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-2xl bg-black text-white text-xs font-semibold"
                  >
                    Next
                  </button>
                )}
                {isLast && (
                  <button
                    onClick={handleGeneratePreview}
                    disabled={loading}
                    className="px-5 py-2 rounded-2xl bg-ww-green text-white text-xs font-semibold disabled:opacity-60"
                  >
                    {loading ? 'Generating preview…' : 'Generate sample will preview'}
                  </button>
                )}
              </div>
            </div>
            {error && <p className="mt-3 text-[11px] text-red-500">{error}</p>}
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/60 p-5 text-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-2">
                Sample output
              </p>
              {!preview && (
                <p className="text-gray-600">
                  When you finish the demo and click &quot;Generate sample will preview&quot;, a
                  short summary will appear here based on your answers.
                </p>
              )}
              {preview && (
                <div>
                  <p className="font-semibold mb-2">{preview.title}</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{preview.summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
