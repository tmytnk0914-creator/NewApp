import TemperatureChart from './TemperatureChart'
import DailyTable from './DailyTable'
import './CityDetail.css'

// 選択中の都市の気温推移グラフと日別テーブルを表示するエリア
function CityDetail({ city, weatherData, period }) {
  return (
    <section className="city-detail">
      <h2>
        {city.flag} {city.displayName} <span className="region-label">({city.regionName})</span>
      </h2>

      <TemperatureChart weatherData={weatherData} period={period} />
      <DailyTable weatherData={weatherData} />
    </section>
  )
}

export default CityDetail
