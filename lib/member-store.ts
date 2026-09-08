import { prisma } from "@/lib/db"

export interface MemberSettings {
    activeRepoTarget: number
    focusRepoFullName: string | null
    weeklyChallengeGoal: number
    weeklyCommitTarget: number
}

export interface MemberIdentity {
    email?: string | null
    githubLogin: string
    imageUrl?: string | null
    name?: string | null
}

export const DEFAULT_SETTINGS: MemberSettings = {
    activeRepoTarget: 3,
    focusRepoFullName: null,
    weeklyChallengeGoal: 250,
    weeklyCommitTarget: 7,
}

// The UI offers steppers, but a request can carry anything, so every numeric
// target is clamped here rather than trusting whatever the client posted.
const LIMITS = {
    activeRepoTarget: { max: 20, min: 1 },
    weeklyChallengeGoal: { max: 5000, min: 50 },
    weeklyCommitTarget: { max: 50, min: 1 },
} as const

function clamp(value: number, { max, min }: { max: number; min: number }) {
    if (!Number.isFinite(value)) {
        return min
    }

    return Math.min(Math.max(Math.round(value), min), max)
}

// `day` is a calendar date, not an instant. Postgres stores it as DATE, so it
// is pinned to UTC midnight to keep one row per user per day.
export function toDayKey(date = new Date()) {
    return date.toISOString().slice(0, 10)
}

function toDayDate(dayKey: string) {
    return new Date(`${dayKey}T00:00:00.000Z`)
}

// Request-level deduplication happens in app/dashboard/data.ts, which is where
// the request scope actually is; keeping this plain makes the store testable.
export async function getOrCreateUser(identity: MemberIdentity) {
    const profile = {
        email: identity.email ?? null,
        imageUrl: identity.imageUrl ?? null,
        name: identity.name ?? null,
    }

    return prisma.user.upsert({
        create: { githubLogin: identity.githubLogin, ...profile },
        select: { id: true },
        update: profile,
        where: { githubLogin: identity.githubLogin },
    })
}

export async function getMemberSettings(identity: MemberIdentity): Promise<MemberSettings> {
    const user = await getOrCreateUser(identity)
    const settings = await prisma.userSettings.findUnique({
        select: {
            activeRepoTarget: true,
            focusRepoFullName: true,
            weeklyChallengeGoal: true,
            weeklyCommitTarget: true,
        },
        where: { userId: user.id },
    })

    return settings ?? DEFAULT_SETTINGS
}

export async function saveMemberSettings(
    identity: MemberIdentity,
    patch: Partial<MemberSettings>
): Promise<MemberSettings> {
    const user = await getOrCreateUser(identity)
    const values: Partial<MemberSettings> = {}

    if (patch.weeklyCommitTarget !== undefined) {
        values.weeklyCommitTarget = clamp(patch.weeklyCommitTarget, LIMITS.weeklyCommitTarget)
    }

    if (patch.activeRepoTarget !== undefined) {
        values.activeRepoTarget = clamp(patch.activeRepoTarget, LIMITS.activeRepoTarget)
    }

    if (patch.weeklyChallengeGoal !== undefined) {
        values.weeklyChallengeGoal = clamp(patch.weeklyChallengeGoal, LIMITS.weeklyChallengeGoal)
    }

    if (patch.focusRepoFullName !== undefined) {
        values.focusRepoFullName = patch.focusRepoFullName || null
    }

    const saved = await prisma.userSettings.upsert({
        create: { ...DEFAULT_SETTINGS, ...values, userId: user.id },
        select: {
            activeRepoTarget: true,
            focusRepoFullName: true,
            weeklyChallengeGoal: true,
            weeklyCommitTarget: true,
        },
        update: values,
        where: { userId: user.id },
    })

    return saved
}

export async function getChecklistForDay(
    identity: MemberIdentity,
    dayKey: string
): Promise<string[]> {
    const user = await getOrCreateUser(identity)
    const entry = await prisma.checklistDay.findUnique({
        select: { completedItems: true },
        where: { userId_day: { day: toDayDate(dayKey), userId: user.id } },
    })

    return entry?.completedItems ?? []
}

export async function saveChecklistForDay(
    identity: MemberIdentity,
    dayKey: string,
    completedItems: string[]
): Promise<string[]> {
    const user = await getOrCreateUser(identity)
    const items = [...new Set(completedItems)].filter((item) => item.length > 0 && item.length <= 64)
    const day = toDayDate(dayKey)

    const saved = await prisma.checklistDay.upsert({
        create: { completedItems: items, day, userId: user.id },
        select: { completedItems: true },
        update: { completedItems: items },
        where: { userId_day: { day, userId: user.id } },
    })

    return saved.completedItems
}
