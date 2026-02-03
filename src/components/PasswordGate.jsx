import { useState, useEffect } from 'react'

const STORAGE_KEY = 'touren-site-auth'

export default function PasswordGate({ sitePassword, children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if already authenticated
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored === 'true') {
      setIsAuthenticated(true)
    }
    setIsChecking(false)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (password === sitePassword) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setIsAuthenticated(true)
    } else {
      setError('Fel lösenord')
      setPassword('')
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <div className="text-white">Laddar...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return children
  }

  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Touren</h1>
          <p className="text-gray-600">Ange lösenord för att komma in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lösenord"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-center text-lg"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-600 text-center text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Logga in
          </button>
        </form>
      </div>
    </div>
  )
}
