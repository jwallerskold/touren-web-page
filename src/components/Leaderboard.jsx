import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { calculateLeaderboard } from '../utils/calculations'

export default function Leaderboard({ limit = null }) {
  const { players, results } = useData()
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
            <th className="px-4 py-3 text-center">Poäng</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell">Rundor</th>
            <th className="px-4 py-3 text-center hidden md:table-cell">Snittslag</th>
            <th className="px-4 py-3 text-center hidden md:table-cell">Bästa netto</th>
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
                {player.totalPoints}
              </td>
              <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-600">
                {player.roundsPlayed}
              </td>
              <td className="px-4 py-3 text-center hidden md:table-cell text-gray-600">
                {player.avgScore}
              </td>
              <td className="px-4 py-3 text-center hidden md:table-cell text-gray-600">
                {player.bestNetScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
