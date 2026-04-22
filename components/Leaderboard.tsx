"use client"

import { cn } from "@/lib/utils"

interface User { username: string; commits: number; streak?: number }
interface LeaderboardProps {
    badgeText?: string
    data: User[]
    emptyMessage?: string
    eyebrow?: string
    isDiscordFiltered?: boolean
    title?: string
}

export default function Leaderboard({
    badgeText,
    data,
    emptyMessage,
    eyebrow,
    isDiscordFiltered = false,
    title = "Top contributors",
    className,
}: LeaderboardProps & { className?: string }) {
    const resolvedEyebrow = eyebrow ?? (isDiscordFiltered ? "Discord community" : "Club")
    const resolvedBadgeText = badgeText ?? (isDiscordFiltered ? "Discord" : "Live")
    const resolvedEmptyMessage = emptyMessage ?? (
        isDiscordFiltered
            ? "No Discord community contributors matched the current GitHub data yet."
            : "No contributors to show yet."
    )

    return (
        <div className={cn("rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm", className)}>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">
                        {resolvedEyebrow}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-[#111827]">{title}</h2>
                </div>
                <p className="rounded-md bg-[#e8f6f3] px-3 py-1 text-sm font-bold text-[#0f766e]">
                    {resolvedBadgeText}
                </p>
            </div>
            <ol className="mt-6 divide-y divide-[#d9e2ec]">
                {data.length > 0 ? (
                    data.map((u, index) => (
                        <li key={u.username} className="flex items-center justify-between gap-4 py-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#111827] text-sm font-bold text-white">
                                    {index + 1}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate font-semibold text-[#111827]">@{u.username}</span>
                                    {u.streak !== undefined && (
                                        <span className="block text-sm text-[#52606d]">{u.streak} day streak</span>
                                    )}
                                </span>
                            </div>
                            <span className="font-bold text-[#111827]">{u.commits}</span>
                        </li>
                    ))
                ) : (
                    <li className="py-5 text-sm leading-6 text-[#52606d]">
                        {resolvedEmptyMessage}
                    </li>
                )}
            </ol>
        </div>
    )
}
