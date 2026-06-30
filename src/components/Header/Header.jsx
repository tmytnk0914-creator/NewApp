import { formatTimestamp } from '../../utils/dateUtils'
import './Header.css'

// アプリ上部のヘッダー(タイトル・最終更新時刻・更新ボタン)
function Header({ lastUpdated, loading, onRefresh }) {
  return (
    <header className="header">
      <div className="header-title">
        <h1>🌤️ Weather Demand Dashboard</h1>
        <p className="header-subtitle">Weather &amp; temperature overview for retail planning</p>
      </div>

      <div className="header-actions">
        <span className="header-updated">Last updated: {formatTimestamp(lastUpdated)}</span>
        <button className="refresh-button" onClick={onRefresh} disabled={loading}>
          {loading ? 'Updating...' : '🔄 Refresh'}
        </button>
      </div>
    </header>
  )
}

export default Header
