import { Link } from 'react-router-dom'

export default function PlayerCard({ player, rank, showPoints = true }) {
  return (
    <Link
      to={`/stats/${player.id}`}
      className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-4">
        {rank && (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            rank === 1 ? 'bg-yellow-400 text-yellow-900' :
            rank === 2 ? 'bg-gray-300 text-gray-700' :
            rank === 3 ? 'bg-amber-600 text-white' :
            'bg-gray-100 text-gray-600'
          }`}>
            {rank}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{player.name}</h3>
          <p className="text-sm text-gray-500">HCP: {player.handicap}</p>
        </div>
        {showPoints && player.totalPoints !== undefined && (
          <div className="text-right">
            <div className="text-2xl font-bold text-green-700">{player.totalPoints}</div>
            <div className="text-xs text-gray-500">points</div>
          </div>
        )}
      </div>
    </Link>
  )
}
