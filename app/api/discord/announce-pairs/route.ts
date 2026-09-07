import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { announceAccountabilityPairing, getAccountabilityPairing } from "@/lib/discord"
import { getGitHubDashboardData } from "@/lib/github"

export async function POST() {
    const session = await auth()

    if (!session) {
        return NextResponse.json(
            { message: "Sign in with GitHub before announcing pairs." },
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
        const pairing = await getAccountabilityPairing(dashboardData.topContributors)

        if (!pairing.configured) {
            return NextResponse.json(
                { message: "Connect the Discord bot before announcing pairs." },
                { status: 400 }
            )
        }

        await announceAccountabilityPairing(pairing)

        return NextResponse.json({
            message: `Announced ${pairing.pairs.length} accountability pair${pairing.pairs.length === 1 ? "" : "s"} in Discord.`,
        })
    } catch (error) {
        console.error("Failed to announce accountability pairs to Discord", error)

        return NextResponse.json(
            {
                message: error instanceof Error
                    ? error.message
                    : "Could not announce accountability pairs to Discord.",
            },
            { status: 500 }
        )
    }
}
