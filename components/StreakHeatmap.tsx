import { CalendarDays } from "lucide-react"

import type { CommitHeatmapDay } from "@/lib/github"
import { Card, CardContent } from "@/styleguide/components/ui/card"
import { cn } from "@/lib/utils"

interface StreakHeatmapProps {
    data: CommitHeatmapDay[]
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getIntensityClass(count: number, isFuture: boolean) {
    if (isFuture) {
        return "bg-[#f1f5f9] border-[#e2e8f0]"
    }

    if (count === 0) {
        return "bg-[#e5e7eb] border-[#d1d5db]"
    }

    if (count < 2) {
        return "bg-[#fed7aa] border-[#fdba74]"
    }

    if (count < 4) {
        return "bg-[#fb923c] border-[#f97316]"
    }

    return "bg-[#0f766e] border-[#0f766e]"
}

function getDateTextClass(count: number, isFuture: boolean) {
    if (isFuture) {
        return "text-[#94a3b8]"
    }

    if (count >= 4) {
        return "text-white"
    }

    if (count >= 2) {
        return "text-[#431407]"
    }

    return "text-[#334155]"
}

function getDayNumber(value: string) {
    return new Date(`${value}T00:00:00`).getDate()
}

function getMonthLabel(value: string) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
    })
}

function formatDisplayDate(value: string) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })
}

export default function StreakHeatmap({ data }: StreakHeatmapProps) {
    const todayKey = new Date().toISOString().slice(0, 10)
    const weeks = Array.from({ length: Math.ceil(data.length / 7) }, (_, index) =>
        data.slice(index * 7, index * 7 + 7)
    )
    const monthLabels = weeks.map((week, weekIndex) => {
        const firstDay = week[0]
        const firstOfMonth = week.find((day) => getDayNumber(day.date) === 1)

        if (!firstDay) {
            return ""
        }

        if (weekIndex === 0) {
            return getMonthLabel(firstDay.date)
        }

        if (firstOfMonth) {
            return getMonthLabel(firstOfMonth.date)
        }

        return ""
    })
    const activeDays = data.filter((day) => day.count > 0 && day.date <= todayKey).length
    const totalCommits = data
        .filter((day) => day.date <= todayKey)
        .reduce((total, day) => total + day.count, 0)

    return (
        <Card className="rounded-lg border-[#d9e2ec] bg-white p-0 shadow-sm">
            <CardContent className="p-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase text-[#52606d]">Streak calendar</p>
                        <h2 className="mt-1 text-2xl font-bold text-[#111827]">Commit heatmap</h2>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-[#e8f6f3] px-3 py-2 text-sm font-bold text-[#126457]">
                        <CalendarDays className="h-4 w-4" />
                        {activeDays} active days
                    </div>
                </div>

                <div className="overflow-x-auto pb-2">
                    <div className="grid min-w-[360px] grid-cols-[38px_1fr] gap-x-3 gap-y-2">
                        <div />
                        <div
                            className="grid gap-2"
                            style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(32px, 1fr))` }}
                        >
                            {monthLabels.map((label, index) => (
                                <div
                                    key={`${label}-${index}`}
                                    className="h-5 truncate text-xs font-bold uppercase text-[#64748b]"
                                >
                                    {label}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-rows-7 gap-2 pt-0.5">
                            {dayLabels.map((label) => (
                                <div key={label} className="flex h-8 items-center text-xs font-medium text-[#64748b]">
                                    {label}
                                </div>
                            ))}
                        </div>

                        <div
                            className="grid gap-2"
                            style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(32px, 1fr))` }}
                        >
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="grid grid-rows-7 gap-2">
                                    {week.map((day) => {
                                        const isFuture = day.date > todayKey
                                        const label = `${formatDisplayDate(day.date)}: ${day.count} commit${day.count === 1 ? "" : "s"}`

                                        return (
                                            <div
                                                key={day.date}
                                                aria-label={label}
                                                title={label}
                                                className={cn(
                                                    "flex h-8 items-center justify-center rounded-md border text-xs font-bold tabular-nums transition-transform hover:scale-105",
                                                    getDateTextClass(day.count, isFuture),
                                                    getIntensityClass(day.count, isFuture)
                                                )}
                                            >
                                                {getDayNumber(day.date)}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-[#e2e8f0] pt-4 text-sm text-[#52606d] sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        {totalCommits} commits across the last {data.length} days.
                    </p>
                    <div className="flex items-center gap-2">
                        <span>Less</span>
                        {[0, 1, 2, 4].map((count) => (
                            <span
                                key={count}
                                className={cn(
                                    "h-4 w-4 rounded-sm border",
                                    getIntensityClass(count, false)
                                )}
                            />
                        ))}
                        <span>More</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
