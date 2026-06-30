// 都市詳細グラフの気温表示切り替え(昨年比較ONのときにグラフが見づらくならないよう絞り込む)
export const TEMP_VIEWS = {
  BOTH: 'both',
  MAX: 'max',
  MIN: 'min',
}

export const TEMP_VIEW_OPTIONS = [
  { value: TEMP_VIEWS.BOTH, label: 'Both' },
  { value: TEMP_VIEWS.MAX, label: 'Max Temp' },
  { value: TEMP_VIEWS.MIN, label: 'Min Temp' },
]
