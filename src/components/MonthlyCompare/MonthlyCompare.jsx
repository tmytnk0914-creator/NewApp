import { useState, useMemo } from 'react'
import CitySelect from './CitySelect'
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
import './MonthlyCompare.css'

// 月次気温比較画面(Phase 3)
// 選択した1都市について、今年・昨年・一昨年の月次平均気温/日数指標を比較する
// 全都市の一括取得は行わず、都市選択時にその都市の3年分だけを取得する
function MonthlyCompare({ cities }) {
  const [selectedCityId, setSelectedCityId] = useState(null)
  const [metric, setMetric] = useState(MONTHLY_METRICS.AVG_MAX_TEMP)

  const selectedCity = cities.find((c) => c.id === selectedCityId) ?? null

  const currentYear = new Date().getFullYear()
  const years = useMemo(() => [currentYear, currentYear - 1, currentYear - 2], [currentYear])

  const { monthlyByYear, loading, errors, refresh } = useMonthlyWeather(selectedCity, years)

  const metricOption = MONTHLY_METRIC_OPTIONS.find((option) => option.value === metric)
  const rows = buildMonthlyComparisonRows(monthlyByYear, years)

  const thisYearMonthly = monthlyByYear[years[0]] ?? []
  const latestMonth = findLatestMonthWithData(thisYearMonthly)
  const latestRow = rows.find((row) => row.month === latestMonth)
  const latestValue = latestRow?.thisYearData?.[metric] ?? null
  const lastValueForLatest = latestRow?.lastYearData?.[metric] ?? null
  const twoYearsAgoValueForLatest = latestRow?.twoYearsAgoData?.[metric] ?? null
  const { yoyDiff, vs2yDiff } = calcMetricDiffs(latestValue, lastValueForLatest, twoYearsAgoValueForLatest)
  const highestMonth = findExtremeMonth(thisYearMonthly, metric, 'max')
  const lowestMonth = findExtremeMonth(thisYearMonthly, metric, 'min')

  const summary = { latestMonth, latestValue, yoyDiff, vs2yDiff, highestMonth, lowestMonth }

  return (
    <section className="monthly-compare">
      <div className="monthly-controls">
        <CitySelect cities={cities} selectedCityId={selectedCityId} onSelectCity={setSelectedCityId} />

        {selectedCity && (
          <button className="refresh-button" onClick={refresh} disabled={loading}>
            {loading ? 'Updating...' : '🔄 Refresh Monthly Data'}
          </button>
        )}
      </div>

      {!selectedCity && <p className="empty-state">Select a city to view monthly comparison.</p>}

      {selectedCity && (
        <>
          <MetricSwitch metric={metric} onChangeMetric={setMetric} />

          {loading && <p className="loading-text">Loading monthly data...</p>}
          {Object.keys(errors).length > 0 && (
            <p className="error-cell">⚠️ Failed to load data for some years.</p>
          )}

          <SummaryCard city={selectedCity} metricOption={metricOption} summary={summary} />
          <MonthlyChart rows={rows} metric={metric} metricOption={metricOption} years={years} />
          <MonthlyTable rows={rows} metric={metric} metricOption={metricOption} />
        </>
      )}
    </section>
  )
}

export default MonthlyCompare
