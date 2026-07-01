import DailyGrid from './DailyGrid'
import Calendar from '../Calendar/Calendar'
import { groupCitiesByRegion } from '../../utils/cityUtils'
import { getAlerts } from '../../utils/alertUtils'
import { addDays, getWeekDates, getTodayString, shiftYear } from '../../utils/dateUtils'
import './CityOverview.css'

// 概要画面: カレンダー + 地域別都市一覧(7日間デイリーグリッド)
function CityOverview({
  cities,
  weatherByCity,
  lastYearByCity,
  errors,
  windowStartDate,
  lyWindowStartDate,
  lyOffset,
  onSelectDate,
  onChangeLyOffset,
  selectedCityId,
  onSelectCity,
  loading,
  lastYearLoading,
}) {
  const today = getTodayString()
  const windowEndDate = addDays(windowStartDate, 6)
  const windowDates = getWeekDates(windowStartDate)
  const lyWindowDates = getWeekDates(lyWindowStartDate)
  const lyYear = lyWindowStartDate.slice(0, 4)

  const regionGroups = groupCitiesByRegion(cities)

  return (
    <div className="city-overview-wrap">
      {/* ━━ カレンダー ━━ */}
      <div className="calendar-section">
        <div className="calendar-header-row">
          <h3 className="section-title">📅 表示期間を選択</h3>
        </div>
        <Calendar windowStartDate={windowStartDate} onSelectDate={onSelectDate} />

        <div className="date-info-row">
          <div className="date-info-block">
            <span className="date-info-label">表示期間</span>
            <span className="date-info-value">
              {windowStartDate} 〜 {windowEndDate}
            </span>
          </div>
          <div className="date-info-block">
            <span className="date-info-label">昨年比較</span>
            <span className="date-info-value">
              {lyWindowStartDate} 〜 {addDays(lyWindowStartDate, 6)}{' '}
              <span className="ly-year-badge">{lyYear}年</span>
            </span>
            <div className="ly-offset-controls">
              <button className="offset-btn" onClick={() => onChangeLyOffset(lyOffset - 1)} title="昨年の日付を1日前へ">
                ◀ 1日前
              </button>
              {lyOffset !== 0 && (
                <button className="offset-btn reset-btn" onClick={() => onChangeLyOffset(0)}>
                  リセット
                </button>
              )}
              <button className="offset-btn" onClick={() => onChangeLyOffset(lyOffset + 1)} title="昨年の日付を1日後へ">
                1日後 ▶
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ━━ 都市一覧 ━━ */}
      {(loading || lastYearLoading) && (
        <p className="loading-text">気象データを取得中...</p>
      )}

      {cities.length === 0 && (
        <p className="empty-state">都市が登録されていません。「都市を管理」から追加してください。</p>
      )}

      {regionGroups.map((group) => (
        <div key={group.id} className="region-group">
          <div className="region-group-header">
            <span className="region-group-label">{group.label}</span>
          </div>

          <div className="region-city-list">
            {group.cities.map((city) => {
              const allDays = weatherByCity[city.id] ?? []
              const lyDays = lastYearByCity[city.id] ?? []
              const currentDays = allDays.filter((d) => windowDates.includes(d.date))
              const lastYearDays = lyDays.filter((d) => lyWindowDates.includes(d.date))
              const alerts = getAlerts(currentDays[0] ?? null, currentDays)

              return (
                <DailyGrid
                  key={city.id}
                  city={city}
                  windowDates={windowDates}
                  lyWindowDates={lyWindowDates}
                  currentDays={currentDays}
                  lastYearDays={lastYearDays}
                  alerts={alerts}
                  isSelected={selectedCityId === city.id}
                  onSelect={() => onSelectCity(city.id)}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CityOverview
