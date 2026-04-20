import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider, useData } from './context/DataContext'
import PasswordGate from './components/PasswordGate'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import TournamentDetail from './pages/TournamentDetail'
import Rules from './pages/Rules'
import Stats from './pages/Stats'
import PlayerStats from './pages/PlayerStats'
import History from './pages/History'

// Only import Admin in development
const Admin = import.meta.env.DEV
  ? (await import('./pages/Admin')).default
  : () => null

function AppRoutes() {
  const { sitePassword, isLoading } = useData()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <div className="text-white">Laddar...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="tournaments/:id" element={<TournamentDetail />} />
          <Route path="stadgar" element={<Rules />} />
          <Route path="stats" element={<Stats />} />
          <Route path="stats/:playerId" element={<PlayerStats />} />
          <Route path="historia" element={<History />} />
          {import.meta.env.DEV && <Route path="admin" element={<Admin />} />}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <DataProvider>
      <AppRoutes />
    </DataProvider>
  )
}

export default App
