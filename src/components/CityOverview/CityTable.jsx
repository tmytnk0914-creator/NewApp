// 気温を表示用にフォーマットする(欠損時は--を表示)
function formatTemp(value) {
  return value === null || value === undefined ? '--' : `${value}°C`
}

// 前年差分を表示用にフォーマットする(プラスは+記号、マイナスは-記号を必ず表示)
function formatDiff(value) {
  if (value === null || value === undefined) return '--'
  return `${value > 0 ? '+' : ''}${value}℃`
}

// PC向けの都市一覧テーブル
function CityTable({ rows, selectedCityId, onSelectCity, compareLastYear }) {
  // 昨年比較OFFのときは6列、ONのときは前年差2列を加えた8列分のエラーセルにする
  const errorColSpan = compareLastYear ? 8 : 6

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
          {compareLastYear && (
            <>
              <th>YoY Max</th>
              <th>YoY Min</th>
            </>
          )}
          <th>Rain Days</th>
          <th>Alerts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ city, representativeDay, summary, yoy, alerts, error }) => (
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
              <td colSpan={errorColSpan} className="error-cell">
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
                {compareLastYear && (
                  <>
                    <td className={yoyClass(yoy?.maxDiff)}>{formatDiff(yoy?.maxDiff)}</td>
                    <td className={yoyClass(yoy?.minDiff)}>{formatDiff(yoy?.minDiff)}</td>
                  </>
                )}
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

// 前年差分の正負に応じた色分けクラスを返す
function yoyClass(value) {
  if (value === null || value === undefined) return ''
  return value > 0 ? 'yoy-warmer-text' : value < 0 ? 'yoy-cooler-text' : ''
}

export default CityTable
