// Monthly Compare画面で切り替え可能な表示指標
export const MONTHLY_METRICS = {
  AVG_MAX_TEMP: 'avgMaxTemp',
  AVG_MIN_TEMP: 'avgMinTemp',
  RAINY_DAYS: 'rainyDays',
  HOT_DAYS: 'hotDays',
  EXTREME_HOT_DAYS: 'extremeHotDays',
  COLD_DAYS: 'coldDays',
}

export const MONTHLY_METRIC_OPTIONS = [
  { value: MONTHLY_METRICS.AVG_MAX_TEMP, label: 'Avg Max Temp', unit: '℃' },
  { value: MONTHLY_METRICS.AVG_MIN_TEMP, label: 'Avg Min Temp', unit: '℃' },
  { value: MONTHLY_METRICS.RAINY_DAYS, label: 'Rainy Days', unit: 'days' },
  { value: MONTHLY_METRICS.HOT_DAYS, label: 'Hot Days', unit: 'days' },
  { value: MONTHLY_METRICS.EXTREME_HOT_DAYS, label: 'Extreme Hot Days', unit: 'days' },
  { value: MONTHLY_METRICS.COLD_DAYS, label: 'Cold Days', unit: 'days' },
]

export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
