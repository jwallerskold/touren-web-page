import { useData } from '../context/DataContext'

export default function History() {
  const { history, isLoading } = useData()

  if (isLoading) {
    return <div className="text-center py-12">Laddar...</div>
  }

  // Sort years in descending order (most recent first)
  const sortedHistory = [...(history || [])].sort((a, b) => b.year - a.year)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Historia</h1>
        <p className="text-gray-600">Tidigare års vinnare och minnen från Touren</p>
      </div>

      {sortedHistory.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
          Ingen historik registrerad ännu
        </div>
      ) : (
        <div className="space-y-12">
          {sortedHistory.map((year) => (
            <section key={year.year} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Year Header */}
              <div className="bg-green-800 text-white px-6 py-4">
                <h2 className="text-2xl font-bold">{year.year}</h2>
              </div>

              <div className="p-6">
                {/* Team Photo */}
                {year.teamPhotoUrl && (
                  <div className="mb-6">
                    <img
                      src={year.teamPhotoUrl}
                      alt={`Touren ${year.year} - Lagbild`}
                      className="w-full h-64 md:h-96 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Winners Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Tour Winner */}
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🏆</span>
                      <h3 className="text-lg font-bold text-gray-800">Tourvinnare</h3>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      {year.tourWinner?.photoUrl && (
                        <img
                          src={year.tourWinner.photoUrl}
                          alt={year.tourWinner.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
                        />
                      )}
                      <div className="text-center md:text-left">
                        <p className="text-xl font-bold text-gray-800">{year.tourWinner?.name || 'Ej registrerad'}</p>
                        {year.tourWinner?.points && (
                          <p className="text-yellow-700 font-medium">{year.tourWinner.points} poäng</p>
                        )}
                        {year.tourWinner?.description && (
                          <p className="text-gray-600 text-sm mt-2">{year.tourWinner.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Final Winner */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🥇</span>
                      <h3 className="text-lg font-bold text-gray-800">Finalvinnare</h3>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      {year.finalWinner?.photoUrl && (
                        <img
                          src={year.finalWinner.photoUrl}
                          alt={year.finalWinner.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-orange-400"
                        />
                      )}
                      <div className="text-center md:text-left">
                        <p className="text-xl font-bold text-gray-800">{year.finalWinner?.name || 'Ej registrerad'}</p>
                        {year.finalWinner?.course && (
                          <p className="text-orange-700 font-medium">{year.finalWinner.course}</p>
                        )}
                        {year.finalWinner?.description && (
                          <p className="text-gray-600 text-sm mt-2">{year.finalWinner.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {year.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{year.notes}</p>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
