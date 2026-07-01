import { useState } from 'react'
import Header from './components/Header/Header'
import Navigation from './components/Navigation/Navigation'
import Controls from './components/Controls/Controls'
import CityOverview from './components/CityOverview/CityOverview'
import CityDetail from './components/CityDetail/CityDetail'
import CityManager from './components/CityManager/CityManager'
import MonthlyCompare from './components/MonthlyCompare/MonthlyCompare'
import { useCities } from './hooks/useCities'
import { useWeatherData } from './hooks/useWeatherData'
import { useLastYearWeather } from './hooks/useLastYearWeather'
import { addDays, getWeekDates, getTodayString, shiftYear } from './utils/dateUtils'
import { SCREENS } from './constants/screens'
import './App.css'

// デフォルト: 今日を7日間ウィンドウの最後の日として表示期間の開始日を設定する
function getDefaultWindowStart() {
  return addDays(getTodayString(), -6)
}

function App() {
  const [screen, setScreen] = useState(SCREENS.OVERVIEW)

  const { cities, addCity, removeCity, isFull } = useCities()
  const { weatherByCity, loading, lastUpdated, errors, refresh } = useWeatherData(cities)

  // 表示期間の開始日(カレンダーでクリック選択)
  const [windowStartDate, setWindowStartDate] = useState(getDefaultWindowStart)
  // 昨年比較の日付オフセット(0=デフォルト, ±N=曜日調整)
  const [lyOffset, setLyOffset] = useState(0)

  const windowDates = getWeekDates(windowStartDate)
  const windowEndDate = windowDates[6]

  // 昨年比較期間: windowStartDateの1年前 + オフセット調整
  const lyWindowStartDate = addDays(shiftYear(windowStartDate, -1), lyOffset)
  const lyWindowEndDate = addDays(lyWindowStartDate, 6)
  const lyWindowDates = getWeekDates(lyWindowStartDate)

  const { lastYearByCity, loading: lastYearLoading } = useLastYearWeather(
    cities,
    lyWindowStartDate,
    lyWindowEndDate,
  )

  const [selectedCityId, setSelectedCityId] = useState(null)
  const [isManagerOpen, setIsManagerOpen] = useState(false)

  const selectedCity = cities.find((c) => c.id === selectedCityId) ?? null
  const selectedCurrentDays = selectedCityId
    ? (weatherByCity[selectedCityId] ?? []).filter((d) => windowDates.includes(d.date))
    : []
  const selectedLyDays = selectedCityId
    ? (lastYearByCity[selectedCityId] ?? []).filter((d) => lyWindowDates.includes(d.date))
    : []

  const handleSelectCity = (cityId) => {
    setSelectedCityId((prev) => (prev === cityId ? null : cityId))
  }

  const handleRemoveCity = (cityId) => {
    removeCity(cityId)
    if (selectedCityId === cityId) setSelectedCityId(null)
  }

  const handleSelectDate = (date) => {
    setWindowStartDate(date)
    setSelectedCityId(null)
  }

  const handleChangeLyOffset = (newOffset) => {
    const clamped = Math.max(-14, Math.min(14, newOffset))
    setLyOffset(clamped)
  }

  return (
    <div className="app">
      <Header lastUpdated={lastUpdated} loading={loading} onRefresh={refresh} />
      <Navigation screen={screen} onChangeScreen={setScreen} />

      {screen === SCREENS.OVERVIEW && (
        <>
          <Controls cityCount={cities.length} onOpenManager={() => setIsManagerOpen(true)} />

          <main className="app-main">
            <CityOverview
              cities={cities}
              weatherByCity={weatherByCity}
              lastYearByCity={lastYearByCity}
              errors={errors}
              windowStartDate={windowStartDate}
              lyWindowStartDate={lyWindowStartDate}
              lyOffset={lyOffset}
              onSelectDate={handleSelectDate}
              onChangeLyOffset={handleChangeLyOffset}
              selectedCityId={selectedCityId}
              onSelectCity={handleSelectCity}
              loading={loading}
              lastYearLoading={lastYearLoading}
            />

            {selectedCity && (
              <CityDetail
                city={selectedCity}
                currentDays={selectedCurrentDays}
                lastYearDays={selectedLyDays}
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
        </>
      )}

      {screen === SCREENS.MONTHLY && (
        <main className="app-main">
          <MonthlyCompare cities={cities} />
        </main>
      )}
    </div>
  )
}

export default App
