import { useState, useEffect, useCallback } from 'react'
import { fetchCityHistoricalWeather } from '../api/historicalApi'
import { enrichWeatherData } from '../utils/weatherUtils'
import { getLastYearCacheEntry, saveLastYearCacheEntry } from '../utils/storage'

// 指定した昨年期間(lyStartDate〜lyEndDate)の天気データを全都市分取得・キャッシュするフック
// 昨年比較はON/OFFトグルなしで常時動作し、日付は外部から明示的に渡す
export function useLastYearWeather(cities, lyStartDate, lyEndDate) {
  const [lastYearByCity, setLastYearByCity] = useState({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const loadAll = useCallback(async () => {
    if (cities.length === 0 || !lyStartDate || !lyEndDate) {
      setLastYearByCity({})
      return
    }

    setLoading(true)
    const nextData = {}
    const nextErrors = {}

    await Promise.all(
      cities.map(async (city) => {
        const cached = getLastYearCacheEntry(city.id, lyStartDate, lyEndDate)
        if (cached) {
          nextData[city.id] = cached.weatherData
          return
        }

        try {
          const rawData = await fetchCityHistoricalWeather(city, lyStartDate, lyEndDate)
          const enrichedData = enrichWeatherData(rawData)
          saveLastYearCacheEntry(city.id, {
            cityId: city.id,
            dataType: 'lastYear',
            startDate: lyStartDate,
            endDate: lyEndDate,
            fetchedAt: new Date().toISOString(),
            weatherData: enrichedData,
          })
          nextData[city.id] = enrichedData
        } catch (err) {
          nextErrors[city.id] = err.message
        }
      }),
    )

    setLastYearByCity(nextData)
    setErrors(nextErrors)
    setLoading(false)
  }, [cities, lyStartDate, lyEndDate])

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities.map((c) => c.id).join(','), lyStartDate, lyEndDate])

  return { lastYearByCity, loading, errors }
}
