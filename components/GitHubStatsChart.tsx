"use client"

import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js"
import { cn } from "@/lib/utils"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface GitHubStats {
  followers: number
  following: number
  publicRepos: number
  totalStars: number
}

interface GitHubStatsChartProps {
  username?: string
  fallbackStats?: GitHubStats
  className?: string
}

export default function GitHubStatsChart({ username, fallbackStats, className }: GitHubStatsChartProps) {
  const [stats, setStats] = useState<GitHubStats | null>(fallbackStats ?? null)
  const [loading, setLoading] = useState(Boolean(username))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) {
      setStats(fallbackStats ?? null)
      setLoading(false)
      return
    }

    async function fetchGitHubStats() {
      try {
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`)
        if (!userResponse.ok) throw new Error("Failed to fetch GitHub user data")
        const userData = await userResponse.json()

        // Fetch repos to calculate total stars
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`
        )
        if (!reposResponse.ok) throw new Error("Failed to fetch repositories")
        const repos: Array<{ stargazers_count: number }> = await reposResponse.json()

        const totalStars = repos.reduce(
          (sum, repo) => sum + repo.stargazers_count,
          0
        )

        setStats({
          followers: userData.followers,
          following: userData.following,
          publicRepos: userData.public_repos,
          totalStars,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubStats()
  }, [fallbackStats, username])

  if (loading) {
    return (
      <div className={cn("rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm", className)}>
        <h2 className="text-2xl font-bold text-[#111827]">GitHub profile stats</h2>
        <p className="mt-4 text-[#52606d]">Loading GitHub data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm", className)}>
        <h2 className="text-2xl font-bold text-[#111827]">GitHub profile stats</h2>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    )
  }

  if (!stats) return null

  const chartData = {
    labels: ["Followers", "Following", "Public Repos", "Total Stars"],
    datasets: [
      {
        label: "Count",
        data: [stats.followers, stats.following, stats.publicRepos, stats.totalStars],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(255, 206, 86)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className={cn("rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm", className)}>
      <div className="mb-6">
        <p className="text-sm font-medium uppercase text-[#52606d]">Profile</p>
        <h2 className="mt-1 text-2xl font-bold text-[#111827]">GitHub profile stats</h2>
      </div>
      <div className="h-72">
        <Bar
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
