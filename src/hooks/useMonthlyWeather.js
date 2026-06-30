import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchCityHistoricalWeather } from '../api/historicalApi'
import { enrichWeatherData } from '../utils/weatherUtils'
import { computeMonthlyStats } from '../utils/monthlyUtils'
import { getMonthlyCacheEntry, saveMonthlyCacheEntry } from '../utils/storage'
import { getTodayString, getDaysAgoString } from '../utils/dateUtils'

// Historical Weather APIは直近数日分のデータがまだ確定していないため、
// 今年分の終了日には安全マージンを設ける(今日の日付をそのまま渡すとAPIエラーになる)
const RECENT_DATA_BUFFER_DAYS = 5

// 選択中の1都市について、指定した年(複数)の月次データを取得・キャッシュ管理するフック
// 全都市の一括取得は行わず、Monthly Compare画面で都市が選択されたときだけ動作する
export function useMonthlyWeather(city, years) {
  const [monthlyByYear, setMonthlyByYear] = useState({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const loadYear = useCallback(async (targetCity, year, forceRefresh) => {
    const cached = !forceRefresh ? getMonthlyCacheEntry(targetCity.id, year) : null
    if (cached) {
      return cached.monthlyData
    }

    const today = getTodayString()
    const currentYear = Number(today.slice(0, 4))
    const startDate = `${year}-01-01`
    // 今年分は年末日がまだ来ていないため、確定済みの直近日(today - 安全マージン)を終了日にする
    const endDate = year >= currentYear ? getDaysAgoString(RECENT_DATA_BUFFER_DAYS) : `${year}-12-31`

    const rawData = await fetchCityHistoricalWeather(targetCity, startDate, endDate)
    const enrichedData = enrichWeatherData(rawData)
    const monthlyData = computeMonthlyStats(enrichedData, year)

    saveMonthlyCacheEntry(targetCity.id, year, {
      cityId: targetCity.id,
      year,
      fetchedAt: new Date().toISOString(),
      monthlyData,
    })

    return monthlyData
  }, [])

  const loadAllYears = useCallback(
    async (forceRefresh) => {
      if (!city) {
        setMonthlyByYear({})
        return
      }

      setLoading(true)
      const nextData = {}
      const nextErrors = {}

      await Promise.all(
        years.map(async (year) => {
          try {
            nextData[year] = await loadYear(city, year, forceRefresh)
          } catch (err) {
            nextErrors[year] = err.message
          }
        }),
      )

      setMonthlyByYear(nextData)
      setErrors(nextErrors)
      setLoading(false)
    },
    [city, years, loadYear],
  )

  // 都市または比較年が変わったときだけ自動取得する(都市未選択時は何もしない)
  const yearsKey = useMemo(() => years.join(','), [years])

  useEffect(() => {
    loadAllYears(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city?.id, yearsKey])

  return {
    monthlyByYear,
    loading,
    errors,
    refresh: () => loadAllYears(true),
  }
}
