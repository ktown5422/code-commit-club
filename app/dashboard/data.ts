import { cache } from "react"

import { getDiscordBotStatus } from "@/lib/discord"
import { getGitHubDashboardData, type GitHubDashboardData } from "@/lib/github"

export interface DashboardDataResult {
    data: GitHubDashboardData | null
    failed: boolean
}

export const loadDashboardData = cache(async (accessToken?: string): Promise<DashboardDataResult> => {
    if (!accessToken) {
        return { data: null, failed: true }
    }

    try {
        return { data: await getGitHubDashboardData(accessToken), failed: false }
    } catch (error) {
        console.error("Failed to load GitHub dashboard data", error)
        return { data: null, failed: true }
    }
})

export const loadBotStatus = cache(getDiscordBotStatus)

export function hasCommitToday(result: DashboardDataResult) {
    return Boolean(result.data?.commitActivity.at(-1)?.count)
}
