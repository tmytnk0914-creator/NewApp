// localStorageへの読み書きをまとめたユーティリティ
const CITIES_KEY = 'weatherDashboard_cities_v1'
const CACHE_KEY = 'weatherDashboard_weatherCache_v1'
const LAST_UPDATED_KEY = 'weatherDashboard_lastUpdated_v1'
const LAST_YEAR_CACHE_KEY = 'weatherDashboard_lastYearCache_v1'

// ===== 都市一覧の保存・読み込み =====
export function loadCities() {
  try {
    const raw = localStorage.getItem(CITIES_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveCities(cities) {
  localStorage.setItem(CITIES_KEY, JSON.stringify(cities))
}

// ===== 天気データキャッシュの保存・読み込み =====
// 都市IDをキーにしたオブジェクトとしてキャッシュ全体を保存する
export function loadWeatherCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveWeatherCacheEntry(cityId, entry) {
  const cache = loadWeatherCache()
  cache[cityId] = entry
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

export function getWeatherCacheEntry(cityId) {
  const cache = loadWeatherCache()
  return cache[cityId] ?? null
}

export function removeWeatherCacheEntry(cityId) {
  const cache = loadWeatherCache()
  delete cache[cityId]
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

// ===== 最終更新時刻 =====
export function loadLastUpdated() {
  return localStorage.getItem(LAST_UPDATED_KEY)
}

export function saveLastUpdated(isoString) {
  localStorage.setItem(LAST_UPDATED_KEY, isoString)
}

// ===== 昨年同期間データキャッシュ(Phase 2: 昨年比較機能) =====
// 都市IDをキーにしたオブジェクトとしてキャッシュ全体を保存する
// 過去の確定データのため、同じ都市・同じ期間であれば再取得しない
export function loadLastYearCache() {
  try {
    const raw = localStorage.getItem(LAST_YEAR_CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveLastYearCacheEntry(cityId, entry) {
  const cache = loadLastYearCache()
  cache[cityId] = entry
  localStorage.setItem(LAST_YEAR_CACHE_KEY, JSON.stringify(cache))
}

// 都市ID・期間が一致するキャッシュがあれば返す(期間が変わっていれば再取得が必要なのでnull)
export function getLastYearCacheEntry(cityId, startDate, endDate) {
  const cache = loadLastYearCache()
  const entry = cache[cityId]
  if (!entry || entry.startDate !== startDate || entry.endDate !== endDate) return null
  return entry
}

export function removeLastYearCacheEntry(cityId) {
  const cache = loadLastYearCache()
  delete cache[cityId]
  localStorage.setItem(LAST_YEAR_CACHE_KEY, JSON.stringify(cache))
}
