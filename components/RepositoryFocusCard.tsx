"use client"

import { useEffect, useMemo, useState } from "react"
import { GitBranch, GitCommitHorizontal, Star } from "lucide-react"

import type { GitHubRepoSummary } from "@/lib/github"

interface RepositoryFocusCardProps {
    repos: GitHubRepoSummary[]
}

const STORAGE_KEY = "codestreak-focus-repo"

const taskSuggestions = [
    "Clean up one component and commit the smallest useful improvement.",
    "Add or improve one README section that future you will appreciate.",
    "Fix one visual detail, then push the polish.",
    "Write one small test around behavior you touched recently.",
    "Rename one confusing variable or helper and commit the clarity.",
]

function formatPushedDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function getSuggestion(repoName: string) {
    const total = [...repoName].reduce((sum, character) => sum + character.charCodeAt(0), 0)
    return taskSuggestions[total % taskSuggestions.length]
}

export default function RepositoryFocusCard({ repos }: RepositoryFocusCardProps) {
    const [selectedFullName, setSelectedFullName] = useState("")

    useEffect(() => {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        const savedRepo = saved ? repos.find((repo) => repo.fullName === saved) : undefined

        setSelectedFullName(savedRepo?.fullName ?? repos[0]?.fullName ?? "")
    }, [repos])

    useEffect(() => {
        if (selectedFullName) {
            window.localStorage.setItem(STORAGE_KEY, selectedFullName)
        }
    }, [selectedFullName])

    const selectedRepo = useMemo(
        () => repos.find((repo) => repo.fullName === selectedFullName) ?? repos[0],
        [repos, selectedFullName]
    )

    if (!selectedRepo) {
        return (
            <div className="rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm">
                <p className="text-sm font-medium uppercase text-[#52606d]">Focus repo</p>
                <h2 className="mt-1 text-2xl font-bold text-[#111827]">Repository Focus Mode</h2>
                <p className="mt-4 text-sm leading-6 text-[#52606d]">
                    Connect GitHub data to choose a repo for today&apos;s commit.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">Focus repo</p>
                    <h2 className="mt-1 text-2xl font-bold text-[#111827]">Repository Focus Mode</h2>
                </div>

                <select
                    aria-label="Choose focus repository"
                    className="h-10 rounded-md border border-[#d9e2ec] bg-white px-3 text-sm font-medium text-[#111827] outline-none transition-colors focus:border-[#f97316]"
                    onChange={(event) => setSelectedFullName(event.target.value)}
                    value={selectedRepo.fullName}
                >
                    {repos.map((repo) => (
                        <option key={repo.fullName} value={repo.fullName}>
                            {repo.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-5 rounded-lg bg-[#111827] p-5 text-white">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="truncate text-2xl font-black">{selectedRepo.name}</p>
                        <p className="mt-1 truncate text-sm text-[#cbd5e1]">{selectedRepo.fullName}</p>
                    </div>
                    <div className="w-fit rounded-md bg-white/10 px-3 py-1 text-sm font-bold">
                        {selectedRepo.private ? "Private" : "Public"}
                    </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-md bg-white/10 p-3">
                        <div className="flex items-center gap-2 text-sm text-[#cbd5e1]">
                            <Star className="h-4 w-4" />
                            Stars
                        </div>
                        <p className="mt-2 text-xl font-bold">{selectedRepo.stars}</p>
                    </div>
                    <div className="rounded-md bg-white/10 p-3">
                        <div className="flex items-center gap-2 text-sm text-[#cbd5e1]">
                            <GitBranch className="h-4 w-4" />
                            Branch
                        </div>
                        <p className="mt-2 truncate text-xl font-bold">{selectedRepo.defaultBranch}</p>
                    </div>
                    <div className="rounded-md bg-white/10 p-3">
                        <div className="flex items-center gap-2 text-sm text-[#cbd5e1]">
                            <GitCommitHorizontal className="h-4 w-4" />
                            Last push
                        </div>
                        <p className="mt-2 text-xl font-bold">{formatPushedDate(selectedRepo.pushedAt)}</p>
                    </div>
                </div>
            </div>

            <div className="mt-5 rounded-lg border border-[#fed7aa] bg-[#fff7ed] p-4">
                <p className="text-sm font-bold uppercase text-[#9a3412]">Suggested commit</p>
                <p className="mt-2 text-lg font-bold leading-7 text-[#111827]">
                    {getSuggestion(selectedRepo.name)}
                </p>
            </div>
        </div>
    )
}
