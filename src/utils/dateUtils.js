// 日付文字列(YYYY-MM-DD)を表示用にフォーマットする(例: Mon, Jun 29)
export function formatDateLabel(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// 最終更新時刻を表示用にフォーマットする
export function formatTimestamp(isoString) {
  if (!isoString) return '--'
  const date = new Date(isoString)
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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
// 都市ごとのローカル日付で過去/未来の境界を判定するために使用する
export function getTodayInTimezone(timezone) {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date())
  } catch {
    return getTodayString()
  }
}

// 日付文字列(YYYY-MM-DD)の年だけをずらす(昨年同期間の算出に使用)
// 2/29のように移動先の年に存在しない日付になる場合は、その月の末日に丸める
export function shiftYear(dateStr, yearsDelta) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const shifted = new Date(Date.UTC(year + yearsDelta, month - 1, day))

  if (shifted.getUTCMonth() !== month - 1) {
    shifted.setUTCDate(0)
  }

  return shifted.toISOString().slice(0, 10)
}
