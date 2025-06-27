import { redirect } from "next/navigation"
import { auth } from "../../lib/auth"
import Navbar from "@/components/Navbar"
import Container from "@/components/Container"

import StatsCard from "@/components/StatsCard"
import CommitChart from "@/components/CommitChart"
import Leaderboard from "@/components/Leaderboard"
import ProfileCard from "@/components/ProfileCard"

export default async function DashboardPage() {
    const session = await auth()
    if (!session) return redirect("/")

    const user = session.user

    const data = {
        totalCommits: 1234,
        currentStreak: 15,
        longestStreak: 42,
        dailyCommits: [
            { date: "2025-06-20", count: 5 },
            { date: "2025-06-21", count: 3 },
            { date: "2025-06-22", count: 8 },
        ],
        topUsers: [
            { username: "alice", commits: 200 },
            { username: "bob", commits: 180 },
            { username: "carol", commits: 150 },
        ],
    }

    return (
        <main className="pt-24">
            <Navbar />
            <Container className="space-y-12 py-12">
                {user && <ProfileCard user={user} />}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">
                        Welcome back, {session.user?.name}!
                    </h1>
                    <p className="text-gray-600">
                        Here’s a snapshot of your coding activity.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatsCard label="Total Commits" value={data.totalCommits} />
                    <StatsCard label="Current Streak" value={data.currentStreak} />
                    <StatsCard label="Longest Streak" value={data.longestStreak} />
                </div>

                <CommitChart data={data.dailyCommits} />

                <Leaderboard data={data.topUsers} />
            </Container>
        </main>
    )
}

