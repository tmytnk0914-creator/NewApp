const ARCHIVE_BASE_URL = 'https://archive-api.open-meteo.com/v1/archive'

// 都市の指定期間(昨年同期間)の実績天気データを取得する(Open-Meteo Historical Weather API)
export async function fetchCityHistoricalWeather(city, startDate, endDate) {
  const params = new URLSearchParams({
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone || 'auto',
    start_date: startDate,
    end_date: endDate,
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_sum'].join(','),
  })

  const response = await fetch(`${ARCHIVE_BASE_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`昨年データの取得に失敗しました (${city.name})`)
  }

  const data = await response.json()
  return parseDailyWeather(city.id, data.daily)
}

// Open-MeteoのレスポンスをdailyWeather配列(source: 'lastYear')に変換する
function parseDailyWeather(cityId, daily) {
  if (!daily || !daily.time) return []

  return daily.time.map((date, index) => ({
    cityId,
    date,
    source: 'lastYear',
    weatherCode: daily.weather_code[index],
    maxTemp: daily.temperature_2m_max[index],
    minTemp: daily.temperature_2m_min[index],
    precipitationSum: daily.precipitation_sum[index],
  }))
}
