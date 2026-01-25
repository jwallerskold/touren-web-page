import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import Leaderboard from '../components/Leaderboard'
import PunishmentBoard from '../components/PunishmentBoard'

export default function Stats() {
  const [activeTab, setActiveTab] = useState('leaderboard')
  const { players, isLoading } = useData()

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'punishments', label: 'Punishment Board' },
    { id: 'players', label: 'All Players' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Statistics</h1>

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
            Overall standings based on points accumulated throughout the season.
          </p>
          <Leaderboard />
        </div>
      )}

      {activeTab === 'punishments' && (
        <div>
          <p className="text-gray-600 mb-4">
            Punishment fees collected throughout the season. All fees go to the finale celebration fund!
          </p>
          <PunishmentBoard />
        </div>
      )}

      {activeTab === 'players' && (
        <div>
          <p className="text-gray-600 mb-4">
            All registered players. Click on a player to see their individual stats.
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
