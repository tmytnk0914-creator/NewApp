// ルールベースのアラート判定(数値の閾値のみで判定し、AIによる主観判断は行わない)
const THRESHOLDS = {
  EXTREME_HEAT: 35,
  HOT: 30,
  COLD: 15,
  RAIN_RISK_MM: 5,
  YOY_WARMER: 3,
  YOY_COOLER: -3,
}

// 代表日の最高気温・期間内の降水量・前年差分からアラートバッジを生成する
// yoySummaryは昨年比較ONのときのみ渡される({ maxDiff, minDiff })
export function getAlerts(representativeDay, periodData, yoySummary = null) {
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

  if (yoySummary && yoySummary.maxDiff !== null) {
    if (yoySummary.maxDiff >= THRESHOLDS.YOY_WARMER) {
      alerts.push({ key: 'yoy-warmer', icon: '📈', label: 'Warmer YoY' })
    } else if (yoySummary.maxDiff <= THRESHOLDS.YOY_COOLER) {
      alerts.push({ key: 'yoy-cooler', icon: '📉', label: 'Cooler YoY' })
    }
  }

  return alerts
}
