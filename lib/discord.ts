import type { GitHubContributor } from "@/lib/github"

const DISCORD_API_BASE = "https://discord.com/api/v10"
const MAX_DISCORD_MEMBERS = 1000
const MAX_DISCORD_MEMBER_PAGES = 10

interface DiscordUser {
    global_name?: string | null
    id: string
    username: string
}

interface DiscordGuildMember {
    nick?: string | null
    user?: DiscordUser
}

interface DiscordGuild {
    approximate_member_count?: number
    id: string
    name: string
}

interface DiscordEmbedField {
    inline?: boolean
    name: string
    value: string
}

interface DiscordMessagePayload {
    components?: Array<{
        components: Array<{
            label: string
            style: number
            type: number
            url: string
        }>
        type: number
    }>
    content: string
    embeds?: Array<{
        color: number
        description: string
        fields: DiscordEmbedField[]
        title: string
        url?: string
    }>
}

export interface DiscordLeaderboardResult {
    configured: boolean
    contributors: GitHubContributor[]
}

export interface DiscordCommunityMatch {
    displayName: string
    githubHandle?: string
}

export interface DiscordCommunityMatchingResult {
    configured: boolean
    githubContributorCount: number
    matchedContributors: DiscordCommunityMatch[]
    matchedMemberCount: number
    totalMemberCount: number
    unmatchedMembers: DiscordCommunityMatch[]
}

export interface DiscordBotStatus {
    botName?: string
    configured: boolean
    error?: string
    guildName?: string
    memberCount?: number
    membersVisible: boolean
    online: boolean
}

function getDiscordConfig() {
    const botToken = process.env.DISCORD_BOT_TOKEN
    const guildId = process.env.DISCORD_GUILD_ID

    if (!botToken || !guildId) {
        return null
    }

    return { botToken, guildId }
}

function getAppUrl() {
    return (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "")
}

async function discordRequest<T>(path: string) {
    const config = getDiscordConfig()

    if (!config) {
        return null
    }

    const response = await fetch(`${DISCORD_API_BASE}${path}`, {
        headers: {
            Authorization: `Bot ${config.botToken}`,
        },
        next: { revalidate: 300 },
    })

    if (!response.ok) {
        throw new Error(`Discord request failed with ${response.status}`)
    }

    return response.json() as Promise<T>
}

async function sendDiscordChannelMessage(payload: DiscordMessagePayload) {
    const config = getDiscordConfig()
    const channelId = process.env.DISCORD_CHANNEL_ID

    if (!config || !channelId) {
        throw new Error("Discord posting is not configured")
    }

    const response = await fetch(`${DISCORD_API_BASE}/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
            Authorization: `Bot ${config.botToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error(`Discord message failed with ${response.status}`)
    }

    return response.json()
}

function normalizeHandle(value: string) {
    return value
        .trim()
        .replace(/^@/, "")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
}

function getPossibleGitHubHandles(value: string) {
    const directHandle = normalizeHandle(value)
    const mentionedHandles = [...value.matchAll(/@([a-zA-Z0-9-]{1,39})/g)]
        .map((match) => normalizeHandle(match[1]))

    return [directHandle, ...mentionedHandles].filter(Boolean)
}

function collectMemberAliases(member: DiscordGuildMember) {
    return [
        member.user?.username,
        member.user?.global_name,
        member.nick,
    ]
        .filter((value): value is string => Boolean(value))
        .flatMap(getPossibleGitHubHandles)
        .filter(Boolean)
}

function getMemberDisplayName(member: DiscordGuildMember) {
    return member.nick
        ?? member.user?.global_name
        ?? member.user?.username
        ?? "Unknown member"
}

async function getDiscordGuildMembers() {
    const config = getDiscordConfig()

    if (!config) {
        return null
    }

    const members: DiscordGuildMember[] = []
    let after = "0"

    for (let page = 0; page < MAX_DISCORD_MEMBER_PAGES; page += 1) {
        const response = await fetch(
            `${DISCORD_API_BASE}/guilds/${config.guildId}/members?limit=${MAX_DISCORD_MEMBERS}&after=${after}`,
            {
                headers: {
                    Authorization: `Bot ${config.botToken}`,
                },
                next: { revalidate: 300 },
            }
        )

        if (!response.ok) {
            throw new Error(`Discord members request failed with ${response.status}`)
        }

        const pageMembers = await response.json() as DiscordGuildMember[]
        members.push(...pageMembers)

        const lastMemberId = pageMembers.at(-1)?.user?.id

        if (pageMembers.length < MAX_DISCORD_MEMBERS || !lastMemberId) {
            break
        }

        after = lastMemberId
    }

    return members
}

export async function getDiscordBotStatus(): Promise<DiscordBotStatus> {
    const config = getDiscordConfig()

    if (!config) {
        return {
            configured: false,
            membersVisible: false,
            online: false,
        }
    }

    try {
        const botUser = await discordRequest<DiscordUser>("/users/@me")
        const guild = await discordRequest<DiscordGuild>(
            `/guilds/${config.guildId}?with_counts=true`
        )
        const members = await getDiscordGuildMembers()

        return {
            botName: botUser?.username,
            configured: true,
            guildName: guild?.name,
            memberCount: members?.length ?? guild?.approximate_member_count,
            membersVisible: Boolean(members),
            online: Boolean(botUser && guild),
        }
    } catch (error) {
        return {
            configured: true,
            error: error instanceof Error ? error.message : "Discord status check failed",
            membersVisible: false,
            online: false,
        }
    }
}

export async function filterLeaderboardToDiscordMembers(
    contributors: GitHubContributor[]
): Promise<DiscordLeaderboardResult> {
    const members = await getDiscordGuildMembers()

    if (!members) {
        return {
            configured: false,
            contributors,
        }
    }

    const communityHandles = new Set(members.flatMap(collectMemberAliases))

    return {
        configured: true,
        contributors: contributors.filter((contributor) =>
            communityHandles.has(normalizeHandle(contributor.username))
        ),
    }
}

export async function getDiscordCommunityMatching(
    contributors: GitHubContributor[]
): Promise<DiscordCommunityMatchingResult> {
    const members = await getDiscordGuildMembers()

    if (!members) {
        return {
            configured: false,
            githubContributorCount: contributors.length,
            matchedContributors: [],
            matchedMemberCount: 0,
            totalMemberCount: 0,
            unmatchedMembers: [],
        }
    }

    const contributorHandles = new Set(
        contributors.map((contributor) => normalizeHandle(contributor.username))
    )
    const matchedContributors = new Map<string, DiscordCommunityMatch>()
    const unmatchedMembers: DiscordCommunityMatch[] = []
    let matchedMemberCount = 0

    for (const member of members) {
        const aliases = collectMemberAliases(member)
        const matchedHandle = aliases.find((alias) => contributorHandles.has(alias))

        if (matchedHandle) {
            matchedMemberCount += 1
            matchedContributors.set(matchedHandle, {
                displayName: getMemberDisplayName(member),
                githubHandle: matchedHandle,
            })
            continue
        }

        unmatchedMembers.push({
            displayName: getMemberDisplayName(member),
        })
    }

    return {
        configured: true,
        githubContributorCount: contributors.length,
        matchedContributors: [...matchedContributors.values()],
        matchedMemberCount,
        totalMemberCount: members.length,
        unmatchedMembers,
    }
}

interface ShareProgressInput {
    currentStreak: number
    githubHandle?: string
    name?: string | null
    recentCommitCount: number
    topRepoName?: string
}

export async function shareLeaderboardToDiscord(contributors: GitHubContributor[]) {
    const appUrl = getAppUrl()
    const topContributors = contributors.slice(0, 5)
    const leaderboardText = topContributors.length > 0
        ? topContributors
            .map((contributor, index) => `${index + 1}. @${contributor.username} - ${contributor.commits} commits`)
            .join("\n")
        : "No leaderboard data yet. Sign into CodeStreak and push a commit to get ranked."

    return sendDiscordChannelMessage({
        content: "The CodeStreak leaderboard was shared from the dashboard.",
        embeds: [
            {
                color: 0x0f766e,
                description: leaderboardText,
                fields: [
                    {
                        inline: false,
                        name: "How to join",
                        value: "Sign into CodeStreak with GitHub and keep your commits moving.",
                    },
                ],
                title: "CodeStreak Leaderboard",
                url: appUrl,
            },
        ],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 5,
                        label: "Open CodeStreak",
                        url: appUrl,
                    },
                ],
            },
        ],
    })
}

export async function shareProgressToDiscord({
    currentStreak,
    githubHandle,
    name,
    recentCommitCount,
    topRepoName,
}: ShareProgressInput) {
    const appUrl = getAppUrl()
    const displayName = name || githubHandle || "A CodeStreak member"
    const streakText = `${currentStreak} day${currentStreak === 1 ? "" : "s"}`
    const commitText = `${recentCommitCount} commit${recentCommitCount === 1 ? "" : "s"}`

    return sendDiscordChannelMessage({
        content: `${displayName} shared a CodeStreak progress update.`,
        embeds: [
            {
                color: 0xf97316,
                description: "Small commits compound. Keep the streak moving with the club.",
                fields: [
                    {
                        inline: true,
                        name: "Current streak",
                        value: streakText,
                    },
                    {
                        inline: true,
                        name: "Last 7 days",
                        value: commitText,
                    },
                    {
                        inline: true,
                        name: "Top repo",
                        value: topRepoName ?? "No recent repo yet",
                    },
                    {
                        inline: false,
                        name: "GitHub",
                        value: githubHandle ? `@${githubHandle}` : "GitHub profile connected",
                    },
                ],
                title: `${displayName} checked in on CodeStreak`,
                url: appUrl,
            },
        ],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 5,
                        label: "Open CodeStreak",
                        url: appUrl,
                    },
                ],
            },
        ],
    })
}
