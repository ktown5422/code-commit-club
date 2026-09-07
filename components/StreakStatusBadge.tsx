"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Flame, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

interface StreakStatusBadgeProps {
    currentStreak: number
    hasCommitToday: boolean
    unavailable?: boolean
}

export default function StreakStatusBadge({
    currentStreak,
    hasCommitToday,
    unavailable = false,
}: StreakStatusBadgeProps) {
    const [hoursLeft, setHoursLeft] = useState<number | null>(null)

    useEffect(() => {
        function update() {
            const now = new Date()
            const midnight = new Date(now)
            midnight.setHours(24, 0, 0, 0)
            setHoursLeft(Math.max(1, Math.floor((midnight.getTime() - now.getTime()) / 3600000)))
        }

        update()
        const timer = setInterval(update, 60000)
        return () => clearInterval(timer)
    }, [])

    const atRisk = !unavailable && !hasCommitToday && currentStreak > 0
    const label = unavailable
        ? "Streak status unavailable"
        : hasCommitToday
            ? `Day ${currentStreak} locked in`
            : atRisk
                ? hoursLeft === null
                    ? `${currentStreak}-day streak — commit today to keep it`
                    : `${currentStreak}-day streak — ${hoursLeft}h left to keep it`
                : "Start your streak today"

    return (
        <div
            className={cn(
                "inline-flex w-fit items-center gap-2 rounded-md border px-3 py-1 text-sm font-medium",
                atRisk
                    ? "border-[#fdba74] bg-[#fff7ed] text-[#9a3412]"
                    : unavailable
                        ? "border-[#e2e8f0] bg-[#f8fafc] text-[#52606d]"
                        : "border-[#b7d9d3] bg-[#e8f6f3] text-[#126457]"
            )}
        >
            {atRisk ? (
                <Flame className="h-4 w-4" />
            ) : unavailable ? (
                <AlertCircle className="h-4 w-4" />
            ) : (
                <Sparkles className="h-4 w-4" />
            )}
            {label}
        </div>
    )
}
