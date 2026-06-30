import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchCityWeather } from '../api/forecastApi'
import { enrichWeatherData } from '../utils/weatherUtils'
import {
  getWeatherCacheEntry,
  saveWeatherCacheEntry,
  saveLastUpdated,
  loadLastUpdated,
} from '../utils/storage'
import { getTodayString } from '../utils/dateUtils'

// 都市ごとの天気データ取得・キャッシュ管理を行うフック
// 同じ日に取得済みのデータはキャッシュを再利用し、無駄なAPI呼び出しを避ける
export function useWeatherData(cities) {
  const [weatherByCity, setWeatherByCity] = useState({})
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(() => loadLastUpdated())
  const [errors, setErrors] = useState({})

  const loadCityWeather = useCallback(async (city, forceRefresh) => {
    const today = getTodayString()
    const cached = getWeatherCacheEntry(city.id)

    // 同じ日に取得済みのキャッシュがあれば、強制更新でない限り再利用する
    if (!forceRefresh && cached && cached.fetchedAt?.slice(0, 10) === today) {
      return cached.weatherData
    }

    const rawData = await fetchCityWeather(city)
    const enrichedData = enrichWeatherData(rawData)

    const entry = {
      cityId: city.id,
      dataType: 'combined',
      startDate: enrichedData[0]?.date ?? today,
      endDate: enrichedData[enrichedData.length - 1]?.date ?? today,
      fetchedAt: new Date().toISOString(),
      weatherData: enrichedData,
    }
    saveWeatherCacheEntry(city.id, entry)

    return enrichedData
  }, [])

  const refreshAll = useCallback(
    async (forceRefresh) => {
      if (cities.length === 0) {
        setWeatherByCity({})
        return
      }

      setLoading(true)
      const nextWeatherByCity = {}
      const nextErrors = {}

      // 都市ごとに並列で取得する
      const results = await Promise.allSettled(
        cities.map((city) => loadCityWeather(city, forceRefresh)),
      )

      results.forEach((result, index) => {
        const city = cities[index]
        if (result.status === 'fulfilled') {
          nextWeatherByCity[city.id] = result.value
        } else {
          nextErrors[city.id] = result.reason?.message ?? '取得エラー'
        }
      })

      setWeatherByCity(nextWeatherByCity)
      setErrors(nextErrors)
      setLoading(false)

      const now = new Date().toISOString()
      setLastUpdated(now)
      saveLastUpdated(now)
    },
    [cities, loadCityWeather],
  )

  // 都市一覧の構成が変わったタイミングで自動取得する(新規追加都市など)
  const cityIdsKey = useMemo(() => cities.map((c) => c.id).join(','), [cities])

  useEffect(() => {
    refreshAll(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIdsKey])

  return {
    weatherByCity,
    loading,
    lastUpdated,
    errors,
    refresh: () => refreshAll(true),
  }
}
