import Link from "next/link"
import { ExternalLink, GitCommitHorizontal } from "lucide-react"

import type { LastCommitInfo } from "@/lib/github"

interface LastCommitCardProps {
    commit: LastCommitInfo | null
}

function formatCommitDate(value: string) {
    return new Date(value).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    })
}

function getFirstLine(message: string) {
    return message.split("\n")[0] || "Untitled commit"
}

export default function LastCommitCard({ commit }: LastCommitCardProps) {
    if (!commit) {
        return (
            <div className="rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase text-[#52606d]">Latest commit</p>
                        <h2 className="mt-1 text-2xl font-bold text-[#111827]">No commit found</h2>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f8fafc] text-[#52606d]">
                        <GitCommitHorizontal className="h-6 w-6" />
                    </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#52606d]">
                    Push a commit to one of your recent repositories and CodeStreak will show it here.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">Latest commit</p>
                    <h2 className="mt-1 text-2xl font-bold text-[#111827]">GitHub saw this</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f6f3] text-[#0f766e]">
                    <GitCommitHorizontal className="h-6 w-6" />
                </div>
            </div>

            <div className="mt-5 rounded-lg bg-[#111827] p-5 text-white">
                <p className="text-xl font-bold leading-7">
                    {getFirstLine(commit.message)}
                </p>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-md bg-white/10 p-3">
                        <p className="text-[#cbd5e1]">Repository</p>
                        <p className="mt-1 truncate font-bold">{commit.repo}</p>
                    </div>
                    <div className="rounded-md bg-white/10 p-3">
                        <p className="text-[#cbd5e1]">Branch</p>
                        <p className="mt-1 truncate font-bold">{commit.branch}</p>
                    </div>
                    <div className="rounded-md bg-white/10 p-3">
                        <p className="text-[#cbd5e1]">Committed</p>
                        <p className="mt-1 font-bold">{formatCommitDate(commit.date)}</p>
                    </div>
                    <div className="rounded-md bg-white/10 p-3">
                        <p className="text-[#cbd5e1]">SHA</p>
                        <p className="mt-1 font-bold">{commit.sha.slice(0, 7)}</p>
                    </div>
                </div>
            </div>

            <Link
                href={commit.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#f97316] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#ea580c]"
            >
                View on GitHub
                <ExternalLink className="h-4 w-4" />
            </Link>
        </div>
    )
}
