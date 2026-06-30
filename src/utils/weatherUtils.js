import { getWeatherInfo } from '../constants/weatherCodes'
import { shiftYear } from './dateUtils'

// dailyWeather配列に表示用のアイコン・ラベルを付与する
export function enrichWeatherData(dailyList) {
  return dailyList.map((day) => {
    const { icon, label } = getWeatherInfo(day.weatherCode)
    return { ...day, weatherIcon: icon, weatherLabel: label }
  })
}

// 表示期間でデータを絞り込む ('past' | 'forecast' | 'both')
export function filterByPeriod(dailyList, period) {
  if (period === 'both') return dailyList
  return dailyList.filter((day) => day.source === period)
}

// 代表日(今日/未来日の先頭、なければ直近の過去日)を取得する
// 都市一覧の天気アイコン・最高/最低気温の表示に使う
export function getRepresentativeDay(dailyList) {
  if (dailyList.length === 0) return null
  const forecastDays = dailyList.filter((d) => d.source === 'forecast')
  if (forecastDays.length > 0) return forecastDays[0]
  return dailyList[dailyList.length - 1]
}

// 表示中の期間データから集計値(平均最高/最低気温・降水日数)を算出する
export function summarizeWeather(dailyList) {
  if (dailyList.length === 0) {
    return { avgMaxTemp: null, avgMinTemp: null, rainyDays: 0 }
  }

  const maxTemps = dailyList.map((d) => d.maxTemp).filter((v) => v !== null && v !== undefined)
  const minTemps = dailyList.map((d) => d.minTemp).filter((v) => v !== null && v !== undefined)
  const rainyDays = dailyList.filter((d) => (d.precipitationSum ?? 0) >= 5).length

  return {
    avgMaxTemp: average(maxTemps),
    avgMinTemp: average(minTemps),
    rainyDays,
  }
}

function average(values) {
  if (values.length === 0) return null
  const sum = values.reduce((acc, v) => acc + v, 0)
  return round1(sum / values.length)
}

// 小数第1位に丸める
export function round1(value) {
  return Math.round(value * 10) / 10
}

// 今年の日別データに、対応する昨年同日のデータを付与する(dayの日付を1年戻した日付で照合する)
export function pairWithLastYear(currentDays, lastYearDays) {
  const lastYearMap = new Map((lastYearDays ?? []).map((d) => [d.date, d]))
  return currentDays.map((day) => {
    const lastYearDate = shiftYear(day.date, -1)
    return { ...day, lastYear: lastYearMap.get(lastYearDate) ?? null }
  })
}

// 表示期間の平均最高/最低気温について、前年同期間との差分を算出する
// 計算式: 今年の表示期間の平均気温 - 昨年同期間の平均気温(ペアリングできた日のみ対象)
export function summarizeYoy(periodDays, lastYearDays) {
  if (!lastYearDays || lastYearDays.length === 0 || periodDays.length === 0) {
    return { maxDiff: null, minDiff: null }
  }

  const paired = pairWithLastYear(periodDays, lastYearDays).filter((d) => d.lastYear)
  if (paired.length === 0) {
    return { maxDiff: null, minDiff: null }
  }

  const thisYearMax = average(paired.map((d) => d.maxTemp))
  const thisYearMin = average(paired.map((d) => d.minTemp))
  const lastYearMax = average(paired.map((d) => d.lastYear.maxTemp))
  const lastYearMin = average(paired.map((d) => d.lastYear.minTemp))

  return {
    maxDiff: thisYearMax !== null && lastYearMax !== null ? round1(thisYearMax - lastYearMax) : null,
    minDiff: thisYearMin !== null && lastYearMin !== null ? round1(thisYearMin - lastYearMin) : null,
  }
}
