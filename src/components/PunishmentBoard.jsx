import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { calculatePunishmentBoard } from '../utils/calculations'

export default function PunishmentBoard({ limit = null }) {
  const { players, filteredPunishments: punishments, filteredTournaments: tournaments } = useData()
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

  // Calculate totals
  const totalFees = board.reduce((sum, p) => sum + p.totalFees, 0)
  const totalCount = board.reduce((sum, p) => sum + p.count, 0)

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="sm:hidden space-y-3">
        {/* Total Summary Card */}
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-red-600 font-medium">Total insamlat</p>
              <p className="text-2xl font-bold text-red-700">{totalFees} kr</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-red-600 font-medium">Antal straff</p>
              <p className="text-2xl font-bold text-red-700">{totalCount}</p>
            </div>
          </div>
        </div>

        {/* Player Cards */}
        {board.map((player, index) => (
          <Link
            key={player.id}
            to={`/stats/${player.id}`}
            className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{player.name}</p>
                <p className="text-sm text-gray-500">{player.count} straff</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-700">{player.totalFees} kr</p>
              </div>
            </div>
            {player.latestOffense !== '-' && (
              <p className="text-sm text-gray-500 mt-2 italic">
                Senast: {player.latestOffense}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Spelare</th>
              <th className="px-4 py-3 text-center">Totala avgifter</th>
              <th className="px-4 py-3 text-center">Antal</th>
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
                <td className="px-4 py-3 text-center text-gray-600">
                  {player.count}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-600 text-sm">
                  {player.latestOffense}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-red-50 border-t-2 border-red-200">
            <tr>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3 font-bold text-gray-800">Summa</td>
              <td className="px-4 py-3 text-center font-bold text-red-800 text-lg">
                {totalFees} kr
              </td>
              <td className="px-4 py-3 text-center font-medium text-gray-700">
                {totalCount}
              </td>
              <td className="px-4 py-3 hidden md:table-cell"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}
