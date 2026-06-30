import { useState } from 'react'
import Header from './components/Header/Header'
import Controls from './components/Controls/Controls'
import CityOverview from './components/CityOverview/CityOverview'
import CityDetail from './components/CityDetail/CityDetail'
import CityManager from './components/CityManager/CityManager'
import { useCities } from './hooks/useCities'
import { useWeatherData } from './hooks/useWeatherData'
import { useLastYearWeather } from './hooks/useLastYearWeather'
import { filterByPeriod } from './utils/weatherUtils'
import { PERIODS } from './constants/periods'
import './App.css'

// アプリ全体のレイアウトと状態管理を行うルートコンポーネント
function App() {
  const { cities, addCity, removeCity, isFull } = useCities()
  const { weatherByCity, loading, lastUpdated, errors, refresh } = useWeatherData(cities)

  const [period, setPeriod] = useState(PERIODS.FORECAST)
  const [selectedCityId, setSelectedCityId] = useState(null)
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  // Phase 2: 昨年比較(初期値OFF。ONのときだけ昨年データを取得する)
  const [compareLastYear, setCompareLastYear] = useState(false)

  const {
    lastYearByCity,
    loading: lastYearLoading,
  } = useLastYearWeather(cities, weatherByCity, compareLastYear)

  const selectedCity = cities.find((c) => c.id === selectedCityId) ?? null
  // 詳細エリアでは期間スイッチの選択にかかわらず全データ(過去+未来)を保持し、
  // グラフ/テーブル側で表示期間に応じたフィルタリングを行う
  const selectedCityWeather = selectedCityId
    ? filterByPeriod(weatherByCity[selectedCityId] ?? [], PERIODS.BOTH)
    : []
  const selectedCityLastYearWeather = selectedCityId ? lastYearByCity[selectedCityId] ?? [] : []

  const handleSelectCity = (cityId) => {
    setSelectedCityId((prev) => (prev === cityId ? null : cityId))
  }

  const handleRemoveCity = (cityId) => {
    removeCity(cityId)
    if (selectedCityId === cityId) setSelectedCityId(null)
  }

  return (
    <div className="app">
      <Header lastUpdated={lastUpdated} loading={loading} onRefresh={refresh} />

      <Controls
        period={period}
        onChangePeriod={setPeriod}
        onOpenManager={() => setIsManagerOpen(true)}
        cityCount={cities.length}
        compareLastYear={compareLastYear}
        onToggleCompareLastYear={setCompareLastYear}
      />

      <main className="app-main">
        <CityOverview
          cities={cities}
          weatherByCity={weatherByCity}
          errors={errors}
          period={period}
          selectedCityId={selectedCityId}
          onSelectCity={handleSelectCity}
          loading={loading}
          compareLastYear={compareLastYear}
          lastYearByCity={lastYearByCity}
          lastYearLoading={lastYearLoading}
        />

        {selectedCity && (
          <CityDetail
            city={selectedCity}
            weatherData={selectedCityWeather}
            lastYearData={selectedCityLastYearWeather}
            period={period}
            compareLastYear={compareLastYear}
          />
        )}
      </main>

      {isManagerOpen && (
        <CityManager
          cities={cities}
          isFull={isFull}
          onAddCity={addCity}
          onRemoveCity={handleRemoveCity}
          onClose={() => setIsManagerOpen(false)}
        />
      )}
    </div>
  )
}

export default App
