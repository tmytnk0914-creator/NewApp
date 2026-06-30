import { round1 } from './weatherUtils'

// 日別データ配列(1年分)を月ごとに集計し、monthlyWeather配列(1月〜12月)を返す
export function computeMonthlyStats(dailyList, year) {
  const monthGroups = Array.from({ length: 12 }, () => [])

  dailyList.forEach((day) => {
    const month = Number(day.date.slice(5, 7))
    monthGroups[month - 1].push(day)
  })

  return monthGroups.map((days, index) => {
    const month = index + 1

    if (days.length === 0) {
      return {
        cityId: dailyList[0]?.cityId,
        year,
        month,
        avgMaxTemp: null,
        avgMinTemp: null,
        rainyDays: 0,
        hotDays: 0,
        extremeHotDays: 0,
        coldDays: 0,
      }
    }

    const maxTemps = days.map((d) => d.maxTemp).filter((v) => v !== null && v !== undefined)
    const minTemps = days.map((d) => d.minTemp).filter((v) => v !== null && v !== undefined)

    return {
      cityId: days[0].cityId,
      year,
      month,
      avgMaxTemp: average(maxTemps),
      avgMinTemp: average(minTemps),
      rainyDays: days.filter((d) => (d.precipitationSum ?? 0) >= 5).length,
      hotDays: days.filter((d) => d.maxTemp !== null && d.maxTemp !== undefined && d.maxTemp >= 30).length,
      extremeHotDays: days.filter((d) => d.maxTemp !== null && d.maxTemp !== undefined && d.maxTemp >= 35).length,
      coldDays: days.filter((d) => d.maxTemp !== null && d.maxTemp !== undefined && d.maxTemp <= 15).length,
    }
  })
}

function average(values) {
  if (values.length === 0) return null
  const sum = values.reduce((acc, v) => acc + v, 0)
  return round1(sum / values.length)
}

// 月別比較行(This Year / Last Year / 2 Years Ago)を組み立てる
export function buildMonthlyComparisonRows(monthlyByYear, years) {
  const [thisYear, lastYear, twoYearsAgo] = years

  return Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    thisYearData: monthlyByYear[thisYear]?.[index] ?? null,
    lastYearData: monthlyByYear[lastYear]?.[index] ?? null,
    twoYearsAgoData: monthlyByYear[twoYearsAgo]?.[index] ?? null,
  }))
}

// YoY差分(This Year - Last Year)と対2年平均差分(This Year - (Last Year + 2 Years Ago) / 2)を算出する
export function calcMetricDiffs(thisValue, lastValue, twoYearsAgoValue) {
  const yoyDiff = thisValue !== null && lastValue !== null ? round1(thisValue - lastValue) : null

  const has2yAvg = lastValue !== null && twoYearsAgoValue !== null
  const vs2yDiff = thisValue !== null && has2yAvg ? round1(thisValue - (lastValue + twoYearsAgoValue) / 2) : null

  return { yoyDiff, vs2yDiff }
}

// 今年のデータが存在する最新月(月番号 1-12)を取得する
export function findLatestMonthWithData(thisYearMonthly) {
  for (let i = thisYearMonthly.length - 1; i >= 0; i -= 1) {
    const m = thisYearMonthly[i]
    if (m && m.avgMaxTemp !== null) return m.month
  }
  return null
}

// 今年の月次データから、指定した指標が最大/最小となる月(月番号)を取得する
export function findExtremeMonth(thisYearMonthly, metricKey, mode) {
  let result = null

  thisYearMonthly.forEach((m) => {
    if (!m || m[metricKey] === null || m[metricKey] === undefined) return
    if (result === null) {
      result = m
      return
    }
    if (mode === 'max' && m[metricKey] > result[metricKey]) result = m
    if (mode === 'min' && m[metricKey] < result[metricKey]) result = m
  })

  return result ? result.month : null
}
