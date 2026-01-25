import { createContext, useContext, useState, useEffect } from 'react'
import { initialPlayers } from '../data/initialPlayers'
import { initialTournaments } from '../data/initialTournaments'
import { initialResults } from '../data/initialResults'
import { initialPunishments } from '../data/initialPunishments'
import { initialRules } from '../data/initialRules'
import { generateId } from '../utils/calculations'

const DataContext = createContext()

const STORAGE_KEYS = {
  players: 'golfTour_players',
  tournaments: 'golfTour_tournaments',
  results: 'golfTour_results',
  punishments: 'golfTour_punishments',
  rules: 'golfTour_rules',
  initialized: 'golfTour_initialized',
}

export function DataProvider({ children }) {
  const [players, setPlayers] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [results, setResults] = useState([])
  const [punishments, setPunishments] = useState([])
  const [rules, setRules] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.initialized)

    if (isInitialized) {
      // Load existing data
      setPlayers(JSON.parse(localStorage.getItem(STORAGE_KEYS.players) || '[]'))
      setTournaments(JSON.parse(localStorage.getItem(STORAGE_KEYS.tournaments) || '[]'))
      setResults(JSON.parse(localStorage.getItem(STORAGE_KEYS.results) || '[]'))
      setPunishments(JSON.parse(localStorage.getItem(STORAGE_KEYS.punishments) || '[]'))
      setRules(localStorage.getItem(STORAGE_KEYS.rules) || '')
    } else {
      // Initialize with seed data
      setPlayers(initialPlayers)
      setTournaments(initialTournaments)
      setResults(initialResults)
      setPunishments(initialPunishments)
      setRules(initialRules)

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.players, JSON.stringify(initialPlayers))
      localStorage.setItem(STORAGE_KEYS.tournaments, JSON.stringify(initialTournaments))
      localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(initialResults))
      localStorage.setItem(STORAGE_KEYS.punishments, JSON.stringify(initialPunishments))
      localStorage.setItem(STORAGE_KEYS.rules, initialRules)
      localStorage.setItem(STORAGE_KEYS.initialized, 'true')
    }

    setIsLoading(false)
  }, [])

  // Save helpers
  const savePlayers = (newPlayers) => {
    setPlayers(newPlayers)
    localStorage.setItem(STORAGE_KEYS.players, JSON.stringify(newPlayers))
  }

  const saveTournaments = (newTournaments) => {
    setTournaments(newTournaments)
    localStorage.setItem(STORAGE_KEYS.tournaments, JSON.stringify(newTournaments))
  }

  const saveResults = (newResults) => {
    setResults(newResults)
    localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(newResults))
  }

  const savePunishments = (newPunishments) => {
    setPunishments(newPunishments)
    localStorage.setItem(STORAGE_KEYS.punishments, JSON.stringify(newPunishments))
  }

  const saveRules = (newRules) => {
    setRules(newRules)
    localStorage.setItem(STORAGE_KEYS.rules, newRules)
  }

  // CRUD operations for Players
  const addPlayer = (player) => {
    const newPlayer = { ...player, id: generateId('player') }
    savePlayers([...players, newPlayer])
    return newPlayer
  }

  const updatePlayer = (id, updates) => {
    savePlayers(players.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deletePlayer = (id) => {
    savePlayers(players.filter(p => p.id !== id))
    // Also delete related results and punishments
    saveResults(results.filter(r => r.playerId !== id))
    savePunishments(punishments.filter(p => p.playerId !== id))
  }

  // CRUD operations for Tournaments
  const addTournament = (tournament) => {
    const newTournament = { ...tournament, id: generateId('round') }
    saveTournaments([...tournaments, newTournament])
    return newTournament
  }

  const updateTournament = (id, updates) => {
    saveTournaments(tournaments.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTournament = (id) => {
    saveTournaments(tournaments.filter(t => t.id !== id))
    // Also delete related results
    saveResults(results.filter(r => r.tournamentId !== id))
  }

  // CRUD operations for Results
  const addResult = (result) => {
    const newResult = { ...result, id: generateId('result') }
    saveResults([...results, newResult])
    return newResult
  }

  const updateResult = (id, updates) => {
    saveResults(results.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  const deleteResult = (id) => {
    saveResults(results.filter(r => r.id !== id))
  }

  // Bulk add/update results for a tournament
  const setTournamentResults = (tournamentId, tournamentResults) => {
    // Remove existing results for this tournament
    const otherResults = results.filter(r => r.tournamentId !== tournamentId)
    // Add new results with IDs
    const newResults = tournamentResults.map(r => ({
      ...r,
      id: r.id || generateId('result'),
      tournamentId,
    }))
    saveResults([...otherResults, ...newResults])
  }

  // CRUD operations for Punishments
  const addPunishment = (punishment) => {
    const newPunishment = { ...punishment, id: generateId('pun') }
    savePunishments([...punishments, newPunishment])
    return newPunishment
  }

  const updatePunishment = (id, updates) => {
    savePunishments(punishments.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deletePunishment = (id) => {
    savePunishments(punishments.filter(p => p.id !== id))
  }

  // Reset all data to initial state
  const resetData = () => {
    savePlayers(initialPlayers)
    saveTournaments(initialTournaments)
    saveResults(initialResults)
    savePunishments(initialPunishments)
    saveRules(initialRules)
  }

  const value = {
    // Data
    players,
    tournaments,
    results,
    punishments,
    rules,
    isLoading,

    // Player operations
    addPlayer,
    updatePlayer,
    deletePlayer,

    // Tournament operations
    addTournament,
    updateTournament,
    deleteTournament,

    // Result operations
    addResult,
    updateResult,
    deleteResult,
    setTournamentResults,

    // Punishment operations
    addPunishment,
    updatePunishment,
    deletePunishment,

    // Rules
    saveRules,

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
