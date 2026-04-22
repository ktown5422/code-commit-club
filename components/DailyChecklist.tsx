"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, ClipboardCheck, RotateCcw } from "lucide-react"

import { Button } from "@/styleguide/components/ui/button"
import { cn } from "@/lib/utils"

interface DailyChecklistProps {
    hasCommitToday: boolean
}

interface ChecklistItem {
    auto?: boolean
    id: string
    label: string
}

const items: ChecklistItem[] = [
    { id: "choose-task", label: "Pick one small task" },
    { id: "make-change", label: "Make the code change" },
    { auto: true, id: "commit-pushed", label: "Push a GitHub commit" },
    { id: "review-progress", label: "Review your dashboard" },
    { id: "share-discord", label: "Share progress to Discord" },
]

function getTodayKey() {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

function getStorageKey() {
    return `codestreak-checklist-${getTodayKey()}`
}

export default function DailyChecklist({ hasCommitToday }: DailyChecklistProps) {
    const [checkedItems, setCheckedItems] = useState<string[]>([])
    const [loaded, setLoaded] = useState(false)
    const checkedSet = useMemo(() => new Set(checkedItems), [checkedItems])
    const completedCount = items.filter((item) => checkedSet.has(item.id)).length
    const progress = Math.round((completedCount / items.length) * 100)

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(getStorageKey())
            const parsed = saved ? JSON.parse(saved) as string[] : []
            const initial = new Set(parsed)

            if (hasCommitToday) {
                initial.add("commit-pushed")
            }

            setCheckedItems([...initial])
        } catch {
            setCheckedItems(hasCommitToday ? ["commit-pushed"] : [])
        } finally {
            setLoaded(true)
        }
    }, [hasCommitToday])

    useEffect(() => {
        if (!loaded) {
            return
        }

        window.localStorage.setItem(getStorageKey(), JSON.stringify(checkedItems))
    }, [checkedItems, loaded])

    function toggleItem(id: string) {
        setCheckedItems((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        )
    }

    function resetChecklist() {
        setCheckedItems(hasCommitToday ? ["commit-pushed"] : [])
    }

    return (
        <div className="rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">Today&apos;s CodeStreak</p>
                    <h2 className="mt-1 text-2xl font-bold text-[#111827]">Daily checklist</h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="rounded-md bg-[#e8f6f3] px-3 py-2 text-sm font-bold text-[#126457]">
                        {completedCount}/{items.length} done
                    </div>
                    <Button
                        aria-label="Reset checklist"
                        className="h-10 w-10 border border-[#d9e2ec] bg-white p-0 text-[#52606d] hover:bg-[#f8fafc]"
                        onClick={resetChecklist}
                        type="button"
                        variant="outline"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-md bg-[#e5e7eb]">
                <div
                    className="h-full rounded-md bg-[#f97316] transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-5">
                {items.map((item) => {
                    const checked = checkedSet.has(item.id)

                    return (
                        <button
                            key={item.id}
                            className={cn(
                                "flex min-h-24 flex-col items-start justify-between rounded-lg border p-4 text-left transition-colors",
                                checked
                                    ? "border-[#b7d9d3] bg-[#e8f6f3]"
                                    : "border-[#d9e2ec] bg-[#f8fafc] hover:bg-white"
                            )}
                            onClick={() => toggleItem(item.id)}
                            type="button"
                        >
                            <span
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-md border",
                                    checked
                                        ? "border-[#0f766e] bg-[#0f766e] text-white"
                                        : "border-[#cbd5e1] bg-white text-[#94a3b8]"
                                )}
                            >
                                {checked ? <Check className="h-4 w-4" /> : <ClipboardCheck className="h-4 w-4" />}
                            </span>
                            <span className={cn("mt-4 font-bold leading-6", checked ? "text-[#126457]" : "text-[#111827]")}>
                                {item.label}
                            </span>
                            {item.auto && hasCommitToday && (
                                <span className="mt-2 text-xs font-semibold uppercase text-[#0f766e]">
                                    Synced
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
