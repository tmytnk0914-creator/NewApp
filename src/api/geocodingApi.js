import { codeToFlag, normalizeRegionName } from '../utils/regionUtils'

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search'

// 都市名から候補地を検索する(Open-Meteo Geocoding API)
export async function searchCities(query) {
  if (!query || query.trim().length === 0) return []

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('都市検索に失敗しました')
  }

  const data = await response.json()
  const results = data.results ?? []

  return results.map((result) => {
    const regionCode = result.country_code ?? ''
    const regionName = normalizeRegionName(regionCode, result.country ?? 'Unknown')

    return {
      // ジオコーディングAPIのidと地域コードを組み合わせて一意なIDを生成する
      id: `${slugify(result.name)}-${regionCode.toLowerCase()}-${result.id}`,
      name: result.name,
      displayName: result.admin1 ? `${result.name}, ${result.admin1}` : result.name,
      regionName,
      regionCode,
      flag: codeToFlag(regionCode),
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
    }
  })
}

// 都市名をID用のスラッグに変換する
// NFD正規化でアクセント記号を分離した後、ASCII以外の文字をまとめて除去する
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
