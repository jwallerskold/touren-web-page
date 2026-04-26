// Participation points per tournament
const PARTICIPATION_POINTS = 2

// Calculate leaderboard from results
export function calculateLeaderboard(players, results, tournaments) {
  const playerStats = players.map(player => {
    const playerResults = results.filter(r => r.playerId === player.id)

    // Tour points (for standings)
    const totalTourPoints = playerResults.reduce((sum, r) => sum + r.points, 0)
    const sortedTourPoints = playerResults.map(r => r.points).sort((a, b) => b - a)
    const bestFourBasePoints = sortedTourPoints.slice(0, 4).reduce((sum, p) => sum + p, 0)

    // Participation points (for all tournaments participated)
    const tournamentsPlayed = playerResults.length
    const participationPoints = tournamentsPlayed * PARTICIPATION_POINTS

    // Best 4 tour points = best 4 tournament points + all participation points
    const bestFourTourPoints = bestFourBasePoints + participationPoints

    // Round points (golf points per round)
    const roundsPlayed = playerResults.length
    const roundPointsArray = playerResults.map(r => r.roundPoints || 0)
    const avgRoundPoints = roundsPlayed > 0
      ? (roundPointsArray.reduce((sum, p) => sum + p, 0) / roundsPlayed).toFixed(1)
      : '-'
    const bestRoundPoints = roundsPlayed > 0 && roundPointsArray.some(p => p > 0)
      ? Math.max(...roundPointsArray)
      : '-'

    // Brutto (gross score)
    const grossScores = playerResults.map(r => r.grossScore).filter(s => s != null)
    const avgBrutto = grossScores.length > 0
      ? (grossScores.reduce((sum, s) => sum + s, 0) / grossScores.length).toFixed(1)
      : '-'

    // Putts per round (average)
    const puttsArray = playerResults.map(r => r.putts).filter(p => p != null)
    const avgPutts = puttsArray.length > 0
      ? (puttsArray.reduce((sum, p) => sum + p, 0) / puttsArray.length).toFixed(1)
      : '-'

    // Fairways hit (percentage) - assuming 14 fairways per round
    const availableFairways = results.filter(r => r.playerId === player.id)
    .map(r => {
      const tournament = tournaments.find(t => t.id === r.tournamentId)
      return {
        availableTournamentFairways: tournament?.availableFairways || 0,
      }
    }).reduce((sum, r) => sum + (r.availableTournamentFairways || 0), 0)

    const fairwaysArray = playerResults.map(r => r.fairwaysHit).filter(f => f != null)    
    const fairwaysPct = fairwaysArray.length > 0
    ? Math.round((fairwaysArray.reduce((sum, f) => sum + f, 0) / (availableFairways)) * 100)
    : '-'

    // Greens in regulation (percentage) - assuming 18 greens per round
    const girArray = playerResults.map(r => r.greensInRegulation).filter(g => g != null)
    const girPct = girArray.length > 0
      ? Math.round((girArray.reduce((sum, g) => sum + g, 0) / (girArray.length * 18)) * 100)
      : '-'

    // Balls in water total (for fun)
    const ballsInWaterArray = playerResults.map(r => r.ballsInWater).filter(b => b != null)
    const totalBallsInWater = ballsInWaterArray.length > 0
      ? ballsInWaterArray.reduce((sum, b) => sum + b, 0)
      : '-'

    return {
      ...player,
      totalTourPoints,
      bestFourTourPoints,
      bestFourBasePoints,
      participationPoints,
      roundsPlayed,
      avgRoundPoints,
      bestRoundPoints,
      avgBrutto,
      avgPutts,
      fairwaysPct,
      girPct,
    }
  })

  // Sort by best four tour points descending (then by total tour points as tiebreaker)
  return playerStats.sort((a, b) => {
    if (b.bestFourTourPoints !== a.bestFourTourPoints) {
      return b.bestFourTourPoints - a.bestFourTourPoints
    }
    return b.totalTourPoints - a.totalTourPoints
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
        availableTournamentFairways: tournament?.availableFairways || 0,
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

  // Tour points
  const totalTourPoints = playerResults.reduce((sum, r) => sum + r.points, 0)

  // Participation points
  const roundsPlayed = playerResults.length
  const participationPoints = roundsPlayed * PARTICIPATION_POINTS

  // Best 4 calculation
  const sortedTourPoints = playerResults.map(r => r.points).sort((a, b) => b - a)
  const bestFourBasePoints = sortedTourPoints.slice(0, 4).reduce((sum, p) => sum + p, 0)
  const bestFourTourPoints = bestFourBasePoints + participationPoints

  // Round points (golf points)
  const roundPointsArray = playerResults.map(r => r.roundPoints || 0)
  const avgRoundPoints = roundsPlayed > 0
    ? (roundPointsArray.reduce((sum, p) => sum + p, 0) / roundsPlayed).toFixed(1)
    : '-'
  const bestRoundPoints = roundsPlayed > 0 && roundPointsArray.some(p => p > 0)
    ? Math.max(...roundPointsArray)
    : '-'

  // Brutto (gross score)
  const grossScores = playerResults.map(r => r.grossScore).filter(s => s != null)
  const avgBrutto = grossScores.length > 0
    ? (grossScores.reduce((sum, s) => sum + s, 0) / grossScores.length).toFixed(1)
    : '-'

  // Putts per round (average)
  const puttsArray = playerResults.map(r => r.putts).filter(p => p != null)
  const avgPutts = puttsArray.length > 0
    ? (puttsArray.reduce((sum, p) => sum + p, 0) / puttsArray.length).toFixed(1)
    : '-'

  // Fairways hit (percentage)
  const fairwaysArray = playerResults.map(r => r.fairwaysHit).filter(f => f != null)
  const availableFairways = playerResults.reduce((sum, r) => sum + (r.availableTournamentFairways || 0), 0)
  const fairwaysPct = fairwaysArray.length > 0
    ? Math.round((fairwaysArray.reduce((sum, f) => sum + f, 0) / availableFairways) * 100)
    : '-'

  // Greens in regulation (percentage)
  const girArray = playerResults.map(r => r.greensInRegulation).filter(g => g != null)
  const girPct = girArray.length > 0
    ? Math.round((girArray.reduce((sum, g) => sum + g, 0) / (girArray.length * 18)) * 100)
    : '-'

  const totalPunishmentFees = playerPunishments.reduce((sum, p) => sum + p.amount, 0)

  return {
    ...player,
    totalTourPoints,
    bestFourTourPoints,
    bestFourBasePoints,
    participationPoints,
    roundsPlayed,
    avgRoundPoints,
    bestRoundPoints,
    avgBrutto,
    avgPutts,
    fairwaysPct,
    girPct,
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
export function getCurrentLeader(players, results, tournaments) {
  const leaderboard = calculateLeaderboard(players, results, tournaments)
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
      const accumulatedPoints = playerResults.reduce((sum, r) => sum + (r.points + PARTICIPATION_POINTS), 0)
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
