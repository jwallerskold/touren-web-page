import { Link } from 'react-router-dom'
import { formatDate } from '../utils/calculations'

export default function TournamentCard({ tournament }) {
  const isPast = new Date(tournament.date) < new Date()

  return (
    <Link
      to={`/tournaments/${tournament.id}`}
      className={`block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        tournament.isFinale ? 'ring-2 ring-yellow-400' : ''
      }`}
    >
      <div className="relative h-48 bg-green-200">
        {tournament.imageUrl ? (
          <img
            src={tournament.imageUrl}
            alt={tournament.course}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-green-600">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
        )}
        {tournament.isFinale && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
            FINALE
          </div>
        )}
        {isPast && (
          <div className="absolute top-2 left-2 bg-gray-800/70 text-white px-2 py-1 rounded text-xs">
            Avslutad
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{formatDate(tournament.date)}</div>
        <h3 className="font-bold text-lg text-gray-800">{tournament.name}</h3>
        <p className="text-green-700 font-medium">{tournament.course}</p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{tournament.description}</p>
      </div>
    </Link>
  )
}
