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
import { filterByPeriod } from '../../utils/weatherUtils'
import { formatDateLabel } from '../../utils/dateUtils'

// Chart.jsに必要な構成要素を登録する
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// 都市の気温推移(最高/最低気温)を折れ線グラフで表示する
function TemperatureChart({ weatherData, period }) {
  const filtered = filterByPeriod(weatherData, period)

  if (filtered.length === 0) {
    return <p className="no-data">No data available for this period.</p>
  }

  const data = {
    labels: filtered.map((d) => formatDateLabel(d.date)),
    datasets: [
      {
        label: 'Max Temp (°C)',
        data: filtered.map((d) => d.maxTemp),
        borderColor: '#e74c3c',
        backgroundColor: '#e74c3c',
        tension: 0.3,
      },
      {
        label: 'Min Temp (°C)',
        data: filtered.map((d) => d.minTemp),
        borderColor: '#3498db',
        backgroundColor: '#3498db',
        tension: 0.3,
      },
    ],
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
