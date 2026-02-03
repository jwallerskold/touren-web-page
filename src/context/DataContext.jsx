import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const DataContext = createContext()

const API_URL = 'http://localhost:3001/api'
const IS_PRODUCTION = import.meta.env.PROD

export function DataProvider({ children }) {
  const [players, setPlayers] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [results, setResults] = useState([])
  const [punishments, setPunishments] = useState([])
  const [rules, setRules] = useState('')
  const [history, setHistory] = useState([])
  const [sitePassword, setSitePassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Admin password stored in session
  const getAdminPassword = () => sessionStorage.getItem('adminPassword') || ''

  // Fetch all data - from static file in production, from API in development
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const dataUrl = IS_PRODUCTION ? '/data/data.json' : `${API_URL}/data`
      const response = await fetch(dataUrl)
      if (!response.ok) throw new Error('Failed to fetch data')
      const data = await response.json()

      setPlayers(data.players)
      setTournaments(data.tournaments)
      setResults(data.results)
      setPunishments(data.punishments)
      setRules(data.rules)
      setHistory(data.history || [])
      setSitePassword(data.sitePassword || '')
    } catch (err) {
      setError(err.message)
      console.error('Error fetching data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Helper for authenticated requests
  const authFetch = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': getAdminPassword(),
        ...options.headers,
      },
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Request failed')
    }
    return response.json()
  }

  // Verify admin password
  const verifyPassword = async (password) => {
    try {
      const response = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (data.success) {
        sessionStorage.setItem('adminPassword', password)
        return true
      }
      return false
    } catch (err) {
      console.error('Auth error:', err)
      return false
    }
  }

  // CRUD operations for Players
  const addPlayer = async (player) => {
    const newPlayer = await authFetch(`${API_URL}/players`, {
      method: 'POST',
      body: JSON.stringify(player),
    })
    setPlayers(prev => [...prev, newPlayer])
    return newPlayer
  }

  const updatePlayer = async (id, updates) => {
    const updated = await authFetch(`${API_URL}/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    setPlayers(prev => prev.map(p => p.id === id ? updated : p))
  }

  const deletePlayer = async (id) => {
    await authFetch(`${API_URL}/players/${id}`, { method: 'DELETE' })
    setPlayers(prev => prev.filter(p => p.id !== id))
    setResults(prev => prev.filter(r => r.playerId !== id))
    setPunishments(prev => prev.filter(p => p.playerId !== id))
  }

  // CRUD operations for Tournaments
  const addTournament = async (tournament) => {
    const newTournament = await authFetch(`${API_URL}/tournaments`, {
      method: 'POST',
      body: JSON.stringify(tournament),
    })
    setTournaments(prev => [...prev, newTournament])
    return newTournament
  }

  const updateTournament = async (id, updates) => {
    const updated = await authFetch(`${API_URL}/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    setTournaments(prev => prev.map(t => t.id === id ? updated : t))
  }

  const deleteTournament = async (id) => {
    await authFetch(`${API_URL}/tournaments/${id}`, { method: 'DELETE' })
    setTournaments(prev => prev.filter(t => t.id !== id))
    setResults(prev => prev.filter(r => r.tournamentId !== id))
  }

  // Bulk update results for a tournament
  const setTournamentResults = async (tournamentId, tournamentResults) => {
    const newResults = await authFetch(`${API_URL}/results/tournament/${tournamentId}`, {
      method: 'PUT',
      body: JSON.stringify(tournamentResults),
    })
    setResults(prev => {
      const otherResults = prev.filter(r => r.tournamentId !== tournamentId)
      return [...otherResults, ...newResults]
    })
  }

  // CRUD operations for Punishments
  const addPunishment = async (punishment) => {
    const newPunishment = await authFetch(`${API_URL}/punishments`, {
      method: 'POST',
      body: JSON.stringify(punishment),
    })
    setPunishments(prev => [...prev, newPunishment])
    return newPunishment
  }

  const deletePunishment = async (id) => {
    await authFetch(`${API_URL}/punishments/${id}`, { method: 'DELETE' })
    setPunishments(prev => prev.filter(p => p.id !== id))
  }

  // Save rules
  const saveRules = async (content) => {
    await authFetch(`${API_URL}/rules`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    })
    setRules(content)
  }

  // CRUD operations for History
  const addHistoryYear = async (yearData) => {
    const newYear = await authFetch(`${API_URL}/history`, {
      method: 'POST',
      body: JSON.stringify(yearData),
    })
    setHistory(prev => [...prev, newYear])
    return newYear
  }

  const updateHistoryYear = async (year, updates) => {
    const updated = await authFetch(`${API_URL}/history/${year}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    setHistory(prev => prev.map(h => h.year === year ? updated : h))
  }

  const deleteHistoryYear = async (year) => {
    await authFetch(`${API_URL}/history/${year}`, { method: 'DELETE' })
    setHistory(prev => prev.filter(h => h.year !== year))
  }

  // Reset all data
  const resetData = async () => {
    await authFetch(`${API_URL}/reset`, { method: 'POST' })
    await fetchData()
  }

  const value = {
    // Data
    players,
    tournaments,
    results,
    punishments,
    rules,
    history,
    sitePassword,
    isLoading,
    error,

    // Auth
    verifyPassword,
    getAdminPassword,

    // Refresh data
    refreshData: fetchData,

    // Player operations
    addPlayer,
    updatePlayer,
    deletePlayer,

    // Tournament operations
    addTournament,
    updateTournament,
    deleteTournament,

    // Result operations
    setTournamentResults,

    // Punishment operations
    addPunishment,
    deletePunishment,

    // Rules
    saveRules,

    // History operations
    addHistoryYear,
    updateHistoryYear,
    deleteHistoryYear,

    // Reset
    resetData,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
