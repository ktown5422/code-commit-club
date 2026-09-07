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

export interface ContributionDay {
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

interface ContributionCalendarQuery {
    viewer: {
        contributionsCollection: {
            contributionCalendar: {
                weeks: Array<{
                    contributionDays: Array<{
                        contributionCount: number
                        date: string
                    }>
                }>
            }
        }
        login: string
    }
}

export async function getContributionCalendar(
    accessToken: string
): Promise<{ days: ContributionDay[]; login: string }> {
    const octokit = createOctokit(accessToken)
    const response = await octokit.graphql<ContributionCalendarQuery>(`
        query {
            viewer {
                login
                contributionsCollection {
                    contributionCalendar {
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                            }
                        }
                    }
                }
            }
        }
    `)

    const days = response.viewer.contributionsCollection.contributionCalendar.weeks
        .flatMap((week) => week.contributionDays)
        .map((day) => ({ count: day.contributionCount, date: day.date }))
        .sort((left, right) => left.date.localeCompare(right.date))

    return { days, login: response.viewer.login }
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
        .sort((left, right) => Date.parse(right.date) - Date.parse(left.date))[0] ?? null
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
    const sinceTime = Date.parse(since)

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

function buildActivitySeries(contributionDays: ContributionDay[]): CommitActivityPoint[] {
    const countsByDate = new Map(contributionDays.map((day) => [day.date, day.count]))
    const today = new Date()

    return Array.from({ length: RECENT_DAYS }, (_, index) => {
        const date = new Date(today)
        date.setDate(today.getDate() - (RECENT_DAYS - index - 1))

        return {
            count: countsByDate.get(formatDateKey(date)) ?? 0,
            date: formatDayLabel(date),
        }
    })
}

function buildHeatmapSeries(contributionDays: ContributionDay[]): CommitHeatmapDay[] {
    const countsByDate = new Map(contributionDays.map((day) => [day.date, day.count]))
    const startDate = getHeatmapStartDate()

    return Array.from({ length: HEATMAP_DAYS }, (_, index) => {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + index)
        const key = formatDateKey(date)

        return {
            count: countsByDate.get(key) ?? 0,
            date: key,
        }
    })
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
    const windowMap = new Map(windows.map((window) => [window.label, window]))

    for (const commitDate of commitDates) {
        const label = getTimeWindowLabel(new Date(commitDate))
        const window = windowMap.get(label)

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

export function calculateStreaks(contributionDays: ContributionDay[]) {
    const todayKey = formatDateKey(new Date())
    let longest = 0
    let run = 0

    for (const day of contributionDays) {
        if (day.date > todayKey) {
            break
        }

        if (day.count > 0) {
            run += 1
            longest = Math.max(longest, run)
            continue
        }

        run = 0
    }

    let index = contributionDays.length - 1

    while (index >= 0 && contributionDays[index].date > todayKey) {
        index -= 1
    }

    // Today isn't over yet — an empty today pauses the streak instead of breaking it.
    if (index >= 0 && contributionDays[index].date === todayKey && contributionDays[index].count === 0) {
        index -= 1
    }

    let current = 0

    for (; index >= 0; index -= 1) {
        if (contributionDays[index].count === 0) {
            break
        }

        current += 1
    }

    return { current, longest: Math.max(longest, current) }
}

export async function getGitHubDashboardData(accessToken: string): Promise<GitHubDashboardData> {
    const [allRepos, calendar] = await Promise.all([
        getViewerRepos(accessToken),
        getContributionCalendar(accessToken),
    ])
    const repos = allRepos
        .sort((left, right) => Date.parse(right.pushedAt) - Date.parse(left.pushedAt))
        .slice(0, MAX_REPOS)

    const heatmapSince = getHeatmapStartDate().toISOString()
    const recentSince = getRecentDate(RECENT_DAYS - 1).toISOString()

    const [profile, commitDatesByRepo, lastCommit, topContributors, followingContributors] = await Promise.all([
        getProfileInfo(accessToken, allRepos),
        Promise.all(
            repos.map((repo) =>
                getUserCommitActivity(accessToken, repo.owner, repo.name, calendar.login, heatmapSince)
            )
        ),
        getLatestUserCommit(accessToken, repos, calendar.login),
        buildLeaderboard(accessToken, repos),
        buildFollowingLeaderboard(accessToken, calendar.login, recentSince).catch((error) => {
            console.error("Failed to build GitHub following leaderboard", error)
            return [] as GitHubContributor[]
        }),
    ])

    const commitDates = commitDatesByRepo.flat()
    const commitActivity = buildActivitySeries(calendar.days)
    const streaks = calculateStreaks(calendar.days)

    return {
        commitActivity,
        commitHeatmap: buildHeatmapSeries(calendar.days),
        commitTimeInsight: buildCommitTimeInsight(commitDates),
        currentStreak: streaks.current,
        followingContributors,
        lastCommit,
        longestStreak: streaks.longest,
        profile,
        recentCommitCount: commitActivity.reduce((total, day) => total + day.count, 0),
        repos,
        topContributors,
    }
}
