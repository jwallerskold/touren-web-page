import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useData } from '../context/DataContext'
import { calculateLeaderboard } from '../utils/calculations'

export default function Leaderboard({ limit = null }) {
  const { players, filteredResults: results, tournaments } = useData()

  // Desktop sorting state
  const [sortBy, setSortBy] = useState('bestFourTourPoints')
  const [sortOrder, setSortOrder] = useState('desc')

  const defaultOrder = {
    avgPutts: 'asc',
    avgBrutto: 'asc',
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder(defaultOrder[field] || 'desc')
    }
  }

  const renderArrow = (field) => {
    if (sortBy !== field) return ''
    return sortOrder === 'desc' ? ' ↓' : ' ↑'
  }

  // ✅ Desktop leaderboard (sorted)
  let leaderboard = calculateLeaderboard(
    players,
    results,
    tournaments,
    sortBy,
    sortOrder
  )

  // ✅ Mobile leaderboard (default sort only)
  const mobileLeaderboard = calculateLeaderboard(
    players,
    results,
    tournaments
  )

  if (limit) {
    leaderboard = leaderboard.slice(0, limit)
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Inga resultat ännu
      </div>
    )
  }

  const format = (value, suffix = '') =>
    value != null
      ? `${value.toFixed ? value.toFixed(1) : value}${suffix}`
      : '-'

  const getRankStyle = (index) => {
    if (index === 0) return 'bg-yellow-400 text-yellow-900'
    if (index === 1) return 'bg-gray-300 text-gray-700'
    if (index === 2) return 'bg-amber-600 text-white'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <>
      {/* ✅ MOBILE CARD LAYOUT (no sorting) */}
      <div className="md:hidden space-y-3">
        {mobileLeaderboard.map((player, index) => (
          <Link
            key={player.id}
            to={`/stats/${player.id}`}
            className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                {player.photoUrl ? (
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg">
                    {player.name.charAt(0)}
                  </div>
                )}
                <span className={`absolute -bottom-1 -right-1 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${getRankStyle(index)}`}>
                  {index + 1}
                </span>
              </div>

              <div className="flex-1">
                <p className="font-bold text-gray-800">{player.name}</p>
                <p className="text-sm text-gray-500">
                  {player.roundsPlayed} rundor
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-green-700">
                  {player.bestFourTourPoints}
                </p>
                <p className="text-xs text-gray-500">Tourpoäng</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500 text-xs">FIR/r</p>
                <p className="font-semibold">
                  {format(player.fairwaysPct, '%')}
                </p>
              </div>

              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500 text-xs">GIR/r</p>
                <p className="font-semibold">
                  {format(player.girPct, '%')}
                </p>
              </div>

              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500 text-xs">Putts/r</p>
                <p className="font-semibold">
                  {format(player.avgPutts)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ✅ DESKTOP TABLE (sortable) */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="px-3 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Spelare</th>

                <th onClick={() => handleSort('bestFourTourPoints')} className="px-3 py-3 text-center cursor-pointer hover:bg-green-700">
                  Tourpoäng{renderArrow('bestFourTourPoints')}
                </th>

                <th onClick={() => handleSort('roundsPlayed')} className="px-3 py-3 text-center cursor-pointer hover:bg-green-700">
                  Rundor{renderArrow('roundsPlayed')}
                </th>

                <th onClick={() => handleSort('avgRoundPoints')} className="px-3 py-3 text-center cursor-pointer hover:bg-green-700">
                  Poäng/r{renderArrow('avgRoundPoints')}
                </th>

                <th onClick={() => handleSort('avgBrutto')} className="px-3 py-3 text-center cursor-pointer hover:bg-green-700">
                  Brutto/r{renderArrow('avgBrutto')}
                </th>

                <th onClick={() => handleSort('fairwaysPct')} className="px-3 py-3 text-center cursor-pointer hover:bg-green-700">
                  FIR/r{renderArrow('fairwaysPct')}
                </th>

                <th onClick={() => handleSort('girPct')} className="px-3 py-3 text-center cursor-pointer hover:bg-green-700">
                  GIR/r{renderArrow('girPct')}
                </th>

                <th onClick={() => handleSort('avgPutts')} className="px-3 py-3 text-center cursor-pointer hover:bg-green-700">
                  Putts/r{renderArrow('avgPutts')}
                </th>

                <th onClick={() => handleSort('bestRoundPoints')} className="px-3 py-3 text-center cursor-pointer hover:bg-green-700">
                  Bästa Rond{renderArrow('bestRoundPoints')}
                </th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((player, index) => (
                <tr
                  key={player.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index < 3 ? 'font-medium' : ''
                  }`}
                >
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankStyle(index)}`}>
                      {index + 1}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <Link to={`/stats/${player.id}`} className="hover:text-green-700">
                      {player.name}
                    </Link>
                  </td>

                  <td className="px-3 py-3 text-center font-bold text-green-700">
                    {player.bestFourTourPoints}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {player.roundsPlayed}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {format(player.avgRoundPoints)}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {format(player.avgBrutto)}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {format(player.fairwaysPct, '%')}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {format(player.girPct, '%')}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {format(player.avgPutts)}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {format(player.bestRoundPoints)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}