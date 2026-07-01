import { addDays, getWeekDates, getMonthDates, getMonthStartDow, getPrevMonth, getTodayString } from '../../utils/dateUtils'
import './Calendar.css'

const DOW_LABELS = ['日', '月', '火', '水', '木', '金', '土']
const MONTH_JP = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

// 2ヶ月表示のインラインカレンダー
// windowStartDateをクリックで設定し、7日間範囲をハイライトする
function Calendar({ windowStartDate, onSelectDate }) {
  const today = getTodayString()
  const currentYearMonth = today.slice(0, 7)
  const prevYearMonth = getPrevMonth(currentYearMonth)
  const windowEndDate = addDays(windowStartDate, 6)

  const renderMonth = (yearMonth) => {
    const [y, m] = yearMonth.split('-').map(Number)
    const dates = getMonthDates(yearMonth)
    const startDow = getMonthStartDow(yearMonth)

    const cells = []
    for (let i = 0; i < startDow; i++) {
      cells.push(<div key={`pad-${i}`} className="cal-cell empty" />)
    }

    dates.forEach((date) => {
      const isStart = date === windowStartDate
      const inRange = date >= windowStartDate && date <= windowEndDate
      const isToday = date === today
      const isFutureBeyondForecast = date > addDays(today, 7)

      cells.push(
        <button
          key={date}
          className={[
            'cal-cell',
            inRange ? 'in-range' : '',
            isStart ? 'range-start' : '',
            isToday ? 'today' : '',
            isFutureBeyondForecast ? 'future-dim' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onSelectDate(date)}
          title={date}
        >
          {Number(date.slice(8))}
        </button>
      )
    })

    return (
      <div className="cal-month" key={yearMonth}>
        <div className="cal-month-label">
          {y}年 {MONTH_JP[m - 1]}
        </div>
        <div className="cal-dow-row">
          {DOW_LABELS.map((d, i) => (
            <div key={d} className={`cal-dow ${i === 0 ? 'dow-sun' : i === 6 ? 'dow-sat' : ''}`}>
              {d}
            </div>
          ))}
        </div>
        <div className="cal-grid">{cells}</div>
      </div>
    )
  }

  return (
    <div className="calendar">
      {renderMonth(prevYearMonth)}
      {renderMonth(currentYearMonth)}
    </div>
  )
}

export default Calendar
