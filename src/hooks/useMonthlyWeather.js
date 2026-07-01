import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchCityHistoricalWeather } from '../api/historicalApi'
import { enrichWeatherData } from '../utils/weatherUtils'
import { computeMonthlyStats } from '../utils/monthlyUtils'
import { getMonthlyCacheEntry, saveMonthlyCacheEntry } from '../utils/storage'
import { getTodayString, getDaysAgoString } from '../utils/dateUtils'

const RECENT_DATA_BUFFER_DAYS = 5

// 複数都市について、指定した年(複数)の月次データを取得・キャッシュ管理するフック
// Monthly Compare画面で全登録都市を一括表示するために使用する
export function useMonthlyWeather(cities, years) {
  const [monthlyByCityYear, setMonthlyByCityYear] = useState({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const loadCityYear = useCallback(async (city, year, forceRefresh) => {
    const cached = !forceRefresh ? getMonthlyCacheEntry(city.id, year) : null
    if (cached) return cached.monthlyData

    const today = getTodayString()
    const currentYear = Number(today.slice(0, 4))
    const startDate = `${year}-01-01`
    const endDate = year >= currentYear ? getDaysAgoString(RECENT_DATA_BUFFER_DAYS) : `${year}-12-31`

    const rawData = await fetchCityHistoricalWeather(city, startDate, endDate)
    const enrichedData = enrichWeatherData(rawData)
    const monthlyData = computeMonthlyStats(enrichedData, year)

    saveMonthlyCacheEntry(city.id, year, {
      cityId: city.id,
      year,
      fetchedAt: new Date().toISOString(),
      monthlyData,
    })

    return monthlyData
  }, [])

  const loadAll = useCallback(
    async (forceRefresh) => {
      if (cities.length === 0) {
        setMonthlyByCityYear({})
        return
      }

      setLoading(true)
      const nextData = {}
      const nextErrors = {}

      // 都市×年の組み合わせを並列で取得する
      await Promise.all(
        cities.flatMap((city) =>
          years.map(async (year) => {
            const key = `${city.id}_${year}`
            try {
              const data = await loadCityYear(city, year, forceRefresh)
              nextData[key] = data
            } catch (err) {
              nextErrors[key] = err.message
            }
          }),
        ),
      )

      setMonthlyByCityYear(nextData)
      setErrors(nextErrors)
      setLoading(false)
    },
    [cities, years, loadCityYear],
  )

  const cityIdsKey = useMemo(() => cities.map((c) => c.id).join(','), [cities])
  const yearsKey = useMemo(() => years.join(','), [years])

  useEffect(() => {
    loadAll(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIdsKey, yearsKey])

  // 特定の都市・年のデータを取得するヘルパー
  const getMonthlyData = useCallback(
    (cityId, year) => monthlyByCityYear[`${cityId}_${year}`] ?? [],
    [monthlyByCityYear],
  )

  return {
    monthlyByCityYear,
    getMonthlyData,
    loading,
    errors,
    refresh: () => loadAll(true),
  }
}
