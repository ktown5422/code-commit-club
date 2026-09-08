import { afterAll, beforeEach, describe, expect, it } from "vitest"

import { prisma } from "@/lib/db"
import {
    DEFAULT_SETTINGS,
    getChecklistForDay,
    getMemberSettings,
    getOrCreateUser,
    saveChecklistForDay,
    saveMemberSettings,
    toDayKey,
} from "@/lib/member-store"

// Integration tests: these run against a real Postgres (a service container in
// CI, a local database otherwise) because the behaviour worth testing here is
// the upsert and constraint handling, which a mock would not exercise.
const identity = {
    email: "test@example.com",
    githubLogin: "codestreak-test-fixture",
    imageUrl: null,
    name: "Test Fixture",
}

async function removeFixture() {
    await prisma.user.deleteMany({ where: { githubLogin: identity.githubLogin } })
}

beforeEach(removeFixture)

afterAll(async () => {
    await removeFixture()
    await prisma.$disconnect()
})

describe("getOrCreateUser", () => {
    it("creates the member on first call and reuses the row afterwards", async () => {
        const first = await getOrCreateUser(identity)
        const second = await getOrCreateUser(identity)

        expect(second.id).toBe(first.id)
        expect(await prisma.user.count({ where: { githubLogin: identity.githubLogin } })).toBe(1)
    })

    it("refreshes profile fields that changed on GitHub", async () => {
        await getOrCreateUser(identity)
        await getOrCreateUser({ ...identity, name: "Renamed Fixture" })

        const stored = await prisma.user.findUnique({
            select: { name: true },
            where: { githubLogin: identity.githubLogin },
        })

        expect(stored?.name).toBe("Renamed Fixture")
    })
})

describe("member settings", () => {
    it("falls back to defaults before anything is saved", async () => {
        expect(await getMemberSettings(identity)).toEqual(DEFAULT_SETTINGS)
    })

    it("saves and reads back a change", async () => {
        await saveMemberSettings(identity, { weeklyCommitTarget: 12 })

        const settings = await getMemberSettings(identity)
        expect(settings.weeklyCommitTarget).toBe(12)
        // Untouched fields keep their defaults rather than being nulled out.
        expect(settings.weeklyChallengeGoal).toBe(DEFAULT_SETTINGS.weeklyChallengeGoal)
    })

    it("merges successive partial updates instead of replacing the row", async () => {
        await saveMemberSettings(identity, { weeklyCommitTarget: 10 })
        await saveMemberSettings(identity, { activeRepoTarget: 5 })

        const settings = await getMemberSettings(identity)
        expect(settings.weeklyCommitTarget).toBe(10)
        expect(settings.activeRepoTarget).toBe(5)
    })

    it("clamps values outside the range the UI allows", async () => {
        const saved = await saveMemberSettings(identity, {
            activeRepoTarget: 0,
            weeklyChallengeGoal: 999999,
            weeklyCommitTarget: 9999,
        })

        expect(saved.weeklyCommitTarget).toBe(50)
        expect(saved.activeRepoTarget).toBe(1)
        expect(saved.weeklyChallengeGoal).toBe(5000)
    })

    it("rejects a non-numeric target rather than storing NaN", async () => {
        const saved = await saveMemberSettings(identity, {
            weeklyCommitTarget: Number.NaN,
        })

        expect(saved.weeklyCommitTarget).toBe(1)
    })

    it("clears the focus repo when given an empty string", async () => {
        await saveMemberSettings(identity, { focusRepoFullName: "octocat/hello-world" })
        const cleared = await saveMemberSettings(identity, { focusRepoFullName: "" })

        expect(cleared.focusRepoFullName).toBeNull()
    })
})

describe("daily checklist", () => {
    const day = toDayKey(new Date("2026-03-15T12:00:00.000Z"))

    it("returns nothing for a day with no entry", async () => {
        expect(await getChecklistForDay(identity, day)).toEqual([])
    })

    it("keeps a single row per member per day", async () => {
        await saveChecklistForDay(identity, day, ["choose-task"])
        await saveChecklistForDay(identity, day, ["choose-task", "make-change"])

        const user = await getOrCreateUser(identity)
        const rows = await prisma.checklistDay.count({ where: { userId: user.id } })

        expect(rows).toBe(1)
        expect(await getChecklistForDay(identity, day)).toEqual(["choose-task", "make-change"])
    })

    it("keeps separate days apart", async () => {
        const otherDay = toDayKey(new Date("2026-03-16T12:00:00.000Z"))
        await saveChecklistForDay(identity, day, ["choose-task"])
        await saveChecklistForDay(identity, otherDay, ["share-discord"])

        expect(await getChecklistForDay(identity, day)).toEqual(["choose-task"])
        expect(await getChecklistForDay(identity, otherDay)).toEqual(["share-discord"])
    })

    it("drops duplicate items", async () => {
        const saved = await saveChecklistForDay(identity, day, [
            "choose-task",
            "choose-task",
            "make-change",
        ])

        expect(saved).toEqual(["choose-task", "make-change"])
    })

    it("removes the member's rows when the member is deleted", async () => {
        await saveChecklistForDay(identity, day, ["choose-task"])
        await saveMemberSettings(identity, { weeklyCommitTarget: 9 })
        const user = await getOrCreateUser(identity)

        await prisma.user.delete({ where: { id: user.id } })

        // Cascade is declared on the relation; this proves it is actually on.
        expect(await prisma.checklistDay.count({ where: { userId: user.id } })).toBe(0)
        expect(await prisma.userSettings.count({ where: { userId: user.id } })).toBe(0)
    })
})
