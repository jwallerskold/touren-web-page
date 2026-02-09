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

  const getRankStyle = (index) => {
    if (index === 0) return 'bg-yellow-400 text-yellow-900'
    if (index === 1) return 'bg-gray-300 text-gray-700'
    if (index === 2) return 'bg-amber-600 text-white'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {leaderboard.map((player, index) => (
          <Link
            key={player.id}
            to={`/stats/${player.id}`}
            className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                {player.photoUrl ? (
                  <img src={player.photoUrl} alt={player.name} className="w-14 h-14 rounded-full object-cover" />
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
                <p className="text-sm text-gray-500">{player.roundsPlayed} rundor</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-700">{player.bestFourTourPoints}</p>
                <p className="text-xs text-gray-500">Tourpoäng</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500 text-xs">Brutto</p>
                <p className="font-semibold">{player.avgBrutto}</p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500 text-xs">Putts</p>
                <p className="font-semibold">{player.avgPutts}</p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500 text-xs">GIR</p>
                <p className="font-semibold">{player.girPct !== '-' ? `${player.girPct}%` : '-'}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="px-3 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Spelare</th>
                <th className="px-3 py-3 text-center" title="Bästa 4 tävlingspoäng + deltagandebonus">Tourpoäng</th>
                <th className="px-3 py-3 text-center">Rundor</th>
                <th className="px-3 py-3 text-center">Brutto</th>
                <th className="px-3 py-3 text-center hidden lg:table-cell">Putts</th>
                <th className="px-3 py-3 text-center hidden lg:table-cell">FW %</th>
                <th className="px-3 py-3 text-center hidden lg:table-cell">GIR %</th>
                <th className="px-3 py-3 text-center hidden xl:table-cell">Snitt Poäng</th>
                <th className="px-3 py-3 text-center hidden xl:table-cell">Bästa Poäng</th>
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
                  <td className="px-3 py-3 text-center font-bold text-green-700" title={`${player.bestFourBasePoints} poäng + ${player.participationPoints} deltagande`}>
                    {player.bestFourTourPoints}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-600">
                    {player.roundsPlayed}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-600">
                    {player.avgBrutto}
                  </td>
                  <td className="px-3 py-3 text-center hidden lg:table-cell text-gray-600">
                    {player.avgPutts}
                  </td>
                  <td className="px-3 py-3 text-center hidden lg:table-cell text-gray-600">
                    {player.fairwaysPct !== '-' ? `${player.fairwaysPct}%` : '-'}
                  </td>
                  <td className="px-3 py-3 text-center hidden lg:table-cell text-gray-600">
                    {player.girPct !== '-' ? `${player.girPct}%` : '-'}
                  </td>
                  <td className="px-3 py-3 text-center hidden xl:table-cell text-gray-600">
                    {player.avgRoundPoints}
                  </td>
                  <td className="px-3 py-3 text-center hidden xl:table-cell text-gray-600">
                    {player.bestRoundPoints}
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
