import { PERIOD_OPTIONS } from '../../constants/periods'
import { MAX_CITIES } from '../../hooks/useCities'
import './Controls.css'

// 表示期間の切り替え・昨年比較トグル・都市管理ボタンを配置するエリア
function Controls({ period, onChangePeriod, onOpenManager, cityCount, compareLastYear, onToggleCompareLastYear }) {
  return (
    <div className="controls">
      <div className="period-switch">
        {PERIOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`period-button ${period === option.value ? 'active' : ''}`}
            onClick={() => onChangePeriod(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className="compare-toggle">
        <input
          type="checkbox"
          checked={compareLastYear}
          onChange={(e) => onToggleCompareLastYear(e.target.checked)}
        />
        Compare with Last Year
      </label>

      <div className="city-count">
        {cityCount} / {MAX_CITIES} cities
      </div>

      <button className="manage-button" onClick={onOpenManager}>
        ➕ Manage Cities
      </button>
    </div>
  )
}

export default Controls
