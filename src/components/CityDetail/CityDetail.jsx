import { useState } from 'react'
import TemperatureChart from './TemperatureChart'
import DailyTable from './DailyTable'
import { TEMP_VIEWS, TEMP_VIEW_OPTIONS } from '../../constants/tempView'
import './CityDetail.css'

// 選択中の都市の気温推移グラフと日別テーブルを表示するエリア
function CityDetail({ city, weatherData, lastYearData, period, compareLastYear }) {
  // 昨年比較ONのときにグラフが4本線で見づらくなるのを防ぐための表示切り替え
  const [tempView, setTempView] = useState(TEMP_VIEWS.BOTH)

  return (
    <section className="city-detail">
      <div className="city-detail-header">
        <h2>
          {city.flag} {city.displayName} <span className="region-label">({city.regionName})</span>
        </h2>

        {compareLastYear && (
          <div className="temp-view-switch">
            {TEMP_VIEW_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`temp-view-button ${tempView === option.value ? 'active' : ''}`}
                onClick={() => setTempView(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <TemperatureChart
        weatherData={weatherData}
        lastYearData={lastYearData}
        period={period}
        compareLastYear={compareLastYear}
        tempView={tempView}
      />
      <DailyTable weatherData={weatherData} lastYearData={lastYearData} compareLastYear={compareLastYear} />
    </section>
  )
}

export default CityDetail
