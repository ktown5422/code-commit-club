"use client"

import { cn } from "@/lib/utils"

interface User { username: string; commits: number; streak?: number }
interface LeaderboardProps { data: User[] }

export default function Leaderboard({ data, className }: LeaderboardProps & { className?: string }) {
    return (
        <div className={cn("rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm", className)}>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">Club</p>
                    <h2 className="mt-1 text-2xl font-bold text-[#111827]">Top contributors</h2>
                </div>
                <p className="rounded-md bg-[#e8f6f3] px-3 py-1 text-sm font-bold text-[#0f766e]">
                    Live
                </p>
            </div>
            <ol className="mt-6 divide-y divide-[#d9e2ec]">
                {data.map((u, index) => (
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
                ))}
            </ol>
        </div>
    )
}
