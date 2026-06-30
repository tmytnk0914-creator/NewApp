import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { filterByPeriod, pairWithLastYear } from '../../utils/weatherUtils'
import { formatDateLabel } from '../../utils/dateUtils'
import { TEMP_VIEWS } from '../../constants/tempView'

// Chart.jsに必要な構成要素を登録する
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// 都市の気温推移(最高/最低気温)を折れ線グラフで表示する
// 昨年比較ONのときは、tempViewに応じて表示する線を絞り込みグラフが煩雑になるのを防ぐ
function TemperatureChart({ weatherData, lastYearData, period, compareLastYear, tempView }) {
  const filtered = filterByPeriod(weatherData, period)

  if (filtered.length === 0) {
    return <p className="no-data">No data available for this period.</p>
  }

  const showMax = !compareLastYear || tempView === TEMP_VIEWS.BOTH || tempView === TEMP_VIEWS.MAX
  const showMin = !compareLastYear || tempView === TEMP_VIEWS.BOTH || tempView === TEMP_VIEWS.MIN

  const datasets = []

  if (showMax) {
    datasets.push({
      label: 'Max Temp (°C)',
      data: filtered.map((d) => d.maxTemp),
      borderColor: '#e74c3c',
      backgroundColor: '#e74c3c',
      tension: 0.3,
    })
  }
  if (showMin) {
    datasets.push({
      label: 'Min Temp (°C)',
      data: filtered.map((d) => d.minTemp),
      borderColor: '#3498db',
      backgroundColor: '#3498db',
      tension: 0.3,
    })
  }

  if (compareLastYear) {
    const paired = pairWithLastYear(filtered, lastYearData)

    if (showMax) {
      datasets.push({
        label: 'Last Year Max (°C)',
        data: paired.map((d) => d.lastYear?.maxTemp ?? null),
        borderColor: '#e74c3c',
        backgroundColor: '#e74c3c',
        borderDash: [6, 4],
        tension: 0.3,
      })
    }
    if (showMin) {
      datasets.push({
        label: 'Last Year Min (°C)',
        data: paired.map((d) => d.lastYear?.minTemp ?? null),
        borderColor: '#3498db',
        backgroundColor: '#3498db',
        borderDash: [6, 4],
        tension: 0.3,
      })
    }
  }

  const data = {
    labels: filtered.map((d) => formatDateLabel(d.date)),
    datasets,
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        title: { display: true, text: '°C' },
      },
    },
  }

  return (
    <div className="temperature-chart">
      <Line data={data} options={options} />
    </div>
  )
}

export default TemperatureChart
