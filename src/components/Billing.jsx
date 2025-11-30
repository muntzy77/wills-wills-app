import React from 'react'

export function Billing() {
  return (
    <section className="px-6 md:px-16 lg:px-32 py-16">
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Billing & plan</h1>
          <p className="text-sm text-gray-600">
            Your payment details and plan. Contact support to update or request an invoice.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/60 p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-2">Your plan</p>
          <p className="text-sm font-semibold mb-1">Full Will Package</p>
          <p className="text-xs text-gray-500 mb-4">One-time payment · Lifetime document access</p>
          <p className="text-3xl font-black mb-2">$149</p>
          <p className="text-xs text-gray-500">
            Paid on 12 Oct 2025 • Next review reminder in 12 months
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/60 p-6 text-xs text-gray-600 space-y-2">
          <p className="font-semibold text-sm">Need help with billing?</p>
          <p>Email support@willswills.app and we&apos;ll get back to you within 1–2 business days.</p>
        </div>
      </div>
    </section>
  )
}
