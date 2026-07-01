import { formatTimestamp } from '../../utils/dateUtils'
import './Header.css'

// ヘッダー: タイトル・最終更新時刻・更新ボタン
function Header({ lastUpdated, loading, onRefresh }) {
  return (
    <header className="header">
      <div className="header-title">
        <h1>🌤️ Weather Demand Dashboard</h1>
        <p className="header-subtitle">天気・気温データで販売影響を把握するためのツール</p>
      </div>

      <div className="header-actions">
        <span className="header-updated">最終更新: {formatTimestamp(lastUpdated)}</span>
        <button className="refresh-button" onClick={onRefresh} disabled={loading}>
          {loading ? '取得中...' : '🔄 更新'}
        </button>
      </div>
    </header>
  )
}

export default Header
