import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { formatDate } from '../utils/calculations'

const ADMIN_PASSWORD = 'golftour2025' // Change this to your preferred password

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('players')

  const {
    players, tournaments, results, punishments, rules,
    addPlayer, updatePlayer, deletePlayer,
    addTournament, updateTournament, deleteTournament,
    setTournamentResults,
    addPunishment, deletePunishment,
    saveRules, resetData, isLoading
  } = useData()

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('adminAuth', 'true')
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('adminAuth')
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const tabs = [
    { id: 'players', label: 'Players' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'results', label: 'Results' },
    { id: 'punishments', label: 'Punishments' },
    { id: 'rules', label: 'Rules' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-800"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
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
      {activeTab === 'players' && (
        <PlayersAdmin
          players={players}
          addPlayer={addPlayer}
          updatePlayer={updatePlayer}
          deletePlayer={deletePlayer}
        />
      )}
      {activeTab === 'tournaments' && (
        <TournamentsAdmin
          tournaments={tournaments}
          addTournament={addTournament}
          updateTournament={updateTournament}
          deleteTournament={deleteTournament}
        />
      )}
      {activeTab === 'results' && (
        <ResultsAdmin
          tournaments={tournaments}
          players={players}
          results={results}
          setTournamentResults={setTournamentResults}
        />
      )}
      {activeTab === 'punishments' && (
        <PunishmentsAdmin
          players={players}
          punishments={punishments}
          addPunishment={addPunishment}
          deletePunishment={deletePunishment}
        />
      )}
      {activeTab === 'rules' && (
        <RulesAdmin rules={rules} saveRules={saveRules} />
      )}
      {activeTab === 'settings' && (
        <SettingsAdmin resetData={resetData} />
      )}
    </div>
  )
}

// Players Management
function PlayersAdmin({ players, addPlayer, updatePlayer, deletePlayer }) {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', handicap: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      updatePlayer(editingId, {
        name: formData.name,
        handicap: parseFloat(formData.handicap),
      })
      setEditingId(null)
    } else {
      addPlayer({
        name: formData.name,
        handicap: parseFloat(formData.handicap),
      })
    }
    setFormData({ name: '', handicap: '' })
  }

  const startEdit = (player) => {
    setEditingId(player.id)
    setFormData({ name: player.name, handicap: player.handicap.toString() })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', handicap: '' })
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {editingId ? 'Edit Player' : 'Add New Player'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Handicap</label>
            <input
              type="number"
              step="0.1"
              value={formData.handicap}
              onChange={(e) => setFormData({ ...formData, handicap: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
          >
            {editingId ? 'Update' : 'Add'} Player
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-bold text-gray-800 mb-4">All Players ({players.length})</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-center">Handicap</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{player.name}</td>
                <td className="px-4 py-3 text-center">{player.handicap}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => startEdit(player)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this player and all their data?')) {
                        deletePlayer(player.id)
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Tournaments Management
function TournamentsAdmin({ tournaments, addTournament, updateTournament, deleteTournament }) {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '', course: '', date: '', description: '', imageUrl: '', isFinale: false, order: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      order: parseInt(formData.order) || tournaments.length + 1,
    }
    if (editingId) {
      updateTournament(editingId, data)
      setEditingId(null)
    } else {
      addTournament(data)
    }
    setFormData({ name: '', course: '', date: '', description: '', imageUrl: '', isFinale: false, order: '' })
  }

  const startEdit = (tournament) => {
    setEditingId(tournament.id)
    setFormData({
      name: tournament.name,
      course: tournament.course,
      date: tournament.date,
      description: tournament.description,
      imageUrl: tournament.imageUrl || '',
      isFinale: tournament.isFinale,
      order: tournament.order.toString(),
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', course: '', date: '', description: '', imageUrl: '', isFinale: false, order: '' })
  }

  const sortedTournaments = [...tournaments].sort((a, b) => a.order - b.order)

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {editingId ? 'Edit Tournament' : 'Add New Tournament'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 1, 2, 3..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="/images/courses/my-course.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows="2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFinale}
                onChange={(e) => setFormData({ ...formData, isFinale: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">This is the Grand Finale</span>
            </label>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
            {editingId ? 'Update' : 'Add'} Tournament
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-bold text-gray-800 mb-4">All Tournaments ({tournaments.length})</h2>
      <div className="space-y-2">
        {sortedTournaments.map(tournament => (
          <div key={tournament.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <div>
              <span className="text-gray-400 mr-2">#{tournament.order}</span>
              <span className="font-medium">{tournament.name}</span>
              <span className="text-gray-500 mx-2">-</span>
              <span className="text-gray-600">{tournament.course}</span>
              <span className="text-gray-400 ml-2">({formatDate(tournament.date)})</span>
              {tournament.isFinale && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">FINALE</span>
              )}
            </div>
            <div>
              <button onClick={() => startEdit(tournament)} className="text-blue-600 hover:text-blue-800 mr-3">
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this tournament and its results?')) {
                    deleteTournament(tournament.id)
                  }
                }}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Results Management
function ResultsAdmin({ tournaments, players, results, setTournamentResults }) {
  const [selectedTournament, setSelectedTournament] = useState('')
  const [resultsForm, setResultsForm] = useState([])

  const sortedTournaments = [...tournaments].sort((a, b) => a.order - b.order)

  useEffect(() => {
    if (selectedTournament) {
      const existingResults = results.filter(r => r.tournamentId === selectedTournament)
      const form = players.map(player => {
        const existing = existingResults.find(r => r.playerId === player.id)
        return {
          playerId: player.id,
          playerName: player.name,
          grossScore: existing?.grossScore || '',
          netScore: existing?.netScore || '',
          points: existing?.points || '',
          position: existing?.position || '',
          participated: !!existing,
        }
      })
      setResultsForm(form)
    } else {
      setResultsForm([])
    }
  }, [selectedTournament, players, results])

  const updateFormRow = (index, field, value) => {
    const newForm = [...resultsForm]
    newForm[index] = { ...newForm[index], [field]: value }
    setResultsForm(newForm)
  }

  const handleSave = () => {
    const validResults = resultsForm
      .filter(r => r.participated && r.grossScore && r.netScore && r.points && r.position)
      .map(r => ({
        playerId: r.playerId,
        grossScore: parseInt(r.grossScore),
        netScore: parseInt(r.netScore),
        points: parseInt(r.points),
        position: parseInt(r.position),
      }))

    setTournamentResults(selectedTournament, validResults)
    alert('Results saved!')
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Enter Results</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Tournament</label>
        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">-- Select Tournament --</option>
          {sortedTournaments.map(t => (
            <option key={t.id} value={t.id}>
              {t.name} - {formatDate(t.date)}
            </option>
          ))}
        </select>
      </div>

      {selectedTournament && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Participated</th>
                <th className="px-3 py-2 text-left">Player</th>
                <th className="px-3 py-2 text-center">Pos</th>
                <th className="px-3 py-2 text-center">Gross</th>
                <th className="px-3 py-2 text-center">Net</th>
                <th className="px-3 py-2 text-center">Points</th>
              </tr>
            </thead>
            <tbody>
              {resultsForm.map((row, index) => (
                <tr key={row.playerId} className="border-t border-gray-100">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={row.participated}
                      onChange={(e) => updateFormRow(index, 'participated', e.target.checked)}
                    />
                  </td>
                  <td className="px-3 py-2">{row.playerName}</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.position}
                      onChange={(e) => updateFormRow(index, 'position', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      disabled={!row.participated}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.grossScore}
                      onChange={(e) => updateFormRow(index, 'grossScore', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      disabled={!row.participated}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.netScore}
                      onChange={(e) => updateFormRow(index, 'netScore', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      disabled={!row.participated}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.points}
                      onChange={(e) => updateFormRow(index, 'points', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      disabled={!row.participated}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-gray-50">
            <button
              onClick={handleSave}
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
            >
              Save Results
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Punishments Management
function PunishmentsAdmin({ players, punishments, addPunishment, deletePunishment }) {
  const [formData, setFormData] = useState({ playerId: '', amount: '', reason: '', date: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    addPunishment({
      playerId: formData.playerId,
      amount: parseInt(formData.amount),
      reason: formData.reason,
      date: formData.date,
    })
    setFormData({ playerId: '', amount: '', reason: '', date: '' })
  }

  const sortedPunishments = [...punishments].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add Punishment</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Player</label>
            <select
              value={formData.playerId}
              onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">-- Select Player --</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (kr)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 3-putt on hole 9"
              required
            />
          </div>
        </div>
        <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800">
          Add Punishment
        </button>
      </form>

      <h2 className="text-xl font-bold text-gray-800 mb-4">All Punishments ({punishments.length})</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-red-100">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPunishments.map(punishment => {
              const player = players.find(p => p.id === punishment.playerId)
              return (
                <tr key={punishment.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-600">{formatDate(punishment.date)}</td>
                  <td className="px-4 py-3">{player?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-gray-600">{punishment.reason}</td>
                  <td className="px-4 py-3 text-right font-medium text-red-700">{punishment.amount} kr</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm('Delete this punishment?')) {
                          deletePunishment(punishment.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Rules Editor
function RulesAdmin({ rules, saveRules }) {
  const [content, setContent] = useState(rules)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveRules(content)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Rules</h2>
      <p className="text-gray-600 mb-4">Use Markdown formatting (# for headers, - for lists, **bold**, etc.)</p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
        />
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
          >
            Save Rules
          </button>
          {saved && <span className="text-green-600">Saved!</span>}
        </div>
      </div>
    </div>
  )
}

// Settings
function SettingsAdmin({ resetData }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-gray-800 mb-2">Reset All Data</h3>
        <p className="text-gray-600 mb-4">
          This will reset all players, tournaments, results, and punishments to the initial sample data.
          This action cannot be undone.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset ALL data? This cannot be undone!')) {
              resetData()
              alert('Data has been reset to initial state.')
            }
          }}
          className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800"
        >
          Reset All Data
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="font-bold text-gray-800 mb-2">Admin Password</h3>
        <p className="text-gray-600">
          To change the admin password, edit the <code className="bg-gray-100 px-1 rounded">ADMIN_PASSWORD</code> constant
          in <code className="bg-gray-100 px-1 rounded">src/pages/Admin.jsx</code>
        </p>
      </div>
    </div>
  )
}
