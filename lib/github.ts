import { Octokit } from "octokit"

const RECENT_DAYS = 7
const MAX_REPOS = 5
const MAX_LEADERBOARD_SIZE = 5

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

export interface CommitActivityPoint {
    count: number
    date: string
}

export interface GitHubDashboardData {
    commitActivity: CommitActivityPoint[]
    currentStreak: number
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

function getRecentDate(days: number) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
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
            key: date.toISOString().slice(0, 10),
        }
    })

    for (const commitDate of commitDates) {
        const key = new Date(commitDate).toISOString().slice(0, 10)
        const bucket = buckets.find((entry) => entry.key === key)

        if (bucket) {
            bucket.count += 1
        }
    }

    return buckets.map(({ count, date }) => ({ count, date }))
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
    const since = getRecentDate(RECENT_DAYS - 1).toISOString()

    const commitDates = (
        await Promise.all(
            repos.map((repo) =>
                getUserCommitActivity(accessToken, repo.owner, repo.name, profile.login, since)
            )
        )
    ).flat()

    const commitActivity = buildActivitySeries(commitDates)
    const topContributors = await buildLeaderboard(accessToken, repos)

    return {
        commitActivity,
        currentStreak: calculateCurrentStreak(commitActivity),
        longestStreak: calculateLongestStreak(commitActivity),
        profile,
        recentCommitCount: commitDates.length,
        repos,
        topContributors,
    }
}
