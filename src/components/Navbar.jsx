import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import YearSelector from './YearSelector'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Hem' },
    { to: '/tournaments', label: 'Tävlingar' },
    { to: '/stats', label: 'Statistik' },
    { to: '/historia', label: 'Historia' },
    { to: '/stadgar', label: 'Stadgar' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">&#9971;</span>
            <span className="font-bold text-xl">Touren</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive(link.to)
                    ? 'bg-green-700 text-white'
                    : 'hover:bg-green-700/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {import.meta.env.DEV && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-md transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-green-700 text-white'
                    : 'hover:bg-green-700/50'
                }`}
              >
                Admin
              </Link>
            )}
            <div className="ml-4 pl-4 border-l border-green-600">
              <YearSelector />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-green-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-2 rounded-md transition-colors ${
                  isActive(link.to)
                    ? 'bg-green-700 text-white'
                    : 'hover:bg-green-700/50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {import.meta.env.DEV && (
              <Link
                to="/admin"
                className={`block px-4 py-2 rounded-md transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-green-700 text-white'
                    : 'hover:bg-green-700/50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="px-4 py-2 border-t border-green-600 mt-2 pt-2">
              <YearSelector />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
