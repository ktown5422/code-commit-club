import { redirect } from "next/navigation"
import {
    CalendarCheck,
    CheckCircle2,
    Flame,
    Goal,
    Sparkles,
} from "lucide-react"

import CommitChart from "@/components/CommitChart"
import Container from "@/components/Container"
import GitHubStatsChart from "@/components/GitHubStatsChart"
import Leaderboard from "@/components/Leaderboard"
import Navbar from "@/components/Navbar"
import ProfileCard from "@/components/ProfileCard"
import StatsCard from "@/components/StatsCard"
import { Card, CardContent } from "@/styleguide/components/ui/card"
import { auth } from "@/lib/auth"

const commitActivity = [
    { date: "Mon", count: 8 },
    { date: "Tue", count: 12 },
    { date: "Wed", count: 6 },
    { date: "Thu", count: 16 },
    { date: "Fri", count: 10 },
    { date: "Sat", count: 5 },
    { date: "Sun", count: 14 },
]

const leaderboard = [
    { username: "alice", commits: 240, streak: 31 },
    { username: "bob", commits: 218, streak: 24 },
    { username: "carol", commits: 196, streak: 18 },
    { username: "dani", commits: 175, streak: 16 },
]

const goals = [
    { label: "Daily commit", current: 1, target: 1 },
    { label: "Weekly commits", current: 71, target: 84 },
    { label: "Monthly streak", current: 15, target: 30 },
]

const wins = [
    "Shipped commits on 6 of the last 7 days",
    "Beat last week's commit count by 18%",
    "Joined the top 10 for current streaks",
]

const fallbackGitHubStats = {
    followers: 128,
    following: 84,
    publicRepos: 32,
    totalStars: 416,
}

export default async function DashboardPage() {
    const session = await auth()
    if (!session) return redirect("/")

    const user = session.user
    const firstName = user?.name?.split(" ")[0] ?? "developer"

    return (
        <main className="min-h-screen bg-[#f8fafc] text-[#111827]">
            <Navbar />

            <Container className="pt-28 pb-16">
                <section className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
                    <Card className="rounded-lg border-[#d9e2ec] bg-white p-0 shadow-sm">
                        <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_220px] lg:items-center">
                            <div className="space-y-6">
                                <div className="inline-flex w-fit items-center gap-2 rounded-md border border-[#b7d9d3] bg-[#e8f6f3] px-3 py-1 text-sm font-medium text-[#126457]">
                                    <Sparkles className="h-4 w-4" />
                                    Day 15 is ready
                                </div>

                                <div className="max-w-2xl space-y-3">
                                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                                        Welcome back, {firstName}.
                                    </h1>
                                    <p className="text-base leading-7 text-[#52606d] sm:text-lg">
                                        Stack one focused commit today and keep your streak moving with the club.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <StatsCard label="Next milestone" value="20 days" detail="Five commits away" />
                                    <StatsCard label="Best day" value="Thu" detail="16 commits logged" />
                                    <StatsCard label="Focus window" value="9 PM" detail="Your strongest rhythm" />
                                </div>
                            </div>

                            <ProfileCard user={user ?? {}} className="h-fit" />
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-[#d9e2ec] bg-[#111827] p-0 text-white shadow-sm">
                        <CardContent className="space-y-6 p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium uppercase text-[#cbd5e1]">Today</p>
                                    <h2 className="mt-1 text-2xl font-bold">Commit prompt</h2>
                                </div>
                                <CalendarCheck className="h-8 w-8 text-[#5eead4]" />
                            </div>

                            <p className="text-lg font-semibold leading-7">
                                Refactor one thing you touched this week.
                            </p>

                            <div className="grid gap-3">
                                {wins.map((win) => (
                                    <div key={win} className="flex gap-3 rounded-md bg-white/10 p-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5eead4]" />
                                        <p className="text-sm text-[#e2e8f0]">{win}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatsCard label="Total commits" value="1,234" detail="+142 this month" />
                    <StatsCard label="Current streak" value="15 days" detail="Keep it alive today" />
                    <StatsCard label="Longest streak" value="42 days" detail="Personal best" />
                    <StatsCard label="Club rank" value="#8" detail="Up 3 spots" />
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                    <CommitChart data={commitActivity} />

                    <Card className="rounded-lg border-[#d9e2ec] bg-white p-0 shadow-sm">
                        <CardContent className="space-y-6 p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium uppercase text-[#52606d]">Goals</p>
                                    <h2 className="mt-1 text-2xl font-bold">Progress</h2>
                                </div>
                                <Goal className="h-8 w-8 text-[#0f766e]" />
                            </div>

                            <div className="space-y-5">
                                {goals.map((goal) => {
                                    const progress = Math.min((goal.current / goal.target) * 100, 100)

                                    return (
                                        <div key={goal.label}>
                                            <div className="flex items-center justify-between gap-4 text-sm">
                                                <span className="font-medium">{goal.label}</span>
                                                <span className="text-[#52606d]">
                                                    {goal.current}/{goal.target}
                                                </span>
                                            </div>
                                            <div className="mt-2 h-3 overflow-hidden rounded-md bg-[#e5e7eb]">
                                                <div
                                                    className="h-full rounded-md bg-[#f97316]"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-2">
                    <GitHubStatsChart fallbackStats={fallbackGitHubStats} />
                    <Leaderboard data={leaderboard} />
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-lg border border-[#d9e2ec] bg-white p-5 shadow-sm">
                        <Flame className="h-8 w-8 text-[#f97316]" />
                        <div>
                            <p className="font-bold">Streak check</p>
                            <p className="text-sm text-[#52606d]">One commit keeps the flame lit.</p>
                        </div>
                    </div>
                    <div className="rounded-lg border border-[#d9e2ec] bg-white p-5 shadow-sm sm:col-span-2">
                        <p className="text-sm font-medium uppercase text-[#52606d]">Next move</p>
                        <p className="mt-2 text-xl font-bold">
                            Pick a small fix, write the test, and commit before your focus window.
                        </p>
                    </div>
                </section>
            </Container>
        </main>
    )
}
