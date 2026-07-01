import { getTodayInTimezone } from '../utils/dateUtils'

const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast'
// カレンダーで最大2ヶ月前までの日付を選択できるよう、過去60日分を取得する
const PAST_DAYS = 60
const FORECAST_DAYS = 7

// 都市の過去60日+未来7日分の天気データを取得する(Open-Meteo Forecast API)
// past_days=60でカレンダー2ヶ月分をカバーし、アプリ側で選択した7日間を切り出す
export async function fetchCityWeather(city) {
  const params = new URLSearchParams({
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone || 'auto',
    past_days: String(PAST_DAYS),
    forecast_days: String(FORECAST_DAYS),
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_sum'].join(','),
  })

  const response = await fetch(`${FORECAST_BASE_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`天気データの取得に失敗しました (${city.name})`)
  }

  const data = await response.json()
  return parseDailyWeather(city, data.daily)
}

// Open-MeteoのレスポンスをdailyWeather配列に変換する
// 都市のローカル日付を基準に、今日より前を'past'、今日以降を'forecast'として分類する
function parseDailyWeather(city, daily) {
  if (!daily || !daily.time) return []

  const today = getTodayInTimezone(city.timezone)

  return daily.time.map((date, index) => ({
    cityId: city.id,
    date,
    source: date < today ? 'past' : 'forecast',
    weatherCode: daily.weather_code[index],
    maxTemp: daily.temperature_2m_max[index],
    minTemp: daily.temperature_2m_min[index],
    precipitationSum: daily.precipitation_sum[index],
  }))
}
