import { getWeatherInfo } from '../constants/weatherCodes'

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
  return Math.round((sum / values.length) * 10) / 10
}
