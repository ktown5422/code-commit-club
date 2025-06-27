"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

interface Day { date: string; count: number }
interface CommitChartProps { data: Day[] }

export default function CommitChart({ data }: CommitChartProps) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: "Commits per day",
        data: data.map(d => d.count),
        fill: false,
        tension: 0.3,
      },
    ],
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <Line data={chartData} />
    </div>
  )
}
