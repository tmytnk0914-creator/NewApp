import { MAX_CITIES } from '../../hooks/useCities'
import './Controls.css'

// 概要画面のコントロールバー: 登録都市数と都市管理ボタン
function Controls({ cityCount, onOpenManager }) {
  return (
    <div className="controls">
      <span className="city-count">{cityCount} / {MAX_CITIES} 都市</span>
      <button className="manage-button" onClick={onOpenManager}>
        ➕ 都市を管理
      </button>
    </div>
  )
}

export default Controls
