import { formatDateLabel } from '../../utils/dateUtils'

// 日別の天気データをテーブルで表示する
function DailyTable({ weatherData }) {
  if (weatherData.length === 0) {
    return null
  }

  return (
    <table className="daily-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weather</th>
          <th>Max</th>
          <th>Min</th>
          <th>Precipitation</th>
        </tr>
      </thead>
      <tbody>
        {weatherData.map((day) => (
          <tr key={day.date} className={day.source === 'past' ? 'past-row' : 'forecast-row'}>
            <td>{formatDateLabel(day.date)}</td>
            <td>
              {day.weatherIcon} {day.weatherLabel}
            </td>
            <td>{day.maxTemp}°C</td>
            <td>{day.minTemp}°C</td>
            <td>{day.precipitationSum} mm</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DailyTable
