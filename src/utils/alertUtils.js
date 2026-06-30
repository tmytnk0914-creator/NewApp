// ルールベースのアラート判定(数値の閾値のみで判定し、AIによる主観判断は行わない)
const THRESHOLDS = {
  EXTREME_HEAT: 35,
  HOT: 30,
  COLD: 15,
  RAIN_RISK_MM: 5,
}

// 代表日の最高気温と期間内の降水量からアラートバッジを生成する
export function getAlerts(representativeDay, periodData) {
  const alerts = []
  if (!representativeDay) return alerts

  const maxTemp = representativeDay.maxTemp

  if (maxTemp >= THRESHOLDS.EXTREME_HEAT) {
    alerts.push({ key: 'extreme-heat', icon: '🥵', label: 'Extreme Heat' })
  } else if (maxTemp >= THRESHOLDS.HOT) {
    alerts.push({ key: 'hot', icon: '🔥', label: 'Hot' })
  } else if (maxTemp <= THRESHOLDS.COLD) {
    alerts.push({ key: 'cold', icon: '❄️', label: 'Cold' })
  }

  const hasRainRisk = periodData.some((d) => (d.precipitationSum ?? 0) >= THRESHOLDS.RAIN_RISK_MM)
  if (hasRainRisk) {
    alerts.push({ key: 'rain-risk', icon: '🌧️', label: 'Rain Risk' })
  }

  return alerts
}
