import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { shareProgressToDiscord } from "@/lib/discord"
import { getGitHubDashboardData } from "@/lib/github"

export async function POST() {
    const session = await auth()

    if (!session) {
        return NextResponse.json(
            { message: "Sign in with GitHub before sharing progress." },
            { status: 401 }
        )
    }

    if (!session.accessToken) {
        return NextResponse.json(
            { message: "GitHub data is not available for this session." },
            { status: 400 }
        )
    }

    try {
        const dashboardData = await getGitHubDashboardData(session.accessToken)
        const topRepo = dashboardData.repos[0]

        await shareProgressToDiscord({
            currentStreak: dashboardData.currentStreak,
            githubHandle: dashboardData.profile.login,
            name: dashboardData.profile.name ?? session.user?.name,
            recentCommitCount: dashboardData.recentCommitCount,
            topRepoName: topRepo?.name,
        })

        return NextResponse.json({
            message: "Shared your CodeStreak progress in Discord.",
        })
    } catch (error) {
        console.error("Failed to share progress to Discord", error)

        return NextResponse.json(
            {
                message: error instanceof Error
                    ? error.message
                    : "Could not share progress to Discord.",
            },
            { status: 500 }
        )
    }
}
