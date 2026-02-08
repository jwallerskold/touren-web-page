import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { calculateLeaderboard } from '../utils/calculations'

export default function Leaderboard({ limit = null }) {
  const { players, filteredResults: results } = useData()
  let leaderboard = calculateLeaderboard(players, results)

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-green-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Spelare</th>
            <th className="px-4 py-3 text-center">Bästa 4 Tour-poäng</th>
            <th className="px-4 py-3 text-center">Total Tour-poäng</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell">Rundor</th>
            <th className="px-4 py-3 text-center hidden md:table-cell">Snitt Brutto</th>
            <th className="px-4 py-3 text-center hidden lg:table-cell">Snitt Putts</th>
            <th className="px-4 py-3 text-center hidden lg:table-cell">Fairways %</th>
            <th className="px-4 py-3 text-center hidden lg:table-cell">GIR %</th>
            <th className="px-4 py-3 text-center hidden md:table-cell">Snitt Poäng runda</th>
            <th className="px-4 py-3 text-center hidden md:table-cell">Bästa Poäng runda</th>
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
              <td className="px-4 py-3">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                  index === 0 ? 'bg-yellow-400 text-yellow-900' :
                  index === 1 ? 'bg-gray-300 text-gray-700' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link to={`/stats/${player.id}`} className="hover:text-green-700">
                  {player.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-center font-bold text-green-700">
                {player.bestFourTourPoints}
              </td>
              <td className="px-4 py-3 text-center text-gray-600">
                {player.totalTourPoints}
              </td>
              <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-600">
                {player.roundsPlayed}
              </td>
              <td className="px-4 py-3 text-center hidden md:table-cell text-gray-600">
                {player.avgBrutto}
              </td>
              <td className="px-4 py-3 text-center hidden lg:table-cell text-gray-600">
                {player.avgPutts}
              </td>
              <td className="px-4 py-3 text-center hidden lg:table-cell text-gray-600">
                {player.fairwaysPct !== '-' ? `${player.fairwaysPct}%` : '-'}
              </td>
              <td className="px-4 py-3 text-center hidden lg:table-cell text-gray-600">
                {player.girPct !== '-' ? `${player.girPct}%` : '-'}
              </td>
              <td className="px-4 py-3 text-center hidden md:table-cell text-gray-600">
                {player.avgRoundPoints}
              </td>
              <td className="px-4 py-3 text-center hidden md:table-cell text-gray-600">
                {player.bestRoundPoints}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
