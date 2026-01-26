import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import TournamentDetail from './pages/TournamentDetail'
import Rules from './pages/Rules'
import Stats from './pages/Stats'
import PlayerStats from './pages/PlayerStats'
import Admin from './pages/Admin'
import History from './pages/History'

function App() {
  return (
    <DataProvider>
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
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
