// Calculate leaderboard from results
export function calculateLeaderboard(players, results) {
  const playerStats = players.map(player => {
    const playerResults = results.filter(r => r.playerId === player.id)
    const totalPoints = playerResults.reduce((sum, r) => sum + r.points, 0)
    const roundsPlayed = playerResults.length
    const netScores = playerResults.map(r => r.netScore)
    const avgScore = roundsPlayed > 0
      ? (netScores.reduce((sum, s) => sum + s, 0) / roundsPlayed).toFixed(1)
      : '-'
    const bestNetScore = roundsPlayed > 0 ? Math.min(...netScores) : '-'

    // Calculate best 4 tournaments points
    const sortedPoints = playerResults.map(r => r.points).sort((a, b) => b - a)
    const bestFourPoints = sortedPoints.slice(0, 4).reduce((sum, p) => sum + p, 0)

    return {
      ...player,
      totalPoints,
      bestFourPoints,
      roundsPlayed,
      avgScore,
      bestNetScore,
    }
  })

  // Sort by best four points descending (then by total points as tiebreaker)
  return playerStats.sort((a, b) => {
    if (b.bestFourPoints !== a.bestFourPoints) {
      return b.bestFourPoints - a.bestFourPoints
    }
    return b.totalPoints - a.totalPoints
  })
}

// Calculate punishment totals per player
export function calculatePunishmentBoard(players, punishments, tournaments = []) {
  const playerPunishments = players.map(player => {
    const playerPuns = punishments.filter(p => p.playerId === player.id)
    const totalFees = playerPuns.reduce((sum, p) => sum + p.amount, 0)
    const count = playerPuns.length

    // Get latest offense with tournament info
    let latestOffense = '-'
    if (playerPuns.length > 0) {
      // Sort by tournament order/date to find most recent
      const sortedPuns = playerPuns.map(p => {
        const tournament = tournaments.find(t => t.id === p.tournamentId)
        return { ...p, tournamentOrder: tournament?.order || 0 }
      }).sort((a, b) => b.tournamentOrder - a.tournamentOrder)
      latestOffense = sortedPuns[0].reason
    }

    return {
      ...player,
      totalFees,
      count,
      latestOffense,
    }
  })

  // Sort by total fees descending
  return playerPunishments.sort((a, b) => b.totalFees - a.totalFees)
}

// Get individual player stats
export function getPlayerStats(playerId, players, results, punishments, tournaments) {
  const player = players.find(p => p.id === playerId)
  if (!player) return null

  const playerResults = results
    .filter(r => r.playerId === playerId)
    .map(r => {
      const tournament = tournaments.find(t => t.id === r.tournamentId)
      return {
        ...r,
        tournamentName: tournament?.name || 'Unknown',
        tournamentDate: tournament?.date || '',
        course: tournament?.course || '',
      }
    })
    .sort((a, b) => new Date(a.tournamentDate) - new Date(b.tournamentDate))

  const playerPunishments = punishments
    .filter(p => p.playerId === playerId)
    .map(p => {
      const tournament = tournaments.find(t => t.id === p.tournamentId)
      return {
        ...p,
        tournamentName: tournament?.name || 'Okänd',
        tournamentDate: tournament?.date || '',
        tournamentOrder: tournament?.order || 0,
      }
    })
    .sort((a, b) => b.tournamentOrder - a.tournamentOrder)

  const totalPoints = playerResults.reduce((sum, r) => sum + r.points, 0)
  const roundsPlayed = playerResults.length
  const netScores = playerResults.map(r => r.netScore)
  const avgScore = roundsPlayed > 0
    ? (netScores.reduce((sum, s) => sum + s, 0) / roundsPlayed).toFixed(1)
    : '-'
  const bestNetScore = roundsPlayed > 0 ? Math.min(...netScores) : '-'
  const bestPoints = roundsPlayed > 0 ? Math.max(...playerResults.map(r => r.points)) : '-'
  const totalPunishmentFees = playerPunishments.reduce((sum, p) => sum + p.amount, 0)

  return {
    ...player,
    totalPoints,
    roundsPlayed,
    avgScore,
    bestNetScore,
    bestPoints,
    totalPunishmentFees,
    results: playerResults,
    punishments: playerPunishments,
  }
}

// Get next upcoming tournament
export function getNextTournament(tournaments) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = tournaments
    .filter(t => new Date(t.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return upcoming[0] || null
}

// Get current leader
export function getCurrentLeader(players, results) {
  const leaderboard = calculateLeaderboard(players, results)
  return leaderboard[0] || null
}

// Generate unique ID
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Calculate accumulated points per player over tournaments
export function calculateAccumulatedPoints(players, results, tournaments) {
  // Filter to only completed tournaments (those with results) and sort by order
  const completedTournamentIds = [...new Set(results.map(r => r.tournamentId))]
  const completedTournaments = tournaments
    .filter(t => completedTournamentIds.includes(t.id))
    .sort((a, b) => a.order - b.order)

  // Build data for each completed tournament
  const chartData = completedTournaments.map(tournament => {
    const dataPoint = {
      tournament: tournament.name,
      tournamentId: tournament.id,
      order: tournament.order,
    }

    // Calculate accumulated points for each player up to this tournament
    players.forEach(player => {
      const tournamentsUpToNow = completedTournaments.filter(t => t.order <= tournament.order)
      const tournamentIds = tournamentsUpToNow.map(t => t.id)
      const playerResults = results.filter(
        r => r.playerId === player.id && tournamentIds.includes(r.tournamentId)
      )
      const accumulatedPoints = playerResults.reduce((sum, r) => sum + r.points, 0)
      dataPoint[player.name] = accumulatedPoints
    })

    return dataPoint
  })

  return chartData
}

// Calculate accumulated punishment fees per player over tournaments
export function calculateAccumulatedPunishments(players, punishments, tournaments, results) {
  // Filter to only completed tournaments (those with results) and sort by order
  const completedTournamentIds = [...new Set(results.map(r => r.tournamentId))]
  const completedTournaments = tournaments
    .filter(t => completedTournamentIds.includes(t.id))
    .sort((a, b) => a.order - b.order)

  // Build data for each completed tournament
  const chartData = completedTournaments.map(tournament => {
    const dataPoint = {
      tournament: tournament.name,
      tournamentId: tournament.id,
      order: tournament.order,
    }

    // Calculate accumulated punishments for each player up to this tournament
    players.forEach(player => {
      const tournamentsUpToNow = completedTournaments.filter(t => t.order <= tournament.order)
      const tournamentIds = tournamentsUpToNow.map(t => t.id)
      const playerPunishments = punishments.filter(
        p => p.playerId === player.id && tournamentIds.includes(p.tournamentId)
      )
      const accumulatedFees = playerPunishments.reduce((sum, p) => sum + p.amount, 0)
      dataPoint[player.name] = accumulatedFees
    })

    return dataPoint
  })

  return chartData
}
