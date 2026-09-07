import { AlertTriangle, CalendarCheck, CheckCircle2 } from "lucide-react"
import type { Session } from "next-auth"

import ProfileCard from "@/components/ProfileCard"
import StatsCard from "@/components/StatsCard"
import StreakStatusBadge from "@/components/StreakStatusBadge"
import { getDailyCommitPrompt } from "@/lib/prompts"
import { Card, CardContent } from "@/styleguide/components/ui/card"

import { hasCommitToday, loadDashboardData } from "./data"

interface HeroSectionProps {
    accessToken?: string
    firstName: string
    user: Session["user"]
}

export default async function HeroSection({ accessToken, firstName, user }: HeroSectionProps) {
    const result = await loadDashboardData(accessToken)
    const { data, failed } = result
    const profile = data?.profile
    const currentStreak = data?.currentStreak ?? 0
    const longestStreak = data?.longestStreak ?? 0
    const committedToday = hasCommitToday(result)
    const topRepo = data?.repos[0]
    const topContributor = data?.topContributors[0]
    const topFollowed = data?.followingContributors[0]

    const wins = failed
        ? ["Reconnect GitHub to see your streak and repository insights"]
        : [
            currentStreak > 0
                ? `Committed on ${currentStreak} straight day${currentStreak === 1 ? "" : "s"}`
                : "Your next commit starts a fresh streak",
            topRepo
                ? `${topRepo.name} is your most recently pushed repo`
                : "Connect GitHub data to surface your active repositories",
            topContributor
                ? `Top contributor right now is @${topContributor.username}`
                : topFollowed
                    ? `Most active followed developer is @${topFollowed.username}`
                    : "Contributor rankings will appear once repo data loads",
        ]

    return (
        <>
            {failed && (
                <div className="mb-6 flex gap-3 rounded-lg border border-[#fca5a5] bg-[#fef2f2] p-4 text-sm leading-6 text-[#991b1b]">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                        <strong>GitHub data is unavailable right now.</strong> Your streak is safe — we are
                        hiding stats instead of showing zeros. Try refreshing in a minute, or sign out and
                        back in if this keeps happening.
                    </p>
                </div>
            )}

            <section className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
                <Card className="rounded-lg border-[#d9e2ec] bg-white p-0 shadow-sm">
                    <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_220px] lg:items-center">
                        <div className="space-y-6">
                            <StreakStatusBadge
                                currentStreak={currentStreak}
                                hasCommitToday={committedToday}
                                unavailable={failed}
                            />

                            <div className="max-w-2xl space-y-3">
                                <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                                    Welcome back, {firstName}.
                                </h1>
                                <p className="text-base leading-7 text-[#52606d] sm:text-lg">
                                    Stack one focused commit today and keep your streak moving with the club.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <StatsCard
                                    label="Recent commits"
                                    value={failed ? "—" : data?.recentCommitCount ?? 0}
                                    detail="Last 7 days"
                                />
                                <StatsCard
                                    label="Longest streak"
                                    value={failed ? "—" : `${longestStreak} day${longestStreak === 1 ? "" : "s"}`}
                                    detail="Past year"
                                />
                                <StatsCard
                                    label="Top repo"
                                    value={topRepo?.name ?? (failed ? "—" : "No data")}
                                    detail={topRepo ? `${topRepo.stars} stars` : "Waiting on repo data"}
                                />
                            </div>
                        </div>

                        <ProfileCard
                            user={{
                                ...user,
                                bio: profile?.bio,
                                image: profile?.avatarUrl ?? user?.image,
                                login: profile?.login ?? user?.login,
                                name: profile?.name ?? user?.name,
                            }}
                            className="h-fit"
                        />
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
                            {getDailyCommitPrompt()}
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
        </>
    )
}
