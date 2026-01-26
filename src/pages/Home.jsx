import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { getNextTournament, getCurrentLeader, calculateLeaderboard, formatDate } from '../utils/calculations'
import Leaderboard from '../components/Leaderboard'

export default function Home() {
  const { players, results, tournaments, isLoading } = useData()

  if (isLoading) {
    return <div className="text-center py-12">Laddar...</div>
  }

  const nextTournament = getNextTournament(tournaments)
  const currentLeader = getCurrentLeader(players, results)
  const leaderboard = calculateLeaderboard(players, results)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <img
          src="/images/home-page/team-photo-2025.jpg"
          alt="Touren 2025"
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Touren 2026</h1>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/tournaments"
              className="bg-white text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Visa tävlingar
            </Link>
            <Link
              to="/stats"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors"
            >
              Se ställningen
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Next Tournament */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Nästa tävling
          </h2>
          {nextTournament ? (
            <Link to={`/tournaments/${nextTournament.id}`} className="block group">
              <p className="text-2xl font-bold text-gray-800 group-hover:text-green-700">
                {nextTournament.name}
              </p>
              <p className="text-green-700">{nextTournament.course}</p>
              <p className="text-gray-500">{formatDate(nextTournament.date)}</p>
              {nextTournament.isFinale && (
                <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Grand Finale!
                </span>
              )}
            </Link>
          ) : (
            <p className="text-gray-500">Säsongen avslutad!</p>
          )}
        </div>

        {/* Current Leader */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Nuvarande ledare
          </h2>
          {currentLeader && currentLeader.totalPoints > 0 ? (
            <Link to={`/stats/${currentLeader.id}`} className="block group">
              <p className="text-2xl font-bold text-gray-800 group-hover:text-green-700">
                {currentLeader.name}
              </p>
              <p className="text-4xl font-bold text-green-700">{currentLeader.totalPoints}</p>
              <p className="text-gray-500">poäng</p>
            </Link>
          ) : (
            <p className="text-gray-500">Inga resultat ännu</p>
          )}
        </div>

        {/* Season Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Säsongsstatistik
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Spelare</span>
              <span className="font-bold">{players.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tävlingar</span>
              <span className="font-bold">{tournaments.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avslutade</span>
              <span className="font-bold">
                {tournaments.filter(t => new Date(t.date) < new Date()).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Ställning</h2>
          <Link to="/stats" className="text-green-700 hover:text-green-800 font-medium">
            Visa all statistik →
          </Link>
        </div>
        <Leaderboard limit={5} />
      </section>

      {/* Finale Highlight */}
      {tournaments.find(t => t.isFinale) && (
        <section className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Grand Finale i Spanien!</h2>
              <p className="text-yellow-100 mb-4 md:mb-0">
                {tournaments.find(t => t.isFinale)?.course} - {formatDate(tournaments.find(t => t.isFinale)?.date)}
              </p>
            </div>
            <Link
              to={`/tournaments/${tournaments.find(t => t.isFinale)?.id}`}
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors inline-block"
            >
              Läs mer
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
