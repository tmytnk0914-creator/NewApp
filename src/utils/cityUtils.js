import { REGION_GROUPS } from '../constants/regionGroups'

// 都市を地域グループ別にグループ化し、グループ順に並べて返す
export function groupCitiesByRegion(cities) {
  const result = []

  REGION_GROUPS.forEach((group) => {
    const groupCities = cities.filter((city) => group.regionCodes.includes(city.regionCode))
    if (groupCities.length > 0) {
      result.push({ ...group, cities: groupCities })
    }
  })

  // どのグループにも属さない都市は「その他」にまとめる
  const knownCodes = new Set(REGION_GROUPS.flatMap((g) => g.regionCodes))
  const others = cities.filter((city) => !knownCodes.has(city.regionCode))
  if (others.length > 0) {
    result.push({ id: 'other', label: 'その他', cities: others })
  }

  return result
}
