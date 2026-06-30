import { MONTH_LABELS } from '../../constants/monthlyMetrics'

// 指標値を表示用にフォーマットする(単位は℃またはdays)
function formatValue(value, unit) {
  if (value === null || value === undefined) return '--'
  return unit === '℃' ? `${value}℃` : `${value} days`
}

// 差分を表示用にフォーマットする(プラスは+記号、マイナスは-記号を必ず表示)
function formatDiff(value, unit) {
  if (value === null || value === undefined) return '--'
  const sign = value > 0 ? '+' : ''
  return unit === '℃' ? `${sign}${value}℃` : `${sign}${value} days`
}

function monthLabel(month) {
  return month ? MONTH_LABELS[month - 1] : '--'
}

// 選択都市・選択指標についての要約カード
function SummaryCard({ city, metricOption, summary }) {
  const { latestMonth, latestValue, yoyDiff, vs2yDiff, highestMonth, lowestMonth } = summary

  return (
    <div className="summary-card">
      <h3>
        {city.flag} {city.displayName} / {metricOption.label}
      </h3>
      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-label">Latest Month</span>
          <span className="summary-value">{monthLabel(latestMonth)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">This Year</span>
          <span className="summary-value">{formatValue(latestValue, metricOption.unit)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">YoY</span>
          <span className="summary-value">{formatDiff(yoyDiff, metricOption.unit)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Vs 2 Years Ago</span>
          <span className="summary-value">{formatDiff(vs2yDiff, metricOption.unit)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Highest Month</span>
          <span className="summary-value">{monthLabel(highestMonth)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Lowest Month</span>
          <span className="summary-value">{monthLabel(lowestMonth)}</span>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard
