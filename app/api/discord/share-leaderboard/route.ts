import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { filterLeaderboardToDiscordMembers, shareLeaderboardToDiscord } from "@/lib/discord"
import { getGitHubDashboardData } from "@/lib/github"

export async function POST() {
    const session = await auth()

    if (!session) {
        return NextResponse.json(
            { message: "Sign in with GitHub before sharing the leaderboard." },
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
        let leaderboard = dashboardData.topContributors

        try {
            const discordLeaderboard = await filterLeaderboardToDiscordMembers(leaderboard)
            leaderboard = discordLeaderboard.configured
                ? discordLeaderboard.contributors
                : leaderboard
        } catch (error) {
            console.error("Failed to filter leaderboard before Discord share", error)
        }

        await shareLeaderboardToDiscord(leaderboard)

        return NextResponse.json({
            message: "Shared the CodeStreak leaderboard in Discord.",
        })
    } catch (error) {
        console.error("Failed to share leaderboard to Discord", error)

        return NextResponse.json(
            {
                message: error instanceof Error
                    ? error.message
                    : "Could not share leaderboard to Discord.",
            },
            { status: 500 }
        )
    }
}
