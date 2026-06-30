// 気温を表示用にフォーマットする(欠損時は--を表示)
function formatTemp(value) {
  return value === null || value === undefined ? '--' : `${value}°C`
}

// 前年差分を表示用にフォーマットする(プラスは+記号、マイナスは-記号を必ず表示)
function formatDiff(value) {
  if (value === null || value === undefined) return '--'
  return `${value > 0 ? '+' : ''}${value}℃`
}

// スマホ向けの都市カード
function CityCard({ row, isSelected, onSelect, compareLastYear }) {
  const { city, representativeDay, summary, yoy, alerts, error } = row

  return (
    <div className={`city-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="city-card-header">
        <span className="city-card-title">{city.displayName}</span>
        <span className="city-card-region">
          {city.flag} {city.regionName}
        </span>
      </div>

      {error ? (
        <p className="error-cell">⚠️ {error}</p>
      ) : (
        <>
          <div className="city-card-weather">
            <span className="weather-icon-large">{representativeDay?.weatherIcon ?? '❓'}</span>
            <div className="city-card-temps">
              <span className="temp-max">Max {formatTemp(representativeDay?.maxTemp)}</span>
              <span className="temp-min">Min {formatTemp(representativeDay?.minTemp)}</span>
            </div>
          </div>

          <div className="city-card-avg">
            7D Avg Max {formatTemp(summary.avgMaxTemp)} / Avg Min {formatTemp(summary.avgMinTemp)}
          </div>

          {compareLastYear && (
            <div className="yoy-badges">
              <span className="yoy-badge">YoY Max {formatDiff(yoy?.maxDiff)}</span>
              <span className="yoy-badge">YoY Min {formatDiff(yoy?.minDiff)}</span>
            </div>
          )}

          <div className="alert-badges">
            {alerts.map((alert) => (
              <span key={alert.key} className={`alert-badge alert-${alert.key}`}>
                {alert.icon} {alert.label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default CityCard
