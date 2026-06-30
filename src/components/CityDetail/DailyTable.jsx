import { formatDateLabel } from '../../utils/dateUtils'
import { pairWithLastYear, round1 } from '../../utils/weatherUtils'

// 前年差分を表示用にフォーマットする(プラスは+記号、マイナスは-記号を必ず表示)
function formatDiff(value) {
  if (value === null || value === undefined) return '--'
  return `${value > 0 ? '+' : ''}${value}℃`
}

// 日別の天気データをテーブルで表示する(昨年比較ONのときは前年実績・前年差分列を追加)
function DailyTable({ weatherData, lastYearData, compareLastYear }) {
  if (weatherData.length === 0) {
    return null
  }

  const rows = compareLastYear ? pairWithLastYear(weatherData, lastYearData) : weatherData

  return (
    <table className="daily-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weather</th>
          <th>Max</th>
          <th>Min</th>
          {compareLastYear && (
            <>
              <th>Last Year Max</th>
              <th>Last Year Min</th>
              <th>YoY Max Diff</th>
              <th>YoY Min Diff</th>
            </>
          )}
          <th>Precipitation</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((day) => {
          const lastYear = day.lastYear ?? null
          const maxDiff = lastYear ? round1(day.maxTemp - lastYear.maxTemp) : null
          const minDiff = lastYear ? round1(day.minTemp - lastYear.minTemp) : null

          return (
            <tr key={day.date} className={day.source === 'past' ? 'past-row' : 'forecast-row'}>
              <td>{formatDateLabel(day.date)}</td>
              <td>
                {day.weatherIcon} {day.weatherLabel}
              </td>
              <td>{day.maxTemp}°C</td>
              <td>{day.minTemp}°C</td>
              {compareLastYear && (
                <>
                  <td>{lastYear ? `${lastYear.maxTemp}°C` : '--'}</td>
                  <td>{lastYear ? `${lastYear.minTemp}°C` : '--'}</td>
                  <td>{formatDiff(maxDiff)}</td>
                  <td>{formatDiff(minDiff)}</td>
                </>
              )}
              <td>{day.precipitationSum} mm</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default DailyTable
