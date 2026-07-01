// 都市を地域別にグループ化するための定義
// 同じグループの都市は連続して表示される
export const REGION_GROUPS = [
  { id: 'japan', label: '日本', regionCodes: ['JP'] },
  {
    id: 'east_asia',
    label: '東アジア',
    regionCodes: ['KR', 'CN', 'TW', 'HK', 'MO'],
  },
  {
    id: 'asean',
    label: 'ASEAN',
    regionCodes: ['TH', 'SG', 'VN', 'MY', 'ID', 'PH', 'MM', 'LA', 'KH', 'BN', 'TL'],
  },
  {
    id: 'north_america',
    label: '北米',
    regionCodes: ['US', 'CA', 'MX'],
  },
  {
    id: 'south_america',
    label: '中南米',
    regionCodes: ['BR', 'AR', 'CL', 'CO', 'PE', 'EC', 'BO', 'PY', 'UY', 'VE', 'GY', 'SR'],
  },
  {
    id: 'europe',
    label: '欧州',
    regionCodes: [
      'GB', 'IE', 'FR', 'DE', 'IT', 'ES', 'PT', 'NL', 'BE', 'LU', 'CH', 'AT',
      'SE', 'NO', 'DK', 'FI', 'IS', 'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'GR',
      'HR', 'SI', 'RS', 'BA', 'AL', 'ME', 'MK', 'UA', 'BY', 'MD', 'LT', 'LV', 'EE',
    ],
  },
  {
    id: 'middle_east',
    label: '中東',
    regionCodes: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'YE', 'IL', 'JO', 'LB', 'SY', 'IQ', 'IR', 'EG'],
  },
  { id: 'oceania', label: '豪州', regionCodes: ['AU', 'NZ', 'FJ', 'PG'] },
]
