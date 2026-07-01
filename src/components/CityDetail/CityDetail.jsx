import TemperatureChart from './TemperatureChart'
import './CityDetail.css'

// 選択中の都市の気温推移グラフを表示するエリア
function CityDetail({ city, currentDays, lastYearDays }) {
  return (
    <section className="city-detail">
      <div className="city-detail-header">
        <h2>
          {city.flag} {city.displayName}{' '}
          <span className="region-label">({city.regionName})</span>
        </h2>
      </div>

      <TemperatureChart currentDays={currentDays} lastYearDays={lastYearDays} />
    </section>
  )
}

export default CityDetail
