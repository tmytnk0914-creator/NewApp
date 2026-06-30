// 気温を表示用にフォーマットする(欠損時は--を表示)
function formatTemp(value) {
  return value === null || value === undefined ? '--' : `${value}°C`
}

// PC向けの都市一覧テーブル
function CityTable({ rows, selectedCityId, onSelectCity }) {
  return (
    <table className="city-table">
      <thead>
        <tr>
          <th>Region</th>
          <th>City</th>
          <th>Weather</th>
          <th>Max</th>
          <th>Min</th>
          <th>7D Avg Max</th>
          <th>7D Avg Min</th>
          <th>Rain Days</th>
          <th>Alerts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ city, representativeDay, summary, alerts, error }) => (
          <tr
            key={city.id}
            className={selectedCityId === city.id ? 'selected-row' : ''}
            onClick={() => onSelectCity(city.id)}
          >
            <td>
              <span className="flag">{city.flag}</span> {city.regionName}
            </td>
            <td className="city-name-cell">{city.displayName}</td>
            {error ? (
              <td colSpan="6" className="error-cell">
                ⚠️ {error}
              </td>
            ) : (
              <>
                <td className="weather-icon-cell">
                  <span className="weather-icon">{representativeDay?.weatherIcon ?? '❓'}</span>
                  <span className="weather-label">{representativeDay?.weatherLabel ?? 'Unknown'}</span>
                </td>
                <td className="temp-max">{formatTemp(representativeDay?.maxTemp)}</td>
                <td className="temp-min">{formatTemp(representativeDay?.minTemp)}</td>
                <td>{formatTemp(summary.avgMaxTemp)}</td>
                <td>{formatTemp(summary.avgMinTemp)}</td>
                <td>{summary.rainyDays}</td>
                <td>
                  <div className="alert-badges">
                    {alerts.map((alert) => (
                      <span key={alert.key} className={`alert-badge alert-${alert.key}`}>
                        {alert.icon} {alert.label}
                      </span>
                    ))}
                  </div>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CityTable
