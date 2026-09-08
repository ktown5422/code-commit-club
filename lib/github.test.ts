import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { buildCommitTimeInsight, calculateStreaks, type ContributionDay } from "@/lib/github"

// Streak keys are derived with toISOString(), so a midday UTC instant pins "today"
// to the same calendar date no matter what timezone CI runs in.
const TODAY = "2026-03-15"

function days(entries: Array<[string, number]>): ContributionDay[] {
    return entries.map(([date, count]) => ({ count, date }))
}

describe("calculateStreaks", () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(`${TODAY}T12:00:00.000Z`))
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("counts a run of commit days ending today", () => {
        const result = calculateStreaks(days([
            ["2026-03-11", 0],
            ["2026-03-12", 3],
            ["2026-03-13", 1],
            ["2026-03-14", 2],
            ["2026-03-15", 1],
        ]))

        expect(result.current).toBe(4)
        expect(result.longest).toBe(4)
    })

    it("keeps the streak alive when today has no commits yet", () => {
        const result = calculateStreaks(days([
            ["2026-03-12", 2],
            ["2026-03-13", 1],
            ["2026-03-14", 4],
            ["2026-03-15", 0],
        ]))

        // Today isn't over, so an empty today pauses the streak rather than ending it.
        expect(result.current).toBe(3)
    })

    it("breaks the streak on a gap before today", () => {
        const result = calculateStreaks(days([
            ["2026-03-12", 5],
            ["2026-03-13", 0],
            ["2026-03-14", 1],
            ["2026-03-15", 1],
        ]))

        expect(result.current).toBe(2)
    })

    it("ignores days dated after today", () => {
        const result = calculateStreaks(days([
            ["2026-03-14", 1],
            ["2026-03-15", 1],
            ["2026-03-16", 9],
            ["2026-03-17", 9],
        ]))

        expect(result.current).toBe(2)
        expect(result.longest).toBe(2)
    })

    it("reports the longest historical run even when it is over", () => {
        const result = calculateStreaks(days([
            ["2026-03-09", 1],
            ["2026-03-10", 1],
            ["2026-03-11", 1],
            ["2026-03-12", 1],
            ["2026-03-13", 0],
            ["2026-03-14", 1],
            ["2026-03-15", 1],
        ]))

        expect(result.current).toBe(2)
        expect(result.longest).toBe(4)
    })

    it("returns zeroes for an empty calendar", () => {
        expect(calculateStreaks([])).toEqual({ current: 0, longest: 0 })
    })

    it("returns zeroes when nothing was ever committed", () => {
        const result = calculateStreaks(days([
            ["2026-03-13", 0],
            ["2026-03-14", 0],
            ["2026-03-15", 0],
        ]))

        expect(result).toEqual({ current: 0, longest: 0 })
    })
})

describe("buildCommitTimeInsight", () => {
    // Built from local clock components, since the window bucketing uses getHours().
    function localIso(hour: number) {
        return new Date(2026, 2, 15, hour, 30).toISOString()
    }

    it("buckets commits into the window that saw the most activity", () => {
        const insight = buildCommitTimeInsight([
            localIso(9),
            localIso(20),
            localIso(21),
            localIso(23),
            localIso(21),
        ])

        expect(insight.totalCommits).toBe(5)
        expect(insight.bestWindow.label).toBe("Evening")
        expect(insight.bestWindow.commits).toBe(3)
    })

    it("labels each window boundary correctly", () => {
        const labelFor = (hour: number) =>
            buildCommitTimeInsight([localIso(hour)]).bestWindow.label

        expect(labelFor(6)).toBe("Morning")
        expect(labelFor(11)).toBe("Morning")
        expect(labelFor(12)).toBe("Afternoon")
        expect(labelFor(16)).toBe("Afternoon")
        expect(labelFor(17)).toBe("Evening")
        expect(labelFor(21)).toBe("Evening")
        expect(labelFor(22)).toBe("Late night")
        expect(labelFor(3)).toBe("Late night")
    })

    it("always reports all four windows, even with no commits", () => {
        const insight = buildCommitTimeInsight([])

        expect(insight.totalCommits).toBe(0)
        expect(insight.windows.map((window) => window.label)).toEqual([
            "Morning",
            "Afternoon",
            "Evening",
            "Late night",
        ])
        expect(insight.windows.every((window) => window.commits === 0)).toBe(true)
    })
})
