import { useState } from 'react'
import { searchCities } from '../../api/geocodingApi'
import './CityManager.css'

// 都市の検索・追加・削除を行うモーダル
function CityManager({ cities, isFull, onAddCity, onRemoveCity, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [message, setMessage] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setSearching(true)
    setMessage('')
    try {
      const found = await searchCities(query)
      setResults(found)
      if (found.length === 0) setMessage('都市が見つかりませんでした。')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSearching(false)
    }
  }

  const handleAdd = (candidate) => {
    const result = onAddCity(candidate)
    setMessage(result.ok ? `${candidate.name} を追加しました。` : result.message)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>都市を管理</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <form className="city-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="都市名を入力 (例: Bangkok)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={searching || isFull}>
            {searching ? '検索中...' : '検索'}
          </button>
        </form>

        {isFull && <p className="warning-text">登録できる都市は最大30件です。</p>}
        {message && <p className="info-text">{message}</p>}

        {results.length > 0 && (
          <ul className="search-results">
            {results.map((candidate) => (
              <li key={candidate.id}>
                <span>
                  {candidate.flag} {candidate.displayName}{' '}
                  <span className="region-label">({candidate.regionName})</span>
                </span>
                <button onClick={() => handleAdd(candidate)} disabled={isFull}>
                  追加
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3>登録済み都市 ({cities.length}/30)</h3>
        <ul className="registered-cities">
          {cities.map((city) => (
            <li key={city.id}>
              <span>
                {city.flag} {city.displayName} <span className="region-label">({city.regionName})</span>
              </span>
              <button className="remove-button" onClick={() => onRemoveCity(city.id)}>
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CityManager
