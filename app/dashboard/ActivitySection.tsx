import BestCommitTimeCard from "@/components/BestCommitTimeCard"
import CommitChart from "@/components/CommitChart"
import CustomGoalsCard from "@/components/CustomGoalsCard"
import GitHubStatsChart from "@/components/GitHubStatsChart"
import LastCommitCard from "@/components/LastCommitCard"
import RepositoryFocusCard from "@/components/RepositoryFocusCard"
import StatsCard from "@/components/StatsCard"
import StreakHeatmap from "@/components/StreakHeatmap"

import { hasCommitToday, loadBotStatus, loadDashboardData } from "./data"

function buildEmptyHeatmap() {
    const weeks = 6
    const days = weeks * 7
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    startDate.setDate(startDate.getDate() - startDate.getDay() - (weeks - 1) * 7)

    return Array.from({ length: days }, (_, index) => {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + index)

        return {
            count: 0,
            date: date.toISOString().slice(0, 10),
        }
    })
}

export default async function ActivitySection({ accessToken }: { accessToken?: string }) {
    const [result, discordBotStatus] = await Promise.all([
        loadDashboardData(accessToken),
        loadBotStatus(),
    ])
    const { data } = result
    const profile = data?.profile
    const repos = data?.repos ?? []
    const commitActivity = data?.commitActivity ?? [
        { date: "Mon", count: 0 },
        { date: "Tue", count: 0 },
        { date: "Wed", count: 0 },
        { date: "Thu", count: 0 },
        { date: "Fri", count: 0 },
        { date: "Sat", count: 0 },
        { date: "Sun", count: 0 },
    ]
    const commitTimeInsight = data?.commitTimeInsight ?? {
        bestWindow: { commits: 0, label: "Morning" },
        totalCommits: 0,
        windows: [
            { commits: 0, label: "Morning" },
            { commits: 0, label: "Afternoon" },
            { commits: 0, label: "Evening" },
            { commits: 0, label: "Late night" },
        ],
    }
    const stats = {
        followers: profile?.followers ?? 0,
        following: profile?.following ?? 0,
        publicRepos: profile?.publicRepos ?? repos.length,
        totalStars: profile?.totalStars ?? 0,
    }

    return (
        <>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <StatsCard label="Repositories" value={repos.length} detail="Tracked from GitHub" />
                <StatsCard label="GitHub followers" value={profile?.followers ?? 0} detail="Following your profile" />
                <StatsCard label="Discord members" value={discordBotStatus.memberCount ?? 0} detail="CodeStreak server" />
            </div>

            <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <RepositoryFocusCard repos={repos} />
                <LastCommitCard commit={data?.lastCommit ?? null} />
            </div>

            <div className="mt-4">
                <StreakHeatmap data={data?.commitHeatmap ?? buildEmptyHeatmap()} />
            </div>

            <div className="mt-4 grid gap-6 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
                <CommitChart data={commitActivity} />

                <CustomGoalsCard
                    activeRepoCount={repos.length}
                    hasCommitToday={hasCommitToday(result)}
                    recentCommitCount={data?.recentCommitCount ?? 0}
                />

                <BestCommitTimeCard insight={commitTimeInsight} />
            </div>

            <div className="mt-4">
                <GitHubStatsChart fallbackStats={stats} />
            </div>
        </>
    )
}
