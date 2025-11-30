import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export function Paywall() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed')
      }
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <section className="px-6 md:px-16 lg:px-32 py-20">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black mb-4">
          Unlock the full Will&apos;s Wills experience.
        </h1>
        <p className="text-gray-600 mb-8 max-w-xl">
          Your personalised questionnaire, will document, secure storage and ongoing updates are
          available on our paid plan. No subscriptions. One simple price.
        </p>
      </div>

      <div className="grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-start">
        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-2">Full Will Package</h2>
          <p className="text-gray-600 text-sm mb-6">
            Perfect for individuals and couples who want a modern, legally-sound will without the
            awkward lawyer meetings.
          </p>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-5xl font-black">$149</span>
            <span className="text-gray-500 mb-2 text-sm">once-off</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-700 mb-8">
            <li>✓ Guided smart questionnaire</li>
            <li>✓ Lawyer-designed output templates</li>
            <li>✓ Secure cloud storage</li>
            <li>✓ Unlimited updates for 5 years</li>
            <li>✓ PDF export and print-ready copy</li>
          </ul>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="block w-full text-center px-6 py-3 rounded-2xl bg-black text-white text-sm font-semibold mb-2 disabled:opacity-60"
          >
            {loading ? 'Redirecting to checkout…' : 'Continue to payment'}
          </button>
          {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
          <p className="text-[11px] text-gray-500 mt-2">
            You&apos;ll be redirected to a secure Stripe checkout page.
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-600">
          <div className="bg-white rounded-3xl p-6 border border-dashed border-gray-300">
            <h3 className="text-sm font-semibold mb-2">Questionnaire is behind the paywall</h3>
            <p>
              To protect your data and keep our documents up to date with current legislation, we
              run the full questionnaire inside your secure account.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100">
            <h3 className="text-sm font-semibold mb-2">Want to see how it looks first?</h3>
            <p className="mb-3">
              We&apos;ve created a short demo version of the questionnaire so you can get a feel for
              the flow.
            </p>
            <NavLink
              to="/questionnaire"
              className="inline-flex items-center px-5 py-2 rounded-2xl border border-gray-300 text-xs font-medium hover:border-black"
            >
              View demo questionnaire
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}
