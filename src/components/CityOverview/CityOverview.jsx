import CityTable from './CityTable'
import CityCard from './CityCard'
import { filterByPeriod, getRepresentativeDay, summarizeWeather, summarizeYoy } from '../../utils/weatherUtils'
import { getAlerts } from '../../utils/alertUtils'
import './CityOverview.css'

// 登録都市の一覧をPCはテーブル、スマホはカードで表示するエリア
function CityOverview({
  cities,
  weatherByCity,
  errors,
  period,
  selectedCityId,
  onSelectCity,
  loading,
  compareLastYear,
  lastYearByCity,
  lastYearLoading,
}) {
  const rows = cities.map((city) => {
    const allDays = weatherByCity[city.id] ?? []
    const periodDays = filterByPeriod(allDays, period)
    const representativeDay = getRepresentativeDay(allDays)
    const summary = summarizeWeather(periodDays)
    const yoy = compareLastYear ? summarizeYoy(periodDays, lastYearByCity[city.id]) : null
    const alerts = getAlerts(representativeDay, periodDays, yoy)

    return {
      city,
      representativeDay,
      summary,
      yoy,
      alerts,
      error: errors[city.id],
    }
  })

  if (cities.length === 0) {
    return (
      <section className="city-overview empty-state">
        <p>No cities registered yet. Add a city to get started.</p>
      </section>
    )
  }

  return (
    <section className="city-overview">
      {loading && <p className="loading-text">Loading weather data...</p>}
      {compareLastYear && lastYearLoading && <p className="loading-text">Loading last year data...</p>}

      <CityTable
        rows={rows}
        selectedCityId={selectedCityId}
        onSelectCity={onSelectCity}
        compareLastYear={compareLastYear}
      />

      <div className="city-card-list">
        {rows.map((row) => (
          <CityCard
            key={row.city.id}
            row={row}
            isSelected={selectedCityId === row.city.id}
            onSelect={() => onSelectCity(row.city.id)}
            compareLastYear={compareLastYear}
          />
        ))}
      </div>
    </section>
  )
}

export default CityOverview
