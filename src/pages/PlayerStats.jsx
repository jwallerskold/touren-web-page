import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { getPlayerStats, calculateLeaderboard, formatDate } from '../utils/calculations'

export default function PlayerStats() {
  const { playerId } = useParams()
  const { players, results, punishments, tournaments, isLoading } = useData()

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const playerStats = getPlayerStats(playerId, players, results, punishments, tournaments)
  const leaderboard = calculateLeaderboard(players, results)
  const rank = leaderboard.findIndex(p => p.id === playerId) + 1

  if (!playerStats) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Player not found</h1>
        <Link to="/stats" className="text-green-700 hover:text-green-800">
          ← Back to stats
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/stats" className="text-green-700 hover:text-green-800 mb-4 inline-block">
        ← Back to stats
      </Link>

      {/* Player Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{playerStats.name}</h1>
            <p className="text-gray-600">Handicap: {playerStats.handicap}</p>
          </div>
          {rank > 0 && (
            <div className={`px-6 py-3 rounded-xl text-center ${
              rank === 1 ? 'bg-yellow-100 text-yellow-800' :
              rank === 2 ? 'bg-gray-100 text-gray-700' :
              rank === 3 ? 'bg-amber-100 text-amber-800' :
              'bg-green-50 text-green-800'
            }`}>
              <p className="text-sm font-medium">Current Rank</p>
              <p className="text-3xl font-bold">#{rank}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total Points</p>
          <p className="text-3xl font-bold text-green-700">{playerStats.totalPoints}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Rounds Played</p>
          <p className="text-3xl font-bold text-gray-800">{playerStats.roundsPlayed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Avg Net Score</p>
          <p className="text-3xl font-bold text-gray-800">{playerStats.avgScore}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Best Net Score</p>
          <p className="text-3xl font-bold text-gray-800">{playerStats.bestNetScore}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Results History */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Round History</h2>
          {playerStats.results.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Tournament</th>
                    <th className="px-4 py-3 text-center">Pos</th>
                    <th className="px-4 py-3 text-center">Net</th>
                    <th className="px-4 py-3 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.results.map(result => (
                    <tr key={result.id} className="border-b border-gray-100">
                      <td className="px-4 py-3">
                        <Link
                          to={`/tournaments/${result.tournamentId}`}
                          className="hover:text-green-700"
                        >
                          <p className="font-medium">{result.tournamentName}</p>
                          <p className="text-sm text-gray-500">{formatDate(result.tournamentDate)}</p>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          result.position === 1 ? 'bg-yellow-400 text-yellow-900' :
                          result.position === 2 ? 'bg-gray-300 text-gray-700' :
                          result.position === 3 ? 'bg-amber-600 text-white' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {result.position}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {result.netScore}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-green-700">
                        {result.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
              No rounds played yet
            </div>
          )}
        </section>

        {/* Punishments */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Punishment History</h2>
          <div className="bg-red-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-600">Total Punishment Fees</p>
            <p className="text-3xl font-bold text-red-700">{playerStats.totalPunishmentFees} kr</p>
          </div>
          {playerStats.punishments.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-red-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Reason</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.punishments.map(punishment => (
                    <tr key={punishment.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(punishment.date)}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {punishment.reason}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-700">
                        {punishment.amount} kr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
              No punishments recorded - keep it up!
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
