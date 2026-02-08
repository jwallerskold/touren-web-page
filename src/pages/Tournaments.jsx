import { useData } from '../context/DataContext'
import TournamentCard from '../components/TournamentCard'

export default function Tournaments() {
  const { filteredTournaments: tournaments, isLoading, selectedYear } = useData()

  if (isLoading) {
    return <div className="text-center py-12">Laddar...</div>
  }

  // Sort by order/date
  const sortedTournaments = [...tournaments].sort((a, b) => a.order - b.order)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Tävlingar {selectedYear}</h1>
      <p className="text-gray-600 mb-8">
        {tournaments.length} rundor under säsongen, som kulminerar i Grand Finale!
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTournaments.map(tournament => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  )
}
