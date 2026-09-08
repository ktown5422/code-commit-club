import { cache } from "react"

import { auth } from "@/lib/auth"
import { getDiscordBotStatus } from "@/lib/discord"
import { getGitHubDashboardData, type GitHubDashboardData } from "@/lib/github"
import {
    DEFAULT_SETTINGS,
    getChecklistForDay,
    getMemberSettings,
    toDayKey,
    type MemberIdentity,
    type MemberSettings,
} from "@/lib/member-store"

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

export const loadMemberIdentity = cache(async (): Promise<MemberIdentity | null> => {
    const session = await auth()
    const githubLogin = session?.user?.login

    if (!githubLogin) {
        return null
    }

    return {
        email: session.user?.email,
        githubLogin,
        imageUrl: session.user?.image,
        name: session.user?.name,
    }
})

// A database outage should cost the member their saved targets for one render,
// not the whole dashboard, so these fall back to defaults the way the GitHub
// loader falls back to hiding stats.
export const loadMemberSettings = cache(async (): Promise<MemberSettings> => {
    const identity = await loadMemberIdentity()

    if (!identity) {
        return DEFAULT_SETTINGS
    }

    try {
        return await getMemberSettings(identity)
    } catch (error) {
        console.error("Failed to load member settings", error)
        return DEFAULT_SETTINGS
    }
})

export const loadTodayChecklist = cache(async (): Promise<{ completedItems: string[]; dayKey: string }> => {
    const dayKey = toDayKey()
    const identity = await loadMemberIdentity()

    if (!identity) {
        return { completedItems: [], dayKey }
    }

    try {
        return { completedItems: await getChecklistForDay(identity, dayKey), dayKey }
    } catch (error) {
        console.error("Failed to load today's checklist", error)
        return { completedItems: [], dayKey }
    }
})
