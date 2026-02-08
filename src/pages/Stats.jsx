import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import Leaderboard from '../components/Leaderboard'
import PunishmentBoard from '../components/PunishmentBoard'
import AccumulatedPointsChart from '../components/AccumulatedPointsChart'
import AccumulatedPunishmentsChart from '../components/AccumulatedPunishmentsChart'

export default function Stats() {
  const [activeTab, setActiveTab] = useState('leaderboard')
  const { players, isLoading, selectedYear } = useData()

  if (isLoading) {
    return <div className="text-center py-12">Laddar...</div>
  }

  const tabs = [
    { id: 'leaderboard', label: 'Ställning' },
    { id: 'punishments', label: 'Straffavgifter' },
    { id: 'points-chart', label: 'Poänggraf' },
    { id: 'punishments-chart', label: 'Straffgraf' },
    { id: 'players', label: 'Alla spelare' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Statistik {selectedYear}</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-green-700 border-b-2 border-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'leaderboard' && (
        <div>
          <p className="text-gray-600 mb-4">
            Total ställning baserad på poäng under säsongen.
          </p>
          <Leaderboard />
        </div>
      )}

      {activeTab === 'punishments' && (
        <div>
          <p className="text-gray-600 mb-4">
            Straffavgifter samlade under säsongen. Alla avgifter går till finalfesten!
          </p>
          <PunishmentBoard />
        </div>
      )}

      {activeTab === 'points-chart' && (
        <div>
          <p className="text-gray-600 mb-4">
            Ackumulerade Tour-poäng per spelare över säsongens tävlingar.
          </p>
          <AccumulatedPointsChart />
        </div>
      )}

      {activeTab === 'punishments-chart' && (
        <div>
          <p className="text-gray-600 mb-4">
            Ackumulerade straffavgifter per spelare över säsongens tävlingar.
          </p>
          <AccumulatedPunishmentsChart />
        </div>
      )}

      {activeTab === 'players' && (
        <div>
          <p className="text-gray-600 mb-4">
            Alla registrerade spelare. Klicka på en spelare för att se individuell statistik.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map(player => (
              <Link
                key={player.id}
                to={`/stats/${player.id}`}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-gray-800">{player.name}</h3>
                <p className="text-sm text-gray-500">Handicap: {player.handicap}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
