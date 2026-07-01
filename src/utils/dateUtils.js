// 日付文字列(YYYY-MM-DD)を表示用にフォーマットする(例: Mon, Jun 29)
export function formatDateLabel(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// 最終更新時刻を表示用にフォーマットする
export function formatTimestamp(isoString) {
  if (!isoString) return '--'
  const date = new Date(isoString)
  return date.toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// 今日の日付(YYYY-MM-DD, ブラウザのローカル日付)を返す
export function getTodayString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 指定したタイムゾーンにおける「今日」の日付(YYYY-MM-DD)を返す
export function getTodayInTimezone(timezone) {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date())
  } catch {
    return getTodayString()
  }
}

// 日付文字列(YYYY-MM-DD)の年だけをずらす(2/29は月末に丸める)
export function shiftYear(dateStr, yearsDelta) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const shifted = new Date(Date.UTC(year + yearsDelta, month - 1, day))
  if (shifted.getUTCMonth() !== month - 1) shifted.setUTCDate(0)
  return shifted.toISOString().slice(0, 10)
}

// 今日からN日前の日付(YYYY-MM-DD)を返す(Historical Weather APIの遅延対策用)
export function getDaysAgoString(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 日付文字列にN日加算した日付を返す
export function addDays(dateStr, days) {
  const date = new Date(`${dateStr}T00:00:00`)
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 開始日から7日間の日付配列(YYYY-MM-DD)を返す
export function getWeekDates(startDate) {
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
}

// 日次グリッド列ヘッダー用のフォーマット(例: 6/26(木))
export function formatGridDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dow = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  return `${month}/${day}(${dow})`
}

// YYYY-MM形式の前月を返す(カレンダーナビゲーション用)
export function getPrevMonth(yearMonth) {
  const [y, m] = yearMonth.split('-').map(Number)
  if (m === 1) return `${y - 1}-12`
  return `${y}-${String(m - 1).padStart(2, '0')}`
}

// YYYY-MM形式の月に属する全日付配列を返す(カレンダー描画用)
export function getMonthDates(yearMonth) {
  const [y, m] = yearMonth.split('-').map(Number)
  const lastDay = new Date(y, m, 0).getDate()
  return Array.from({ length: lastDay }, (_, i) => {
    const d = String(i + 1).padStart(2, '0')
    return `${yearMonth}-${d}`
  })
}

// YYYY-MM形式の月の1日目の曜日(0=日, 1=月, ...)を返す
export function getMonthStartDow(yearMonth) {
  return new Date(`${yearMonth}-01T00:00:00`).getDay()
}
