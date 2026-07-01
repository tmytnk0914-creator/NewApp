import { formatGridDate } from '../../utils/dateUtils'
import './DailyGrid.css'

// 気温を表示用にフォーマットする
function t(value) {
  return value === null || value === undefined ? '--' : `${value}℃`
}

// 1都市の7日間横並びグリッド
// currentDays: 今年の7日分、lastYearDays: 昨年の7日分(それぞれdateで照合済み配列)
function DailyGrid({ city, windowDates, lyWindowDates, currentDays, lastYearDays, alerts, isSelected, onSelect }) {
  const currentMap = new Map((currentDays ?? []).map((d) => [d.date, d]))
  const lyMap = new Map((lastYearDays ?? []).map((d) => [d.date, d]))

  const hasLy = lastYearDays && lastYearDays.length > 0

  return (
    <div
      className={`daily-grid-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className="daily-grid-header">
        <span className="city-flag-name">
          {city.flag} <strong>{city.displayName}</strong>
          <span className="city-region-label"> / {city.regionName}</span>
        </span>
        {alerts.length > 0 && (
          <div className="daily-grid-alerts">
            {alerts.map((a) => (
              <span key={a.key} className={`alert-badge alert-${a.key}`}>
                {a.icon} {a.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="daily-grid-scroll">
        <table className="daily-grid-table">
          <thead>
            <tr>
              <th className="row-label-cell"></th>
              {windowDates.map((date) => (
                <th key={date} className="date-header">
                  {formatGridDate(date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="row-year-label">
              <td className="row-label-cell">今年</td>
              {windowDates.map((date) => {
                const d = currentMap.get(date)
                return (
                  <td key={date} className="weather-icon-cell">
                    {d ? d.weatherIcon : '–'}
                  </td>
                )
              })}
            </tr>
            <tr className="row-max">
              <td className="row-label-cell">最高</td>
              {windowDates.map((date) => {
                const d = currentMap.get(date)
                return <td key={date} className="temp-max">{t(d?.maxTemp)}</td>
              })}
            </tr>
            <tr className="row-min">
              <td className="row-label-cell">最低</td>
              {windowDates.map((date) => {
                const d = currentMap.get(date)
                return <td key={date} className="temp-min">{t(d?.minTemp)}</td>
              })}
            </tr>

            {hasLy && (
              <>
                <tr className="row-separator">
                  <td colSpan={8}></td>
                </tr>
                <tr className="row-year-label ly-label">
                  <td className="row-label-cell">昨年</td>
                  {lyWindowDates.map((lyDate, i) => {
                    const d = lyMap.get(lyDate)
                    return (
                      <td key={windowDates[i]} className="weather-icon-cell ly-cell">
                        {d ? d.weatherIcon : '–'}
                      </td>
                    )
                  })}
                </tr>
                <tr className="row-max ly-row">
                  <td className="row-label-cell">最高</td>
                  {lyWindowDates.map((lyDate, i) => {
                    const d = lyMap.get(lyDate)
                    return <td key={windowDates[i]} className="temp-max ly-cell">{t(d?.maxTemp)}</td>
                  })}
                </tr>
                <tr className="row-min ly-row">
                  <td className="row-label-cell">最低</td>
                  {lyWindowDates.map((lyDate, i) => {
                    const d = lyMap.get(lyDate)
                    return <td key={windowDates[i]} className="temp-min ly-cell">{t(d?.minTemp)}</td>
                  })}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DailyGrid
