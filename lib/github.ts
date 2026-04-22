import { Octokit } from "octokit"

const RECENT_DAYS = 7
const HEATMAP_WEEKS = 6
const HEATMAP_DAYS = HEATMAP_WEEKS * 7
const MAX_REPOS = 5
const MAX_LEADERBOARD_SIZE = 5
const MAX_FOLLOWING_TO_CHECK = 12

export interface GitHubProfileInfo {
    avatarUrl: string
    bio: string | null
    followers: number
    following: number
    login: string
    name: string | null
    publicRepos: number
    totalStars: number
}

export interface GitHubRepoSummary {
    defaultBranch: string
    fullName: string
    name: string
    owner: string
    private: boolean
    pushedAt: string
    stars: number
}

export interface GitHubContributor {
    avatarUrl: string
    commits: number
    username: string
}

export interface LastCommitInfo {
    branch: string
    date: string
    message: string
    repo: string
    sha: string
    url: string
}

export interface CommitActivityPoint {
    count: number
    date: string
}

export interface CommitHeatmapDay {
    count: number
    date: string
}

export interface CommitTimeWindow {
    commits: number
    label: string
}

export interface CommitTimeInsight {
    bestWindow: CommitTimeWindow
    totalCommits: number
    windows: CommitTimeWindow[]
}

export interface GitHubDashboardData {
    commitActivity: CommitActivityPoint[]
    commitHeatmap: CommitHeatmapDay[]
    commitTimeInsight: CommitTimeInsight
    currentStreak: number
    followingContributors: GitHubContributor[]
    lastCommit: LastCommitInfo | null
    longestStreak: number
    profile: GitHubProfileInfo
    recentCommitCount: number
    repos: GitHubRepoSummary[]
    topContributors: GitHubContributor[]
}

function createOctokit(accessToken: string) {
    return new Octokit({ auth: accessToken })
}

export async function getViewerRepos(accessToken: string): Promise<GitHubRepoSummary[]> {
    const octokit = createOctokit(accessToken)

    const repos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
        affiliation: "owner",
        per_page: 100,
        sort: "updated",
    })

    return repos.map((repo) => ({
        defaultBranch: repo.default_branch,
        fullName: repo.full_name,
        name: repo.name,
        owner: repo.owner.login,
        private: repo.private,
        pushedAt: repo.pushed_at ?? repo.updated_at ?? new Date(0).toISOString(),
        stars: repo.stargazers_count,
    }))
}

export async function getProfileInfo(accessToken: string, repos?: GitHubRepoSummary[]): Promise<GitHubProfileInfo> {
    const octokit = createOctokit(accessToken)
    const { data: user } = await octokit.rest.users.getAuthenticated()
    const repoList = repos ?? await getViewerRepos(accessToken)

    return {
        avatarUrl: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        login: user.login,
        name: user.name,
        publicRepos: user.public_repos,
        totalStars: repoList.reduce((total, repo) => total + repo.stars, 0),
    }
}

export async function getRepoContributors(
    accessToken: string,
    owner: string,
    repo: string
): Promise<GitHubContributor[]> {
    const octokit = createOctokit(accessToken)
    const contributors = await octokit.paginate(octokit.rest.repos.listContributors, {
        owner,
        repo,
        per_page: 100,
    })

    return contributors.map((contributor) => ({
        avatarUrl: contributor.avatar_url ?? "",
        commits: contributor.contributions,
        username: contributor.login ?? "unknown",
    }))
}

export async function getUserCommitActivity(
    accessToken: string,
    owner: string,
    repo: string,
    author: string,
    since: string
): Promise<string[]> {
    const octokit = createOctokit(accessToken)
    const commits = await octokit.paginate(octokit.rest.repos.listCommits, {
        author,
        owner,
        per_page: 100,
        repo,
        since,
    })

    return commits
        .map((commit) => commit.commit.author?.date)
        .filter((date): date is string => Boolean(date))
}

export async function getLatestUserCommit(
    accessToken: string,
    repos: GitHubRepoSummary[],
    author: string
): Promise<LastCommitInfo | null> {
    const octokit = createOctokit(accessToken)
    const latestCommits = await Promise.all(
        repos.map(async (repo) => {
            try {
                const { data: commits } = await octokit.rest.repos.listCommits({
                    author,
                    owner: repo.owner,
                    per_page: 1,
                    repo: repo.name,
                })
                const commit = commits[0]
                const date = commit?.commit.author?.date ?? commit?.commit.committer?.date

                if (!commit || !date) {
                    return null
                }

                return {
                    branch: repo.defaultBranch,
                    date,
                    message: commit.commit.message,
                    repo: repo.fullName,
                    sha: commit.sha,
                    url: commit.html_url,
                }
            } catch (error) {
                console.error(`Failed to load latest commit for ${repo.fullName}`, error)
                return null
            }
        })
    )

    return latestCommits
        .filter((commit): commit is LastCommitInfo => Boolean(commit))
        .sort((left, right) => +new Date(right.date) - +new Date(left.date))[0] ?? null
}

export async function buildLeaderboard(
    accessToken: string,
    repos: GitHubRepoSummary[]
): Promise<GitHubContributor[]> {
    const contributorTotals = new Map<string, GitHubContributor>()

    const contributorLists = await Promise.all(
        repos.slice(0, MAX_REPOS).map((repo) => getRepoContributors(accessToken, repo.owner, repo.name))
    )

    for (const contributors of contributorLists) {
        for (const contributor of contributors) {
            const existing = contributorTotals.get(contributor.username)

            if (existing) {
                existing.commits += contributor.commits
                continue
            }

            contributorTotals.set(contributor.username, { ...contributor })
        }
    }

    return [...contributorTotals.values()]
        .sort((left, right) => right.commits - left.commits)
        .slice(0, MAX_LEADERBOARD_SIZE)
}

function getPushCommitCount(payload: unknown) {
    if (!payload || typeof payload !== "object") {
        return 0
    }

    if ("size" in payload && typeof payload.size === "number") {
        return payload.size
    }

    if ("commits" in payload && Array.isArray(payload.commits)) {
        return payload.commits.length
    }

    return 0
}

export async function buildFollowingLeaderboard(
    accessToken: string,
    username: string,
    since: string
): Promise<GitHubContributor[]> {
    const octokit = createOctokit(accessToken)
    const { data: following } = await octokit.rest.users.listFollowingForUser({
        per_page: MAX_FOLLOWING_TO_CHECK,
        username,
    })
    const sinceTime = +new Date(since)

    const followedContributors = await Promise.all(
        following.map(async (user) => {
            const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
                per_page: 30,
                username: user.login,
            })

            const commits = events.reduce((total, event) => {
                if (event.type !== "PushEvent" || !event.created_at) {
                    return total
                }

                if (+new Date(event.created_at) < sinceTime) {
                    return total
                }

                return total + getPushCommitCount(event.payload)
            }, 0)

            return {
                avatarUrl: user.avatar_url ?? "",
                commits,
                username: user.login,
            }
        })
    )

    return followedContributors
        .filter((contributor) => contributor.commits > 0)
        .sort((left, right) => right.commits - left.commits)
        .slice(0, MAX_LEADERBOARD_SIZE)
}

function getRecentDate(days: number) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
}

function getHeatmapStartDate() {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - date.getDay() - (HEATMAP_WEEKS - 1) * 7)
    return date
}

function formatDateKey(date: Date) {
    return date.toISOString().slice(0, 10)
}

function formatDayLabel(date: Date) {
    return date.toLocaleDateString("en-US", { weekday: "short" })
}

function buildActivitySeries(commitDates: string[]) {
    const today = new Date()
    const buckets = Array.from({ length: RECENT_DAYS }, (_, index) => {
        const date = new Date(today)
        date.setDate(today.getDate() - (RECENT_DAYS - index - 1))

        return {
            count: 0,
            date: formatDayLabel(date),
            key: formatDateKey(date),
        }
    })

    for (const commitDate of commitDates) {
        const key = formatDateKey(new Date(commitDate))
        const bucket = buckets.find((entry) => entry.key === key)

        if (bucket) {
            bucket.count += 1
        }
    }

    return buckets.map(({ count, date }) => ({ count, date }))
}

function buildHeatmapSeries(commitDates: string[]) {
    const startDate = getHeatmapStartDate()
    const buckets = Array.from({ length: HEATMAP_DAYS }, (_, index) => {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + index)

        return {
            count: 0,
            date: formatDateKey(date),
        }
    })
    const bucketMap = new Map(buckets.map((bucket) => [bucket.date, bucket]))

    for (const commitDate of commitDates) {
        const key = formatDateKey(new Date(commitDate))
        const bucket = bucketMap.get(key)

        if (bucket) {
            bucket.count += 1
        }
    }

    return buckets
}

function getTimeWindowLabel(date: Date) {
    const hour = date.getHours()

    if (hour >= 6 && hour < 12) {
        return "Morning"
    }

    if (hour >= 12 && hour < 17) {
        return "Afternoon"
    }

    if (hour >= 17 && hour < 22) {
        return "Evening"
    }

    return "Late night"
}

function buildCommitTimeInsight(commitDates: string[]): CommitTimeInsight {
    const windows: CommitTimeWindow[] = [
        { commits: 0, label: "Morning" },
        { commits: 0, label: "Afternoon" },
        { commits: 0, label: "Evening" },
        { commits: 0, label: "Late night" },
    ]

    for (const commitDate of commitDates) {
        const label = getTimeWindowLabel(new Date(commitDate))
        const window = windows.find((entry) => entry.label === label)

        if (window) {
            window.commits += 1
        }
    }

    return {
        bestWindow: [...windows].sort((left, right) => right.commits - left.commits)[0],
        totalCommits: commitDates.length,
        windows,
    }
}

function calculateCurrentStreak(activity: CommitActivityPoint[]) {
    let streak = 0

    for (let index = activity.length - 1; index >= 0; index -= 1) {
        if (activity[index].count > 0) {
            streak += 1
            continue
        }

        break
    }

    return streak
}

function calculateLongestStreak(activity: CommitActivityPoint[]) {
    let longest = 0
    let current = 0

    for (const day of activity) {
        if (day.count > 0) {
            current += 1
            longest = Math.max(longest, current)
            continue
        }

        current = 0
    }

    return longest
}

export async function getGitHubDashboardData(accessToken: string): Promise<GitHubDashboardData> {
    const repos = (await getViewerRepos(accessToken))
        .sort((left, right) => +new Date(right.pushedAt) - +new Date(left.pushedAt))
        .slice(0, MAX_REPOS)

    const profile = await getProfileInfo(accessToken, repos)
    const heatmapSince = getHeatmapStartDate().toISOString()
    const recentSince = getRecentDate(RECENT_DAYS - 1).toISOString()

    const commitDates = (
        await Promise.all(
            repos.map((repo) =>
                getUserCommitActivity(accessToken, repo.owner, repo.name, profile.login, heatmapSince)
            )
        )
    ).flat()

    const commitActivity = buildActivitySeries(commitDates)
    const commitHeatmap = buildHeatmapSeries(commitDates)
    const commitTimeInsight = buildCommitTimeInsight(commitDates)
    const lastCommit = await getLatestUserCommit(accessToken, repos, profile.login)
    const topContributors = await buildLeaderboard(accessToken, repos)
    let followingContributors: GitHubContributor[] = []

    try {
        followingContributors = await buildFollowingLeaderboard(accessToken, profile.login, recentSince)
    } catch (error) {
        console.error("Failed to build GitHub following leaderboard", error)
    }

    return {
        commitActivity,
        commitHeatmap,
        commitTimeInsight,
        currentStreak: calculateCurrentStreak(commitActivity),
        followingContributors,
        lastCommit,
        longestStreak: calculateLongestStreak(commitActivity),
        profile,
        recentCommitCount: commitDates.length,
        repos,
        topContributors,
    }
}
