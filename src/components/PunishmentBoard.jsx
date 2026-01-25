import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { calculatePunishmentBoard } from '../utils/calculations'

export default function PunishmentBoard({ limit = null }) {
  const { players, punishments, tournaments } = useData()
  let board = calculatePunishmentBoard(players, punishments, tournaments)

  // Filter out players with no punishments
  board = board.filter(p => p.totalFees > 0)

  if (limit) {
    board = board.slice(0, limit)
  }

  if (board.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Inga straffavgifter registrerade ännu
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-red-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Spelare</th>
            <th className="px-4 py-3 text-center">Totala avgifter</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell">Antal</th>
            <th className="px-4 py-3 text-left hidden md:table-cell">Senaste förseelse</th>
          </tr>
        </thead>
        <tbody>
          {board.map((player, index) => (
            <tr
              key={player.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700">
                  {index + 1}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link to={`/stats/${player.id}`} className="hover:text-red-700">
                  {player.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-center font-bold text-red-700">
                {player.totalFees} kr
              </td>
              <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-600">
                {player.count}
              </td>
              <td className="px-4 py-3 hidden md:table-cell text-gray-600 text-sm">
                {player.latestOffense}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
