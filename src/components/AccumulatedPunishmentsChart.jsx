import { useData } from '../context/DataContext'
import { calculateAccumulatedPunishments } from '../utils/calculations'
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
  '#dc2626', // red
  '#ea580c', // orange
  '#9333ea', // purple
  '#2563eb', // blue
  '#16a34a', // green
  '#0891b2', // cyan
  '#c026d3', // fuchsia
  '#65a30d', // lime
  '#e11d48', // rose
  '#6366f1', // indigo
]

export default function AccumulatedPunishmentsChart() {
  const { players, punishments, tournaments, results } = useData()

  if (tournaments.length === 0 || punishments.length === 0 || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Inga straffavgifter att visa i graf ännu
      </div>
    )
  }

  const chartData = calculateAccumulatedPunishments(players, punishments, tournaments, results)

  // Get players who have at least one punishment
  const playersWithPunishments = players.filter(player =>
    punishments.some(p => p.playerId === player.id)
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Ackumulerade straffavgifter per spelare</h3>
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
              label={{ value: 'Avgift (kr)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value) => [`${value} kr`, '']}
            />
            <Legend />
            {playersWithPunishments.map((player, index) => (
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
