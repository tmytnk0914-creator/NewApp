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
import { MONTH_LABELS } from '../../constants/monthlyMetrics'

// Chart.jsに必要な構成要素を登録する
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// 月次比較グラフ(This Year / Last Year / 2 Years Agoの3系列、横軸は1月〜12月)
function MonthlyChart({ rows, metric, metricOption, years }) {
  const [thisYear, lastYear, twoYearsAgo] = years

  const data = {
    labels: MONTH_LABELS,
    datasets: [
      {
        label: `This Year (${thisYear})`,
        data: rows.map((r) => r.thisYearData?.[metric] ?? null),
        borderColor: '#e74c3c',
        backgroundColor: '#e74c3c',
        tension: 0.3,
      },
      {
        label: `Last Year (${lastYear})`,
        data: rows.map((r) => r.lastYearData?.[metric] ?? null),
        borderColor: '#3498db',
        backgroundColor: '#3498db',
        tension: 0.3,
      },
      {
        label: `2 Years Ago (${twoYearsAgo})`,
        data: rows.map((r) => r.twoYearsAgoData?.[metric] ?? null),
        borderColor: '#95a5a6',
        backgroundColor: '#95a5a6',
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
        title: { display: true, text: metricOption.unit === '℃' ? '°C' : 'days' },
      },
    },
  }

  return (
    <div className="monthly-chart-wrapper">
      <div className="monthly-chart">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default MonthlyChart
