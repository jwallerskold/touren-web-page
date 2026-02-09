import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { formatDate } from '../utils/calculations'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [activeTab, setActiveTab] = useState('players')

  const {
    players, tournaments, results, punishments, rules, history,
    addPlayer, updatePlayer, deletePlayer,
    addTournament, updateTournament, deleteTournament,
    setTournamentResults,
    addPunishment, deletePunishment,
    saveRules,
    addHistoryYear, updateHistoryYear, deleteHistoryYear,
    resetData, isLoading,
    verifyPassword, getAdminPassword,
    currentYear
  } = useData()

  useEffect(() => {
    // Check if already authenticated
    if (getAdminPassword()) {
      setIsAuthenticated(true)
    }
  }, [getAdminPassword])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setError('')

    const success = await verifyPassword(password)
    if (success) {
      setIsAuthenticated(true)
    } else {
      setError('Fel lösenord')
    }
    setIsLoggingIn(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('adminPassword')
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin-inloggning</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lösenord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ange admin-lösenord"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors disabled:bg-green-400"
            >
              {isLoggingIn ? 'Loggar in...' : 'Logga in'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center py-12">Laddar...</div>
  }

  const tabs = [
    { id: 'players', label: 'Spelare' },
    { id: 'tournaments', label: 'Tävlingar' },
    { id: 'results', label: 'Resultat' },
    { id: 'punishments', label: 'Straff' },
    { id: 'rules', label: 'Stadgar' },
    { id: 'history', label: 'Historia' },
    { id: 'settings', label: 'Inställningar' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Adminpanel</h1>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-800"
        >
          Logga ut
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
          currentYear={currentYear}
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
          tournaments={tournaments}
          punishments={punishments}
          addPunishment={addPunishment}
          deletePunishment={deletePunishment}
        />
      )}
      {activeTab === 'rules' && (
        <RulesAdmin rules={rules} saveRules={saveRules} />
      )}
      {activeTab === 'history' && (
        <HistoryAdmin
          history={history}
          addHistoryYear={addHistoryYear}
          updateHistoryYear={updateHistoryYear}
          deleteHistoryYear={deleteHistoryYear}
        />
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
        {editingId ? 'Redigera spelare' : 'Lägg till ny spelare'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Namn</label>
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
            {editingId ? 'Uppdatera' : 'Lägg till'} spelare
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Avbryt
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Alla spelare ({players.length})</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Namn</th>
              <th className="px-4 py-3 text-center">Handicap</th>
              <th className="px-4 py-3 text-right">Åtgärder</th>
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
                    Redigera
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Ta bort denna spelare och all deras data?')) {
                        deletePlayer(player.id)
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Ta bort
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
function TournamentsAdmin({ tournaments, addTournament, updateTournament, deleteTournament, currentYear }) {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '', course: '', date: '', description: '', imageUrl: '', isFinale: false, order: '', year: currentYear || new Date().getFullYear()
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      order: parseInt(formData.order) || tournaments.length + 1,
      year: parseInt(formData.year) || currentYear || new Date().getFullYear(),
    }
    if (editingId) {
      updateTournament(editingId, data)
      setEditingId(null)
    } else {
      addTournament(data)
    }
    setFormData({ name: '', course: '', date: '', description: '', imageUrl: '', isFinale: false, order: '', year: currentYear || new Date().getFullYear() })
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
      year: tournament.year || currentYear || new Date().getFullYear(),
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', course: '', date: '', description: '', imageUrl: '', isFinale: false, order: '', year: currentYear || new Date().getFullYear() })
  }

  const sortedTournaments = [...tournaments].sort((a, b) => a.order - b.order)

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {editingId ? 'Redigera tävling' : 'Lägg till ny tävling'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Namn</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bana</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordning</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 1, 2, 3..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Säsong (år)</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 2025, 2026..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bild-URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="/images/courses/my-course.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivning</label>
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
              <span className="text-sm font-medium text-gray-700">Detta är Tourfinalen</span>
            </label>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
            {editingId ? 'Uppdatera' : 'Lägg till'} tävling
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
              Avbryt
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Alla tävlingar ({tournaments.length})</h2>
      <div className="space-y-2">
        {sortedTournaments.map(tournament => (
          <div key={tournament.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <div>
              <span className="text-gray-400 mr-2">#{tournament.order}</span>
              <span className="font-medium">{tournament.name}</span>
              <span className="text-gray-500 mx-2">-</span>
              <span className="text-gray-600">{tournament.course}</span>
              <span className="text-gray-400 ml-2">({formatDate(tournament.date)})</span>
              <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{tournament.year || '?'}</span>
              {tournament.isFinale && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">TOURFINALEN</span>
              )}
            </div>
            <div>
              <button onClick={() => startEdit(tournament)} className="text-blue-600 hover:text-blue-800 mr-3">
                Redigera
              </button>
              <button
                onClick={() => {
                  if (confirm('Ta bort denna tävling och dess resultat?')) {
                    deleteTournament(tournament.id)
                  }
                }}
                className="text-red-600 hover:text-red-800"
              >
                Ta bort
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
          roundPoints: existing?.roundPoints || '',
          points: existing?.points || '',
          position: existing?.position || '',
          putts: existing?.putts || '',
          fairwaysHit: existing?.fairwaysHit || '',
          greensInRegulation: existing?.greensInRegulation || '',
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
      .filter(r => r.participated && r.grossScore && r.roundPoints && r.points && r.position)
      .map(r => ({
        playerId: r.playerId,
        grossScore: parseInt(r.grossScore),
        netScore: r.netScore ? parseInt(r.netScore) : null,
        roundPoints: parseInt(r.roundPoints),
        points: parseInt(r.points),
        position: parseInt(r.position),
        putts: r.putts ? parseInt(r.putts) : null,
        fairwaysHit: r.fairwaysHit ? parseInt(r.fairwaysHit) : null,
        greensInRegulation: r.greensInRegulation ? parseInt(r.greensInRegulation) : null,
      }))

    setTournamentResults(selectedTournament, validResults)
    alert('Resultat sparade!')
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Registrera resultat</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Välj tävling</label>
        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">-- Välj tävling --</option>
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
                <th className="px-3 py-2 text-left">Deltog</th>
                <th className="px-3 py-2 text-left">Spelare</th>
                <th className="px-3 py-2 text-center">Pos</th>
                <th className="px-3 py-2 text-center">Brutto</th>
                <th className="px-3 py-2 text-center">Putts</th>
                <th className="px-3 py-2 text-center">FW</th>
                <th className="px-3 py-2 text-center">GIR</th>
                <th className="px-3 py-2 text-center">Poäng runda</th>
                <th className="px-3 py-2 text-center">Tour-poäng</th>
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
                      value={row.putts}
                      onChange={(e) => updateFormRow(index, 'putts', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      disabled={!row.participated}
                      placeholder="32"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.fairwaysHit}
                      onChange={(e) => updateFormRow(index, 'fairwaysHit', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      disabled={!row.participated}
                      placeholder="/14"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.greensInRegulation}
                      onChange={(e) => updateFormRow(index, 'greensInRegulation', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      disabled={!row.participated}
                      placeholder="/18"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.roundPoints}
                      onChange={(e) => updateFormRow(index, 'roundPoints', e.target.value)}
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
              Spara resultat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Punishments Management
function PunishmentsAdmin({ players, tournaments, punishments, addPunishment, deletePunishment }) {
  const [formData, setFormData] = useState({ playerId: '', tournamentId: '', amount: '', reason: '' })

  const sortedTournaments = [...tournaments].sort((a, b) => a.order - b.order)

  const handleSubmit = (e) => {
    e.preventDefault()
    addPunishment({
      playerId: formData.playerId,
      tournamentId: formData.tournamentId,
      amount: parseInt(formData.amount),
      reason: formData.reason,
    })
    setFormData({ playerId: '', tournamentId: '', amount: '', reason: '' })
  }

  const sortedPunishments = [...punishments]
    .map(p => {
      const tournament = tournaments.find(t => t.id === p.tournamentId)
      return { ...p, tournamentName: tournament?.name || 'Okänd', tournamentOrder: tournament?.order || 0 }
    })
    .sort((a, b) => b.tournamentOrder - a.tournamentOrder)

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Lägg till straff</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spelare</label>
            <select
              value={formData.playerId}
              onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">-- Välj spelare --</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Belopp (kr)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tävling</label>
            <select
              value={formData.tournamentId}
              onChange={(e) => setFormData({ ...formData, tournamentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">-- Välj tävling --</option>
              {sortedTournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anledning</label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="t.ex. 3-putt på hål 9"
              required
            />
          </div>
        </div>
        <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800">
          Lägg till straff
        </button>
      </form>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Alla straff ({punishments.length})</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-red-100">
            <tr>
              <th className="px-4 py-3 text-left">Tävling</th>
              <th className="px-4 py-3 text-left">Spelare</th>
              <th className="px-4 py-3 text-left">Anledning</th>
              <th className="px-4 py-3 text-right">Belopp</th>
              <th className="px-4 py-3 text-right">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {sortedPunishments.map(punishment => {
              const player = players.find(p => p.id === punishment.playerId)
              return (
                <tr key={punishment.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-600">{punishment.tournamentName}</td>
                  <td className="px-4 py-3">{player?.name || 'Okänd'}</td>
                  <td className="px-4 py-3 text-gray-600">{punishment.reason}</td>
                  <td className="px-4 py-3 text-right font-medium text-red-700">{punishment.amount} kr</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm('Ta bort detta straff?')) {
                          deletePunishment(punishment.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Ta bort
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
      <h2 className="text-xl font-bold text-gray-800 mb-4">Redigera stadgar</h2>
      <p className="text-gray-600 mb-4">Använd Markdown-formatering (# för rubriker, - för listor, **fetstil**, etc.)</p>

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
            Spara stadgar
          </button>
          {saved && <span className="text-green-600">Sparat!</span>}
        </div>
      </div>
    </div>
  )
}

// Settings
function SettingsAdmin({ resetData }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Inställningar</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-gray-800 mb-2">Återställ all data</h3>
        <p className="text-gray-600 mb-4">
          Detta återställer alla spelare, tävlingar, resultat och straff till ursprunglig exempeldata.
          Denna åtgärd kan inte ångras.
        </p>
        <button
          onClick={() => {
            if (confirm('Är du säker på att du vill återställa ALL data? Detta kan inte ångras!')) {
              resetData()
              alert('Data har återställts till ursprungligt tillstånd.')
            }
          }}
          className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800"
        >
          Återställ all data
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="font-bold text-gray-800 mb-2">Admin-lösenord</h3>
        <p className="text-gray-600">
          För att ändra admin-lösenordet, redigera <code className="bg-gray-100 px-1 rounded">server/data/config.json</code>
        </p>
      </div>
    </div>
  )
}

// History Management
function HistoryAdmin({ history, addHistoryYear, updateHistoryYear, deleteHistoryYear }) {
  const [editingYear, setEditingYear] = useState(null)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    teamPhotoUrl: '',
    tourWinner: { name: '', photoUrl: '', points: '', description: '' },
    finalWinner: { name: '', photoUrl: '', course: '', description: '' },
    notes: ''
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      teamPhotoUrl: '',
      tourWinner: { name: '', photoUrl: '', points: '', description: '' },
      finalWinner: { name: '', photoUrl: '', course: '', description: '' },
      notes: ''
    })
    setEditingYear(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const data = {
      ...formData,
      year: parseInt(formData.year),
      tourWinner: {
        ...formData.tourWinner,
        points: formData.tourWinner.points ? parseInt(formData.tourWinner.points) : null
      }
    }

    // Check for duplicate year when adding new
    if (!editingYear) {
      const existingYear = history?.find(h => h.year === data.year)
      if (existingYear) {
        setError(`År ${data.year} finns redan. Redigera befintligt år istället.`)
        setSaving(false)
        return
      }
    }

    try {
      if (editingYear) {
        await updateHistoryYear(editingYear, data)
      } else {
        await addHistoryYear(data)
      }
      resetForm()
    } catch (err) {
      setError(err.message || 'Något gick fel vid sparandet')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (yearData) => {
    setEditingYear(yearData.year)
    setError('')
    setFormData({
      year: yearData.year,
      teamPhotoUrl: yearData.teamPhotoUrl || '',
      tourWinner: {
        name: yearData.tourWinner?.name || '',
        photoUrl: yearData.tourWinner?.photoUrl || '',
        points: yearData.tourWinner?.points || '',
        description: yearData.tourWinner?.description || ''
      },
      finalWinner: {
        name: yearData.finalWinner?.name || '',
        photoUrl: yearData.finalWinner?.photoUrl || '',
        course: yearData.finalWinner?.course || '',
        description: yearData.finalWinner?.description || ''
      },
      notes: yearData.notes || ''
    })
  }

  const sortedHistory = [...(history || [])].sort((a, b) => b.year - a.year)

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {editingYear ? `Redigera ${editingYear}` : 'Lägg till år'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">År</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              disabled={editingYear !== null}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lagbild URL</label>
            <input
              type="text"
              value={formData.teamPhotoUrl}
              onChange={(e) => setFormData({ ...formData, teamPhotoUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="/images/history/2025-team.jpg"
            />
          </div>
        </div>

        {/* Tour Winner */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-bold text-gray-800 mb-3">Tourvinnare</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Namn</label>
              <input
                type="text"
                value={formData.tourWinner.name}
                onChange={(e) => setFormData({
                  ...formData,
                  tourWinner: { ...formData.tourWinner, name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poäng</label>
              <input
                type="number"
                value={formData.tourWinner.points}
                onChange={(e) => setFormData({
                  ...formData,
                  tourWinner: { ...formData.tourWinner, points: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto URL</label>
              <input
                type="text"
                value={formData.tourWinner.photoUrl}
                onChange={(e) => setFormData({
                  ...formData,
                  tourWinner: { ...formData.tourWinner, photoUrl: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="/images/history/2025-tour-winner.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivning</label>
              <input
                type="text"
                value={formData.tourWinner.description}
                onChange={(e) => setFormData({
                  ...formData,
                  tourWinner: { ...formData.tourWinner, description: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Final Winner */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-bold text-gray-800 mb-3">Finalvinnare</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Namn</label>
              <input
                type="text"
                value={formData.finalWinner.name}
                onChange={(e) => setFormData({
                  ...formData,
                  finalWinner: { ...formData.finalWinner, name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bana</label>
              <input
                type="text"
                value={formData.finalWinner.course}
                onChange={(e) => setFormData({
                  ...formData,
                  finalWinner: { ...formData.finalWinner, course: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto URL</label>
              <input
                type="text"
                value={formData.finalWinner.photoUrl}
                onChange={(e) => setFormData({
                  ...formData,
                  finalWinner: { ...formData.finalWinner, photoUrl: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="/images/history/2025-final-winner.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivning</label>
              <input
                type="text"
                value={formData.finalWinner.description}
                onChange={(e) => setFormData({
                  ...formData,
                  finalWinner: { ...formData.finalWinner, description: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t pt-4 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Anteckningar</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows="2"
            placeholder="Övriga minnesanteckningar från säsongen..."
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 disabled:bg-green-400"
          >
            {saving ? 'Sparar...' : (editingYear ? 'Uppdatera' : 'Lägg till')} {!saving && 'år'}
          </button>
          {editingYear && (
            <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
              Avbryt
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Sparad historik ({sortedHistory.length})</h2>
      <div className="space-y-4">
        {sortedHistory.map(yearData => (
          <div key={yearData.year} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{yearData.year}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  {yearData.tourWinner?.name && (
                    <p>Tourvinnare: <span className="font-medium">{yearData.tourWinner.name}</span></p>
                  )}
                  {yearData.finalWinner?.name && (
                    <p>Finalvinnare: <span className="font-medium">{yearData.finalWinner.name}</span></p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(yearData)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Redigera
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Ta bort historik för ${yearData.year}?`)) {
                      deleteHistoryYear(yearData.year)
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Ta bort
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
