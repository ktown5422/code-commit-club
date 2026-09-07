"use client"

import { useEffect, useState } from "react"
import { Minus, Plus, Target, Trophy } from "lucide-react"

import { Button } from "@/styleguide/components/ui/button"
import type { GitHubContributor } from "@/lib/github"

interface WeeklyChallengeCardProps {
    contributors: GitHubContributor[]
    isDiscordFiltered?: boolean
}

const STORAGE_KEY = "codestreak-weekly-challenge-goal"
const DEFAULT_GOAL = 250
const MIN_GOAL = 50
const MAX_GOAL = 5000
const GOAL_STEP = 25

function clampGoal(value: number) {
    return Math.min(Math.max(value, MIN_GOAL), MAX_GOAL)
}

export default function WeeklyChallengeCard({
    contributors,
    isDiscordFiltered = false,
}: WeeklyChallengeCardProps) {
    const [goal, setGoal] = useState(DEFAULT_GOAL)
    const totalCommits = contributors.reduce((sum, contributor) => sum + contributor.commits, 0)
    const progress = Math.min((totalCommits / goal) * 100, 100)
    const reached = totalCommits >= goal
    const sortedContributors = [...contributors].sort((a, b) => b.commits - a.commits).slice(0, 3)

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY)
            if (saved) {
                setGoal(clampGoal(Number(saved)))
            }
        } catch {
            setGoal(DEFAULT_GOAL)
        }
    }, [])

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, String(goal))
    }, [goal])

    function adjustGoal(amount: number) {
        setGoal((current) => clampGoal(current + amount))
    }

    return (
        <div className="rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">
                        {isDiscordFiltered ? "Discord community" : "Club"} challenge
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-[#111827]">Weekly commit goal</h2>
                </div>
                <Target className="h-8 w-8 text-[#0f766e]" />
            </div>

            <div className="mt-6">
                <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium">Combined commits</span>
                    <span className={reached ? "font-bold text-[#0f766e]" : "text-[#52606d]"}>
                        {totalCommits}/{goal}
                    </span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-md bg-[#e5e7eb]">
                    <div
                        className={reached ? "h-full rounded-md bg-[#0f766e]" : "h-full rounded-md bg-[#f97316]"}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="mt-2 text-sm text-[#52606d]">
                    {reached
                        ? "Goal reached this week. Raise the target to keep the challenge going."
                        : `${Math.max(goal - totalCommits, 0)} commits left across the community.`}
                </p>

                <div className="mt-3 flex items-center gap-2">
                    <Button aria-label="Decrease weekly goal" className="h-8 w-8 p-0" onClick={() => adjustGoal(-GOAL_STEP)} type="button" variant="outline">
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-20 text-center text-sm font-bold">{goal} commits</span>
                    <Button aria-label="Increase weekly goal" className="h-8 w-8 p-0" onClick={() => adjustGoal(GOAL_STEP)} type="button" variant="outline">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {sortedContributors.length > 0 && (
                <div className="mt-6 border-t border-[#d9e2ec] pt-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#126457]">
                        <Trophy className="h-4 w-4" />
                        Leading the push
                    </div>
                    <div className="space-y-2">
                        {sortedContributors.map((contributor) => (
                            <div key={contributor.username} className="flex items-center justify-between gap-3 text-sm">
                                <span className="truncate font-medium text-[#111827]">@{contributor.username}</span>
                                <span className="shrink-0 font-bold text-[#52606d]">{contributor.commits} commits</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
