// 気温を表示用にフォーマットする(欠損時は--を表示)
function formatTemp(value) {
  return value === null || value === undefined ? '--' : `${value}°C`
}

// スマホ向けの都市カード
function CityCard({ row, isSelected, onSelect }) {
  const { city, representativeDay, summary, alerts, error } = row

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
