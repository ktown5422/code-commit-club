import { Clock3 } from "lucide-react"

import type { CommitTimeInsight } from "@/lib/github"

interface BestCommitTimeCardProps {
    insight: CommitTimeInsight
}

const windowRanges: Record<string, string> = {
    Afternoon: "12 PM-5 PM",
    Evening: "5 PM-10 PM",
    "Late night": "10 PM-6 AM",
    Morning: "6 AM-12 PM",
}

export default function BestCommitTimeCard({ insight }: BestCommitTimeCardProps) {
    const maxCommits = Math.max(...insight.windows.map((window) => window.commits), 1)
    const hasActivity = insight.totalCommits > 0

    return (
        <div className="rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">Best commit time</p>
                    <h2 className="mt-1 text-2xl font-bold text-[#111827]">
                        {hasActivity ? insight.bestWindow.label : "Build your pattern"}
                    </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff7ed] text-[#f97316]">
                    <Clock3 className="h-6 w-6" />
                </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#52606d]">
                {hasActivity
                    ? `Your strongest window is ${windowRanges[insight.bestWindow.label]}, based on ${insight.totalCommits} recent commits.`
                    : "Once commits appear, this card will show when you usually ship best."}
            </p>

            <div className="mt-5 space-y-4">
                {insight.windows.map((window) => {
                    const width = Math.round((window.commits / maxCommits) * 100)

                    return (
                        <div key={window.label}>
                            <div className="flex items-center justify-between gap-4 text-sm">
                                <span className="font-medium text-[#111827]">{window.label}</span>
                                <span className="text-[#52606d]">
                                    {window.commits} commit{window.commits === 1 ? "" : "s"}
                                </span>
                            </div>
                            <div className="mt-2 h-3 overflow-hidden rounded-md bg-[#e5e7eb]">
                                <div
                                    className="h-full rounded-md bg-[#0f766e]"
                                    style={{ width: `${width}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
