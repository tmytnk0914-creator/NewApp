import { formatGridDate } from '../../utils/dateUtils'
import './DailyGrid.css'

function t(value) {
  return value === null || value === undefined ? '--' : `${value}℃`
}

// 最高気温比較バーグラフ: 今年(赤)と昨年(橙)を縦棒で視覚比較する
function MiniBarChart({ windowDates, lyWindowDates, currentMap, lyMap }) {
  const allTemps = []
  windowDates.forEach((d) => {
    const v = currentMap.get(d)?.maxTemp
    if (v != null) allTemps.push(v)
  })
  lyWindowDates.forEach((d) => {
    const v = lyMap.get(d)?.maxTemp
    if (v != null) allTemps.push(v)
  })

  if (allTemps.length === 0) return null

  const chartMax = Math.max(...allTemps)
  const chartMin = Math.min(...allTemps) - 3
  const chartRange = chartMax - chartMin || 1

  const pct = (temp) =>
    temp == null ? 0 : Math.max(4, ((temp - chartMin) / chartRange) * 100)

  return (
    <tr className="chart-row">
      <td className="row-label-cell chart-label">最高比較</td>
      {windowDates.map((date, i) => {
        const cur = currentMap.get(date)?.maxTemp
        const ly = lyMap.get(lyWindowDates[i])?.maxTemp
        return (
          <td key={date} className="mini-chart-cell">
            <div className="mini-bar-wrap">
              {ly != null && (
                <div
                  className="mini-bar ly-bar"
                  style={{ height: `${pct(ly)}%` }}
                  title={`昨年 最高: ${ly}℃`}
                />
              )}
              {cur != null && (
                <div
                  className="mini-bar cur-bar"
                  style={{ height: `${pct(cur)}%` }}
                  title={`今年 最高: ${cur}℃`}
                />
              )}
            </div>
          </td>
        )
      })}
    </tr>
  )
}

// 1都市の7日間横並びグリッド
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
              {windowDates.map((date, i) => (
                <th key={date} className="date-header">
                  {/* 今年の日付 */}
                  <div className="date-cur">{formatGridDate(date)}</div>
                  {/* 昨年の比較日付・曜日 */}
                  {hasLy && lyWindowDates[i] && (
                    <div className="date-ly">昨{formatGridDate(lyWindowDates[i])}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* ミニ棒グラフ(最高気温比較) */}
            {hasLy && (
              <MiniBarChart
                windowDates={windowDates}
                lyWindowDates={lyWindowDates}
                currentMap={currentMap}
                lyMap={lyMap}
              />
            )}

            {/* 今年のデータ行 */}
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

            {/* 昨年のデータ行 */}
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
