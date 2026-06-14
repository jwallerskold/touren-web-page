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
  LabelList,
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
  const { players, filteredResults: results, filteredTournaments: tournaments } = useData()

  if (tournaments.length === 0 || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Inga resultat att visa i graf ännu
      </div>
    )
  }

  const chartData = calculateAccumulatedPoints(players, results, tournaments)
  const lastIndex = chartData.length - 1

  // Get players who have at least one result
  const playersWithResults = players.filter(player =>
    results.some(r => r.playerId === player.id)
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Ackumulerade Tour-poäng per spelare</h3>
      <div className="h-[550px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 130, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="tournament"
              tick={{ fontSize: 12 }}
              angle={-30}
              textAnchor="end"
              height={20}
              dy={35}
            />
            <YAxis
              label={{ value: 'Tour-poäng', angle: -90, position: 'insideLeft' }}
            />
            {playersWithResults.map((player, index) => (
              <Line
              key={player.id}
              type="monotone"
              dataKey={player.name}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
            >
              <LabelList
                content={({ x, y, index: i }) => {
                  if (i !== lastIndex) return null

                  return (
                    <text
                      x={x + 8}
                      y={y}
                      fill={COLORS[index % COLORS.length]}
                      fontSize={12}
                      alignmentBaseline="middle"
                    >
                      {player.name}
                    </text>
                  )
                }}
              />
            </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
