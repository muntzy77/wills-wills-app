import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export function Layout({ children }) {
  const location = useLocation()

  const isDashboardRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/onboarding') ||
    location.pathname.startsWith('/billing')

  return (
    <div className="min-h-screen flex flex-col bg-ww-bg">
      <header className="w-full py-4 px-6 md:px-12 lg:px-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center text-xs font-bold tracking-tight">
            WW
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight">
            Will&apos;s Wills
          </span>
        </NavLink>
        <nav className="hidden md:flex gap-8 text-[15px] text-gray-600">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-black font-medium' : 'hover:text-black transition-colors'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/paywall"
            className={({ isActive }) =>
              isActive ? 'text-black font-medium' : 'hover:text-black transition-colors'
            }
          >
            Pricing
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'text-black font-medium' : 'hover:text-black transition-colors'
            }
          >
            Dashboard
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <NavLink
            to="/login"
            className="hidden md:inline-flex text-sm text-gray-600 hover:text-black"
          >
            Log in
          </NavLink>
          <NavLink
            to={isDashboardRoute ? '/dashboard' : '/paywall'}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-black text-white text-sm font-semibold"
          >
            {isDashboardRoute ? 'Open app' : 'Get started'}
          </NavLink>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="px-6 md:px-16 lg:px-32 py-10 text-xs text-gray-500">
        © Will&apos;s Wills {new Date().getFullYear()} — All rights reserved.
      </footer>
    </div>
  )
}
