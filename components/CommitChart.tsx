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
  Filler,
} from "chart.js"
import { cn } from "@/lib/utils"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface Day { date: string; count: number }
interface CommitChartProps { data: Day[]; className?: string }

export default function CommitChart({ data, className }: CommitChartProps) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: "Commits per day",
        data: data.map(d => d.count),
        fill: true,
        tension: 0.3,
        borderColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.12)",
        pointBackgroundColor: "#0f766e",
        pointBorderColor: "#ffffff",
        pointRadius: 4,
      },
    ],
  }

  return (
    <div className={cn("rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm", className)}>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-[#52606d]">Activity</p>
          <h2 className="mt-1 text-2xl font-bold text-[#111827]">Recent activity</h2>
        </div>
        <p className="w-fit rounded-md bg-[#fff7ed] px-3 py-1 text-sm font-bold text-[#9a3412]">
          {data.reduce((total, day) => total + day.count, 0)} commits
        </p>
      </div>
      <div className="h-72">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: "#edf2f7" } },
              x: { grid: { display: false } },
            },
          }}
        />
      </div>
    </div>
  )
}
