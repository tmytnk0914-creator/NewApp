import { MONTHLY_METRIC_OPTIONS } from '../../constants/monthlyMetrics'

// 表示指標(Avg Max Temp / Avg Min Temp / Rainy Days / Hot Days / Extreme Hot Days / Cold Days)の切り替え
function MetricSwitch({ metric, onChangeMetric }) {
  return (
    <div className="metric-switch">
      {MONTHLY_METRIC_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`metric-button ${metric === option.value ? 'active' : ''}`}
          onClick={() => onChangeMetric(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default MetricSwitch
