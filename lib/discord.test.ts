import { describe, expect, it } from "vitest"

import { collectMemberAliases, getWeekKey, normalizeHandle, seededShuffle } from "@/lib/discord"

describe("normalizeHandle", () => {
    it("lowercases and strips a leading @", () => {
        expect(normalizeHandle("@Octocat")).toBe("octocat")
    })

    it("keeps hyphens, which are legal in GitHub handles", () => {
        expect(normalizeHandle("Alex-Smith")).toBe("alex-smith")
    })

    it("drops characters GitHub handles cannot contain", () => {
        expect(normalizeHandle("kevin.townson!")).toBe("kevintownson")
    })

    it("trims surrounding whitespace", () => {
        expect(normalizeHandle("  ktown5422  ")).toBe("ktown5422")
    })
})

describe("collectMemberAliases", () => {
    it("collects username, global name, and server nickname", () => {
        const aliases = collectMemberAliases({
            nick: "kt-dev",
            user: { global_name: "Kevin T", id: "1", username: "ktown5422" },
        })

        expect(aliases).toContain("ktown5422")
        expect(aliases).toContain("kevint")
        expect(aliases).toContain("kt-dev")
    })

    it("extracts a GitHub handle mentioned inside a display name", () => {
        const aliases = collectMemberAliases({
            nick: "Kevin (@ktown5422)",
            user: { id: "1", username: "someoneelse" },
        })

        expect(aliases).toContain("ktown5422")
    })

    it("ignores missing name fields without throwing", () => {
        expect(collectMemberAliases({ user: { id: "1", username: "solo" } })).toEqual(["solo"])
        expect(collectMemberAliases({})).toEqual([])
    })
})

describe("getWeekKey", () => {
    it("gives every day of the same ISO week the same key", () => {
        const monday = getWeekKey(new Date("2026-03-09T00:00:00.000Z"))
        const sunday = getWeekKey(new Date("2026-03-15T23:59:59.000Z"))

        expect(monday).toBe(sunday)
    })

    it("rolls over to a new key on Monday", () => {
        const sunday = getWeekKey(new Date("2026-03-15T12:00:00.000Z"))
        const monday = getWeekKey(new Date("2026-03-16T12:00:00.000Z"))

        expect(monday).not.toBe(sunday)
    })

    it("formats as <year>-W<week>", () => {
        expect(getWeekKey(new Date("2026-03-15T12:00:00.000Z"))).toMatch(/^\d{4}-W\d{1,2}$/)
    })
})

describe("seededShuffle", () => {
    const members = ["a", "b", "c", "d", "e", "f"]
    const identity = (value: string) => value

    it("is stable for the same seed, so pairings hold all week", () => {
        const first = seededShuffle(members, "2026-W12", identity)
        const second = seededShuffle(members, "2026-W12", identity)

        expect(first).toEqual(second)
    })

    it("produces a different order for a different week", () => {
        const week12 = seededShuffle(members, "2026-W12", identity)
        const week13 = seededShuffle(members, "2026-W13", identity)

        expect(week13).not.toEqual(week12)
    })

    it("reshuffles week over week for realistic Discord snowflake ids", () => {
        // Regression guard: a hash where the seed is only a constant offset sorts
        // these near-identical, equal-length ids the same way every single week.
        const ids = [
            "281474976710655",
            "281474976710700",
            "281474976710912",
            "391474976710655",
            "481474976710655",
            "581474976710655",
        ]

        const orderings = new Set(
            Array.from({ length: 20 }, (_, index) =>
                seededShuffle(ids, `2026-W${index + 1}`, identity).join(",")
            )
        )

        expect(orderings.size).toBeGreaterThan(10)
    })

    it("is a permutation — nobody is dropped or duplicated", () => {
        const shuffled = seededShuffle(members, "2026-W12", identity)

        expect([...shuffled].sort()).toEqual([...members].sort())
    })

    it("does not mutate the input array", () => {
        const original = [...members]
        seededShuffle(members, "2026-W12", identity)

        expect(members).toEqual(original)
    })
})
