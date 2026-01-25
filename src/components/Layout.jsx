import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-green-800 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>Golf Tour 2025 - Grand Finale in Spain</p>
          <p className="text-green-300 text-sm mt-1">May the best golfer win!</p>
        </div>
      </footer>
    </div>
  )
}
