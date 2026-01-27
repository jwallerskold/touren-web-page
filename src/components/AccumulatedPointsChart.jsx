import { useData } from '../context/DataContext'
import { calculateAccumulatedPoints } from '../utils/calculations'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Color palette for different players
const COLORS = [
  '#16a34a', // green
  '#2563eb', // blue
  '#dc2626', // red
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
  '#c026d3', // fuchsia
  '#65a30d', // lime
  '#e11d48', // rose
  '#6366f1', // indigo
]

export default function AccumulatedPointsChart() {
  const { players, results, tournaments } = useData()

  if (tournaments.length === 0 || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Inga resultat att visa i graf ännu
      </div>
    )
  }

  const chartData = calculateAccumulatedPoints(players, results, tournaments)

  // Get players who have at least one result
  const playersWithResults = players.filter(player =>
    results.some(r => r.playerId === player.id)
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Ackumulerade poäng per spelare</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="tournament"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{ value: 'Poäng', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            {playersWithResults.map((player, index) => (
              <Line
                key={player.id}
                type="monotone"
                dataKey={player.name}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
