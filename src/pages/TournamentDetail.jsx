import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { formatDate } from '../utils/calculations'

export default function TournamentDetail() {
  const { id } = useParams()
  const { tournaments, results, players, isLoading } = useData()

  if (isLoading) {
    return <div className="text-center py-12">Laddar...</div>
  }

  const tournament = tournaments.find(t => t.id === id)

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tävlingen hittades inte</h1>
        <Link to="/tournaments" className="text-green-700 hover:text-green-800">
          ← Tillbaka till tävlingar
        </Link>
      </div>
    )
  }

  const tournamentResults = results
    .filter(r => r.tournamentId === id)
    .sort((a, b) => a.position - b.position)
    .map(r => ({
      ...r,
      player: players.find(p => p.id === r.playerId),
    }))

  const isPast = new Date(tournament.date) < new Date()

  return (
    <div>
      <Link to="/tournaments" className="text-green-700 hover:text-green-800 mb-4 inline-block">
        ← Tillbaka till tävlingar
      </Link>

      {/* Tournament Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="relative h-64 bg-green-200">
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
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
          )}
          {tournament.isFinale && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold">
              TOURFINALEN
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{tournament.name}</h1>
              <p className="text-xl text-green-700 font-medium">{tournament.course}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-800">{formatDate(tournament.date)}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                isPast
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-green-100 text-green-700'
              }`}>
                {isPast ? 'Avslutad' : 'Kommande'}
              </span>
            </div>
          </div>
          <p className="text-gray-600">{tournament.description}</p>
        </div>
      </div>

      {/* Results */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultat</h2>

        {tournamentResults.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Pos</th>
                  <th className="px-4 py-3 text-left">Spelare</th>
                  <th className="px-4 py-3 text-center">Brutto</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">Putts</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">FIR</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">GIR</th>
                  <th className="px-4 py-3 text-center">Poäng runda</th>
                  <th className="px-4 py-3 text-center">Tour-poäng</th>
                  <th className="px-4 py-3 text-center">Deltagar-poäng</th>
                </tr>
              </thead>
              <tbody>
                {tournamentResults.map((result, index) => (
                  <tr
                    key={result.id}
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
                        {result.position}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/stats/${result.playerId}`}
                        className="hover:text-green-700"
                      >
                        {result.player?.name || 'Okänd'}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {result.grossScore}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-600">
                      {result.putts || '-'}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-600">
                      {result.fairwaysHit != null ? `${(100*(result.fairwaysHit / tournament.availableFairways)).toFixed(0)}%` : '-'}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-600">
                      {result.greensInRegulation != null ? `${(100*(result.greensInRegulation / 18)).toFixed(0)}%` : '-'}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {result.roundPoints || '-'}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-green-700">
                      {result.points}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-green-700">
                      {2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            {isPast
              ? 'Inga resultat registrerade för denna tävling ännu'
              : 'Resultat kommer att finnas tillgängliga efter tävlingen'
            }
          </div>
        )}
      </section>
    </div>
  )
}
