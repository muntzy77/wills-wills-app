import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Landing } from './components/Landing'
import { Paywall } from './components/Paywall'
import { Questionnaire } from './components/Questionnaire'
import { Dashboard } from './components/Dashboard'
import { Onboarding } from './components/Onboarding'
import { Billing } from './components/Billing'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/paywall" element={<Paywall />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

function NotFound() {
  return (
    <div className="px-6 md:px-16 lg:px-32 py-24">
      <h1 className="text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-600 mb-6">
        The page you’re looking for doesn’t exist. Try heading back to the dashboard.
      </p>
      <NavLink
        to="/"
        className="inline-flex items-center px-5 py-3 rounded-2xl bg-black text-white text-sm font-semibold"
      >
        Go home
      </NavLink>
    </div>
  )
}
