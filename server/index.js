import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Helper to read/write JSON files
const dataPath = (file) => join(__dirname, 'data', file)

const readData = (file) => {
  try {
    return JSON.parse(readFileSync(dataPath(file), 'utf-8'))
  } catch (err) {
    console.error(`Error reading ${file}:`, err)
    return file === 'rules.json' ? { content: '' } : []
  }
}

const writeData = (file, data) => {
  writeFileSync(dataPath(file), JSON.stringify(data, null, 2))
}

// Auth middleware
const checkAuth = (req, res, next) => {
  const password = req.headers['x-admin-password']
  const config = readData('config.json')
  if (password !== config.adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// Generate unique ID
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// ============ PUBLIC ROUTES (no auth) ============

// Get all data at once (for initial load)
app.get('/api/data', (req, res) => {
  const config = readData('config.json')
  res.json({
    players: readData('players.json'),
    tournaments: readData('tournaments.json'),
    results: readData('results.json'),
    punishments: readData('punishments.json'),
    rules: readData('rules.json').content,
    history: readData('history.json'),
    sitePassword: config.sitePassword || '',
    currentYear: config.currentYear || new Date().getFullYear(),
  })
})

// Get individual collections
app.get('/api/players', (req, res) => res.json(readData('players.json')))
app.get('/api/tournaments', (req, res) => res.json(readData('tournaments.json')))
app.get('/api/results', (req, res) => res.json(readData('results.json')))
app.get('/api/punishments', (req, res) => res.json(readData('punishments.json')))
app.get('/api/rules', (req, res) => res.json(readData('rules.json')))
app.get('/api/history', (req, res) => res.json(readData('history.json')))

// Verify admin password
app.post('/api/auth', (req, res) => {
  const { password } = req.body
  const config = readData('config.json')
  if (password === config.adminPassword) {
    res.json({ success: true })
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' })
  }
})

// ============ PROTECTED ROUTES (require auth) ============

// Players CRUD
app.post('/api/players', checkAuth, (req, res) => {
  const players = readData('players.json')
  const newPlayer = { ...req.body, id: generateId('player') }
  players.push(newPlayer)
  writeData('players.json', players)
  res.json(newPlayer)
})

app.put('/api/players/:id', checkAuth, (req, res) => {
  const players = readData('players.json')
  const index = players.findIndex(p => p.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Player not found' })
  players[index] = { ...players[index], ...req.body }
  writeData('players.json', players)
  res.json(players[index])
})

app.delete('/api/players/:id', checkAuth, (req, res) => {
  let players = readData('players.json')
  let results = readData('results.json')
  let punishments = readData('punishments.json')

  players = players.filter(p => p.id !== req.params.id)
  results = results.filter(r => r.playerId !== req.params.id)
  punishments = punishments.filter(p => p.playerId !== req.params.id)

  writeData('players.json', players)
  writeData('results.json', results)
  writeData('punishments.json', punishments)
  res.json({ success: true })
})

// Tournaments CRUD
app.post('/api/tournaments', checkAuth, (req, res) => {
  const tournaments = readData('tournaments.json')
  const newTournament = { ...req.body, id: generateId('round') }
  tournaments.push(newTournament)
  writeData('tournaments.json', tournaments)
  res.json(newTournament)
})

app.put('/api/tournaments/:id', checkAuth, (req, res) => {
  const tournaments = readData('tournaments.json')
  const index = tournaments.findIndex(t => t.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Tournament not found' })
  tournaments[index] = { ...tournaments[index], ...req.body }
  writeData('tournaments.json', tournaments)
  res.json(tournaments[index])
})

app.delete('/api/tournaments/:id', checkAuth, (req, res) => {
  let tournaments = readData('tournaments.json')
  let results = readData('results.json')

  tournaments = tournaments.filter(t => t.id !== req.params.id)
  results = results.filter(r => r.tournamentId !== req.params.id)

  writeData('tournaments.json', tournaments)
  writeData('results.json', results)
  res.json({ success: true })
})

// Results - bulk update for a tournament
app.put('/api/results/tournament/:tournamentId', checkAuth, (req, res) => {
  let results = readData('results.json')
  const tournamentId = req.params.tournamentId

  // Remove existing results for this tournament
  results = results.filter(r => r.tournamentId !== tournamentId)

  // Add new results
  const newResults = req.body.map(r => ({
    ...r,
    id: r.id || generateId('result'),
    tournamentId,
  }))
  results = [...results, ...newResults]

  writeData('results.json', results)
  res.json(newResults)
})

// Punishments CRUD
app.post('/api/punishments', checkAuth, (req, res) => {
  const punishments = readData('punishments.json')
  const newPunishment = { ...req.body, id: generateId('pun') }
  punishments.push(newPunishment)
  writeData('punishments.json', punishments)
  res.json(newPunishment)
})

app.delete('/api/punishments/:id', checkAuth, (req, res) => {
  let punishments = readData('punishments.json')
  punishments = punishments.filter(p => p.id !== req.params.id)
  writeData('punishments.json', punishments)
  res.json({ success: true })
})

// Rules
app.put('/api/rules', checkAuth, (req, res) => {
  writeData('rules.json', { content: req.body.content })
  res.json({ success: true })
})

// History CRUD
app.post('/api/history', checkAuth, (req, res) => {
  const history = readData('history.json')
  const newYear = { ...req.body, id: generateId('history') }
  history.push(newYear)
  writeData('history.json', history)
  res.json(newYear)
})

app.put('/api/history/:year', checkAuth, (req, res) => {
  const history = readData('history.json')
  const index = history.findIndex(h => h.year === parseInt(req.params.year))
  if (index === -1) return res.status(404).json({ error: 'Year not found' })
  history[index] = { ...history[index], ...req.body }
  writeData('history.json', history)
  res.json(history[index])
})

app.delete('/api/history/:year', checkAuth, (req, res) => {
  let history = readData('history.json')
  history = history.filter(h => h.year !== parseInt(req.params.year))
  writeData('history.json', history)
  res.json({ success: true })
})

// Reset all data
app.post('/api/reset', checkAuth, (req, res) => {
  // Read from backup/initial files or use hardcoded defaults
  const initialData = {
    players: [
      { id: 'player-1', name: 'Johan Andersson', handicap: 15.2 },
      { id: 'player-2', name: 'Erik Svensson', handicap: 12.5 },
      { id: 'player-3', name: 'Lars Karlsson', handicap: 18.0 },
      { id: 'player-4', name: 'Anders Nilsson', handicap: 8.4 },
      { id: 'player-5', name: 'Magnus Persson', handicap: 22.1 },
    ],
    results: [
      { id: 'r1-p4', tournamentId: 'round-1', playerId: 'player-4', grossScore: 78, netScore: 70, points: 10, position: 1 },
      { id: 'r1-p2', tournamentId: 'round-1', playerId: 'player-2', grossScore: 82, netScore: 71, points: 8, position: 2 },
      { id: 'r1-p1', tournamentId: 'round-1', playerId: 'player-1', grossScore: 88, netScore: 74, points: 6, position: 3 },
      { id: 'r1-p3', tournamentId: 'round-1', playerId: 'player-3', grossScore: 92, netScore: 78, points: 5, position: 4 },
      { id: 'r1-p5', tournamentId: 'round-1', playerId: 'player-5', grossScore: 98, netScore: 81, points: 4, position: 5 },
    ],
    punishments: [
      { id: 'pun-1', playerId: 'player-1', tournamentId: 'round-1', amount: 20, reason: '3-putt på hål 5' },
      { id: 'pun-2', playerId: 'player-3', tournamentId: 'round-1', amount: 30, reason: 'Tappad boll på hål 12' },
      { id: 'pun-3', playerId: 'player-5', tournamentId: 'round-1', amount: 50, reason: 'Bunker till bunker på hål 7' },
      { id: 'pun-4', playerId: 'player-2', tournamentId: 'round-1', amount: 25, reason: 'Vatten på hål 3' },
    ],
  }

  writeData('players.json', initialData.players)
  writeData('results.json', initialData.results)
  writeData('punishments.json', initialData.punishments)

  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api/data`)
})
