// 登録都市から1都市を選択するセレクター(region flag・都市名・region名を表示)
function CitySelect({ cities, selectedCityId, onSelectCity }) {
  return (
    <div className="city-select">
      <label htmlFor="monthly-city-select">City</label>
      <select
        id="monthly-city-select"
        value={selectedCityId ?? ''}
        onChange={(e) => onSelectCity(e.target.value || null)}
      >
        <option value="">Select a city...</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.flag} {city.displayName} / {city.regionName}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CitySelect
