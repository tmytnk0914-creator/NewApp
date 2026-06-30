// 表示期間の種類(過去7日 / 未来7日 / 両方)
export const PERIODS = {
  PAST: 'past',
  FORECAST: 'forecast',
  BOTH: 'both',
}

export const PERIOD_OPTIONS = [
  { value: PERIODS.PAST, label: 'Past 7 Days' },
  { value: PERIODS.FORECAST, label: 'Next 7 Days' },
  { value: PERIODS.BOTH, label: 'Both' },
]
