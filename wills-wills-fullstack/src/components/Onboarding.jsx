import React from 'react'

const steps = [
  {
    label: 'Verify your email',
    status: 'done',
    note: 'Completed'
  },
  {
    label: 'Add an emergency contact',
    status: 'current',
    note: 'Who should we contact if something happens?'
  },
  {
    label: 'Confirm your executor',
    status: 'upcoming',
    note: 'Tell us who will carry out your wishes.'
  }
]

export function Onboarding() {
  return (
    <section className="px-6 md:px-16 lg:px-32 py-16">
      <div className="max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Finish setting up your account</h1>
        <p className="text-sm text-gray-600 mb-8">
          A few quick steps so we can keep your will secure and easy to access when it matters.
        </p>

        <div className="space-y-3">
          {steps.map(step => (
            <div
              key={step.label}
              className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/60 p-4"
            >
              <StatusPill status={step.status} />
              <div>
                <p className="text-sm font-medium">{step.label}</p>
                <p className="text-xs text-gray-600 mt-1">{step.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatusPill({ status }) {
  if (status === 'done') {
    return (
      <span className="mt-1 px-2 py-1 rounded-full bg-ww-bg text-[10px] font-semibold text-ww-green">
        Done
      </span>
    )
  }
  if (status === 'current') {
    return (
      <span className="mt-1 px-2 py-1 rounded-full bg-black text-[10px] font-semibold text-white">
        Next
      </span>
    )
  }
  return (
    <span className="mt-1 px-2 py-1 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-500">
      Soon
    </span>
  )
}
