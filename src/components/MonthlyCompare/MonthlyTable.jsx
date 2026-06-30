import { MONTH_LABELS } from '../../constants/monthlyMetrics'
import { calcMetricDiffs } from '../../utils/monthlyUtils'

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

// 差分の正負に応じた色分けクラスを返す
function diffClass(value) {
  if (value === null || value === undefined) return ''
  return value > 0 ? 'diff-positive' : value < 0 ? 'diff-negative' : ''
}

// 月次比較テーブル(Month / This Year / Last Year / 2 Years Ago / YoY Diff / Vs 2Y Avg)
function MonthlyTable({ rows, metric, metricOption }) {
  return (
    <div className="monthly-table-wrapper">
      <table className="monthly-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>This Year</th>
            <th>Last Year</th>
            <th>2 Years Ago</th>
            <th>YoY Diff</th>
            <th>Vs 2Y Avg</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const thisValue = row.thisYearData?.[metric] ?? null
            const lastValue = row.lastYearData?.[metric] ?? null
            const twoYearsAgoValue = row.twoYearsAgoData?.[metric] ?? null
            const { yoyDiff, vs2yDiff } = calcMetricDiffs(thisValue, lastValue, twoYearsAgoValue)

            return (
              <tr key={row.month}>
                <td>{MONTH_LABELS[row.month - 1]}</td>
                <td>{formatValue(thisValue, metricOption.unit)}</td>
                <td>{formatValue(lastValue, metricOption.unit)}</td>
                <td>{formatValue(twoYearsAgoValue, metricOption.unit)}</td>
                <td className={diffClass(yoyDiff)}>{formatDiff(yoyDiff, metricOption.unit)}</td>
                <td className={diffClass(vs2yDiff)}>{formatDiff(vs2yDiff, metricOption.unit)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default MonthlyTable
