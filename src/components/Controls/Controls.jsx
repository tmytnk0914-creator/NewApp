import { PERIOD_OPTIONS } from '../../constants/periods'
import { MAX_CITIES } from '../../hooks/useCities'
import './Controls.css'

// 表示期間の切り替えと都市管理ボタンを配置するエリア
function Controls({ period, onChangePeriod, onOpenManager, cityCount }) {
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
