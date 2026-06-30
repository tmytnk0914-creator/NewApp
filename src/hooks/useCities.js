import { useState, useEffect, useCallback } from 'react'
import { INITIAL_CITIES } from '../constants/initialCities'
import { loadCities, saveCities, removeWeatherCacheEntry } from '../utils/storage'

export const MAX_CITIES = 30

// 都市一覧の状態管理(追加・削除・localStorage同期)を行うフック
export function useCities() {
  const [cities, setCities] = useState(() => loadCities() ?? INITIAL_CITIES)

  useEffect(() => {
    saveCities(cities)
  }, [cities])

  const addCity = useCallback((newCity) => {
    let result = { ok: false, message: '' }

    setCities((prev) => {
      if (prev.length >= MAX_CITIES) {
        result = { ok: false, message: `都市は最大${MAX_CITIES}件まで登録できます` }
        return prev
      }
      if (prev.some((c) => c.id === newCity.id)) {
        result = { ok: false, message: 'この都市は既に登録されています' }
        return prev
      }

      result = { ok: true, message: '' }
      const nextSortOrder = prev.length > 0 ? Math.max(...prev.map((c) => c.sortOrder)) + 1 : 1
      return [...prev, { ...newCity, sortOrder: nextSortOrder }]
    })

    return result
  }, [])

  const removeCity = useCallback((cityId) => {
    setCities((prev) => prev.filter((c) => c.id !== cityId))
    removeWeatherCacheEntry(cityId)
  }, [])

  return { cities, addCity, removeCity, isFull: cities.length >= MAX_CITIES }
}
