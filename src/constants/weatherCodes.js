// Open-MeteoのWeather Code(WMO天気コード)をアイコン・ラベルに変換するための対応表
// 参考: https://open-meteo.com/en/docs

export const WEATHER_CODE_MAP = {
  0: { icon: '☀️', label: 'Clear' },
  1: { icon: '🌤️', label: 'Partly Cloudy' },
  2: { icon: '🌤️', label: 'Partly Cloudy' },
  3: { icon: '☁️', label: 'Cloudy' },
  45: { icon: '🌫️', label: 'Fog' },
  48: { icon: '🌫️', label: 'Fog' },
  51: { icon: '🌦️', label: 'Drizzle' },
  53: { icon: '🌦️', label: 'Drizzle' },
  55: { icon: '🌦️', label: 'Drizzle' },
  56: { icon: '🌦️', label: 'Drizzle' },
  57: { icon: '🌦️', label: 'Drizzle' },
  61: { icon: '🌧️', label: 'Rain' },
  63: { icon: '🌧️', label: 'Rain' },
  65: { icon: '🌧️', label: 'Rain' },
  66: { icon: '🌧️', label: 'Rain' },
  67: { icon: '🌧️', label: 'Rain' },
  80: { icon: '🌧️', label: 'Rain' },
  81: { icon: '🌧️', label: 'Rain' },
  82: { icon: '🌧️', label: 'Rain' },
  71: { icon: '❄️', label: 'Snow' },
  73: { icon: '❄️', label: 'Snow' },
  75: { icon: '❄️', label: 'Snow' },
  77: { icon: '❄️', label: 'Snow' },
  85: { icon: '❄️', label: 'Snow' },
  86: { icon: '❄️', label: 'Snow' },
  95: { icon: '⛈️', label: 'Thunderstorm' },
  96: { icon: '⛈️', label: 'Thunderstorm' },
  99: { icon: '⛈️', label: 'Thunderstorm' },
}

export const UNKNOWN_WEATHER = { icon: '❓', label: 'Unknown' }

// weather_codeからアイコンとラベルを取得する
export function getWeatherInfo(weatherCode) {
  return WEATHER_CODE_MAP[weatherCode] ?? UNKNOWN_WEATHER
}
