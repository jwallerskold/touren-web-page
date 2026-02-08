import { useData } from '../context/DataContext'

export default function YearSelector() {
  const { currentYear, selectedYear, setSelectedYear, availableYears } = useData()

  if (availableYears.length <= 1) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedYear || currentYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="bg-green-700 text-white border border-green-600 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
      >
        {availableYears.map(year => (
          <option key={year} value={year}>
            {year}{year === currentYear ? ' (Aktuell)' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
