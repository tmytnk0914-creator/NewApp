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
      if (found.length === 0) setMessage('No cities found.')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSearching(false)
    }
  }

  const handleAdd = (candidate) => {
    const result = onAddCity(candidate)
    setMessage(result.ok ? `${candidate.name} added.` : result.message)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Cities</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="city-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search city name (e.g. Bangkok)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={searching || isFull}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {isFull && <p className="warning-text">Maximum of 30 cities reached.</p>}
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
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3>Registered Cities ({cities.length}/30)</h3>
        <ul className="registered-cities">
          {cities.map((city) => (
            <li key={city.id}>
              <span>
                {city.flag} {city.displayName} <span className="region-label">({city.regionName})</span>
              </span>
              <button className="remove-button" onClick={() => onRemoveCity(city.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CityManager
