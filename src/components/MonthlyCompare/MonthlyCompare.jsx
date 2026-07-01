import { useState, useMemo } from 'react'
import MetricSwitch from './MetricSwitch'
import SummaryCard from './SummaryCard'
import MonthlyChart from './MonthlyChart'
import MonthlyTable from './MonthlyTable'
import { useMonthlyWeather } from '../../hooks/useMonthlyWeather'
import { MONTHLY_METRICS, MONTHLY_METRIC_OPTIONS } from '../../constants/monthlyMetrics'
import {
  buildMonthlyComparisonRows,
  calcMetricDiffs,
  findLatestMonthWithData,
  findExtremeMonth,
} from '../../utils/monthlyUtils'
import { groupCitiesByRegion } from '../../utils/cityUtils'
import './MonthlyCompare.css'

// 月次気温比較画面 - 全登録都市を地域順に一括表示する(Phase 3改)
function MonthlyCompare({ cities }) {
  const [metric, setMetric] = useState(MONTHLY_METRICS.AVG_MAX_TEMP)

  const currentYear = new Date().getFullYear()
  const years = useMemo(() => [currentYear, currentYear - 1, currentYear - 2], [currentYear])

  const { getMonthlyData, loading, errors, refresh } = useMonthlyWeather(cities, years)

  const metricOption = MONTHLY_METRIC_OPTIONS.find((o) => o.value === metric)
  const regionGroups = groupCitiesByRegion(cities)

  if (cities.length === 0) {
    return <p className="empty-state">都市が登録されていません。概要画面から都市を追加してください。</p>
  }

  return (
    <section className="monthly-compare">
      <div className="monthly-top-controls">
        <MetricSwitch metric={metric} onChangeMetric={setMetric} />
        <button className="refresh-button" onClick={refresh} disabled={loading}>
          {loading ? 'データ取得中...' : '🔄 データを更新'}
        </button>
      </div>

      {loading && <p className="loading-text">月次データを取得中（しばらくお待ちください）...</p>}

      {regionGroups.map((group) => (
        <div key={group.id} className="monthly-region-section">
          <h3 className="monthly-region-label">{group.label}</h3>

          {group.cities.map((city) => {
            const thisYearMonthly = getMonthlyData(city.id, years[0])
            const monthlyByYear = {
              [years[0]]: getMonthlyData(city.id, years[0]),
              [years[1]]: getMonthlyData(city.id, years[1]),
              [years[2]]: getMonthlyData(city.id, years[2]),
            }
            const rows = buildMonthlyComparisonRows(monthlyByYear, years)

            const latestMonth = findLatestMonthWithData(thisYearMonthly)
            const latestRow = rows.find((r) => r.month === latestMonth)
            const latestValue = latestRow?.thisYearData?.[metric] ?? null
            const lastValueForLatest = latestRow?.lastYearData?.[metric] ?? null
            const twoYearsAgoValueForLatest = latestRow?.twoYearsAgoData?.[metric] ?? null
            const { yoyDiff, vs2yDiff } = calcMetricDiffs(latestValue, lastValueForLatest, twoYearsAgoValueForLatest)
            const highestMonth = findExtremeMonth(thisYearMonthly, metric, 'max')
            const lowestMonth = findExtremeMonth(thisYearMonthly, metric, 'min')
            const summary = { latestMonth, latestValue, yoyDiff, vs2yDiff, highestMonth, lowestMonth }

            const cityErrorKey = `${city.id}_${years[0]}`
            const hasError = errors[cityErrorKey]

            return (
              <div key={city.id} className="monthly-city-block">
                <div className="monthly-city-header">
                  <span className="monthly-city-name">
                    {city.flag} {city.displayName}
                    <span className="monthly-city-region"> / {city.regionName}</span>
                  </span>
                </div>

                {hasError && <p className="error-cell">⚠️ データの取得に失敗しました</p>}

                {!hasError && (
                  <>
                    <SummaryCard city={city} metricOption={metricOption} summary={summary} />
                    <MonthlyChart rows={rows} metric={metric} metricOption={metricOption} years={years} />
                    <MonthlyTable rows={rows} metric={metric} metricOption={metricOption} />
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </section>
  )
}

export default MonthlyCompare
