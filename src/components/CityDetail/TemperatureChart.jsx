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
import { formatGridDate } from '../../utils/dateUtils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// 選択都市の7日間気温推移グラフ(今年・昨年を絶対値で表示)
function TemperatureChart({ currentDays, lastYearDays }) {
  if (!currentDays || currentDays.length === 0) {
    return <p className="no-data">この期間のデータがありません。</p>
  }

  const hasLy = lastYearDays && lastYearDays.length > 0

  const datasets = [
    {
      label: '今年 最高℃',
      data: currentDays.map((d) => d.maxTemp),
      borderColor: '#e74c3c',
      backgroundColor: '#e74c3c',
      tension: 0.3,
    },
    {
      label: '今年 最低℃',
      data: currentDays.map((d) => d.minTemp),
      borderColor: '#3498db',
      backgroundColor: '#3498db',
      tension: 0.3,
    },
  ]

  if (hasLy) {
    datasets.push({
      label: '昨年 最高℃',
      data: lastYearDays.map((d) => d.maxTemp),
      borderColor: '#e74c3c',
      backgroundColor: '#e74c3c',
      borderDash: [6, 4],
      tension: 0.3,
    })
    datasets.push({
      label: '昨年 最低℃',
      data: lastYearDays.map((d) => d.minTemp),
      borderColor: '#3498db',
      backgroundColor: '#3498db',
      borderDash: [6, 4],
      tension: 0.3,
    })
  }

  const data = {
    labels: currentDays.map((d) => formatGridDate(d.date)),
    datasets,
  }

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { title: { display: true, text: '℃' } } },
  }

  return (
    <div className="temperature-chart">
      <Line data={data} options={options} />
    </div>
  )
}

export default TemperatureChart
