import { useState, useEffect } from 'react'
import { fetchCityHistoricalWeather } from '../api/historicalApi'
import { enrichWeatherData } from '../utils/weatherUtils'
import { shiftYear } from '../utils/dateUtils'
import { getLastYearCacheEntry, saveLastYearCacheEntry } from '../utils/storage'

// 昨年同期間の天気データ取得・キャッシュ管理を行うフック
// compareLastYearがOFFのときは何もしない(不要なAPIリクエストを避ける)
export function useLastYearWeather(cities, weatherByCity, compareLastYear) {
  const [lastYearByCity, setLastYearByCity] = useState({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!compareLastYear) {
      return
    }

    let cancelled = false

    async function loadAll() {
      setLoading(true)
      const nextData = {}
      const nextErrors = {}

      await Promise.all(
        cities.map(async (city) => {
          const currentDays = weatherByCity[city.id]
          if (!currentDays || currentDays.length === 0) return

          // 今年の表示期間(過去7日+未来7日)の開始日・終了日をそれぞれ1年前にずらす
          const startDate = shiftYear(currentDays[0].date, -1)
          const endDate = shiftYear(currentDays[currentDays.length - 1].date, -1)

          const cached = getLastYearCacheEntry(city.id, startDate, endDate)
          if (cached) {
            nextData[city.id] = cached.weatherData
            return
          }

          try {
            const rawData = await fetchCityHistoricalWeather(city, startDate, endDate)
            const enrichedData = enrichWeatherData(rawData)

            saveLastYearCacheEntry(city.id, {
              cityId: city.id,
              dataType: 'lastYear',
              startDate,
              endDate,
              fetchedAt: new Date().toISOString(),
              weatherData: enrichedData,
            })

            nextData[city.id] = enrichedData
          } catch (err) {
            nextErrors[city.id] = err.message
          }
        }),
      )

      if (!cancelled) {
        setLastYearByCity(nextData)
        setErrors(nextErrors)
        setLoading(false)
      }
    }

    loadAll()

    return () => {
      cancelled = true
    }
  }, [compareLastYear, cities, weatherByCity])

  return { lastYearByCity, loading, errors }
}
