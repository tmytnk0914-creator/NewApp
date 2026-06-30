// 地域コード(ISO 3166-1 alpha-2)から地域旗の絵文字を生成する
// アルファベット2文字をUnicodeの「regional indicator symbol」に変換する仕組みを利用する
export function codeToFlag(regionCode) {
  if (!regionCode || regionCode.length !== 2) return '🏳️'
  return regionCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
}

// 台湾・香港・マカオは中国(China)とは別のregionとして扱うための補正表
// ジオコーディングAPIの結果が「China」を返すケースに備えて明示的に上書きする
const REGION_NAME_OVERRIDES = {
  TW: 'Taiwan',
  HK: 'Hong Kong',
  MO: 'Macau',
}

export function normalizeRegionName(regionCode, fallbackName) {
  return REGION_NAME_OVERRIDES[regionCode] ?? fallbackName
}
