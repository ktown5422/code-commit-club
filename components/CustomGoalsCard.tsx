"use client"

import { useEffect, useState } from "react"
import { Goal, Minus, Plus } from "lucide-react"

import { Button } from "@/styleguide/components/ui/button"

interface CustomGoalsCardProps {
    activeRepoCount: number
    hasCommitToday: boolean
    recentCommitCount: number
}

const STORAGE_KEY = "codestreak-goals"

function clampGoal(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}

export default function CustomGoalsCard({
    activeRepoCount,
    hasCommitToday,
    recentCommitCount,
}: CustomGoalsCardProps) {
    const [weeklyTarget, setWeeklyTarget] = useState(7)
    const [repoTarget, setRepoTarget] = useState(Math.max(activeRepoCount || 1, 3))
    const weeklyProgress = Math.min((recentCommitCount / weeklyTarget) * 100, 100)
    const repoProgress = Math.min((activeRepoCount / repoTarget) * 100, 100)
    const dailyProgress = hasCommitToday ? 100 : 0

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY)
            const parsed = saved ? JSON.parse(saved) as { repoTarget?: number; weeklyTarget?: number } : {}

            if (parsed.weeklyTarget) {
                setWeeklyTarget(clampGoal(parsed.weeklyTarget, 1, 50))
            }

            if (parsed.repoTarget) {
                setRepoTarget(clampGoal(parsed.repoTarget, 1, 20))
            }
        } catch {
            setWeeklyTarget(7)
            setRepoTarget(Math.max(activeRepoCount || 1, 3))
        }
    }, [activeRepoCount])

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ repoTarget, weeklyTarget }))
    }, [repoTarget, weeklyTarget])

    function adjustWeeklyTarget(amount: number) {
        setWeeklyTarget((current) => clampGoal(current + amount, 1, 50))
    }

    function adjustRepoTarget(amount: number) {
        setRepoTarget((current) => clampGoal(current + amount, 1, 20))
    }

    return (
        <div className="rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">Goals</p>
                    <h2 className="mt-1 text-2xl font-bold text-[#111827]">Custom targets</h2>
                </div>
                <Goal className="h-8 w-8 text-[#0f766e]" />
            </div>

            <div className="mt-6 space-y-5">
                <div>
                    <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium">Daily commit</span>
                        <span className="text-[#52606d]">{hasCommitToday ? "1/1" : "0/1"}</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-md bg-[#e5e7eb]">
                        <div className="h-full rounded-md bg-[#f97316]" style={{ width: `${dailyProgress}%` }} />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium">Weekly commits</span>
                        <span className="text-[#52606d]">{recentCommitCount}/{weeklyTarget}</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-md bg-[#e5e7eb]">
                        <div className="h-full rounded-md bg-[#f97316]" style={{ width: `${weeklyProgress}%` }} />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <Button aria-label="Decrease weekly goal" className="h-8 w-8 p-0" onClick={() => adjustWeeklyTarget(-1)} type="button" variant="outline">
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-16 text-center text-sm font-bold">{weeklyTarget}/week</span>
                        <Button aria-label="Increase weekly goal" className="h-8 w-8 p-0" onClick={() => adjustWeeklyTarget(1)} type="button" variant="outline">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium">Active repos</span>
                        <span className="text-[#52606d]">{activeRepoCount}/{repoTarget}</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-md bg-[#e5e7eb]">
                        <div className="h-full rounded-md bg-[#f97316]" style={{ width: `${repoProgress}%` }} />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <Button aria-label="Decrease active repo goal" className="h-8 w-8 p-0" onClick={() => adjustRepoTarget(-1)} type="button" variant="outline">
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-16 text-center text-sm font-bold">{repoTarget} repos</span>
                        <Button aria-label="Increase active repo goal" className="h-8 w-8 p-0" onClick={() => adjustRepoTarget(1)} type="button" variant="outline">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
