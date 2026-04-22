"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Trophy } from "lucide-react"

import { Button } from "@/styleguide/components/ui/button"

interface ShareLeaderboardCardProps {
    disabled?: boolean
    disabledReason?: string
}

export default function ShareLeaderboardCard({
    disabled = false,
    disabledReason = "Add a Discord channel ID before sharing the leaderboard.",
}: ShareLeaderboardCardProps) {
    const [message, setMessage] = useState<string | null>(null)
    const [status, setStatus] = useState<"error" | "idle" | "success">("idle")
    const [sharing, setSharing] = useState(false)

    async function shareLeaderboard() {
        setSharing(true)
        setMessage(null)
        setStatus("idle")

        try {
            const response = await fetch("/api/discord/share-leaderboard", {
                method: "POST",
            })
            const data = await response.json() as { message?: string }

            if (!response.ok) {
                throw new Error(data.message ?? "Could not share leaderboard.")
            }

            setStatus("success")
            setMessage(data.message ?? "Shared the leaderboard in Discord.")
        } catch (error) {
            setStatus("error")
            setMessage(error instanceof Error ? error.message : "Could not share leaderboard.")
        } finally {
            setSharing(false)
        }
    }

    return (
        <div className="rounded-lg border border-[#d9e2ec] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">Community boost</p>
                    <p className="mt-2 text-xl font-bold text-[#111827]">Post leaderboard.</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#e8f6f3] text-[#0f766e]">
                    <Trophy className="h-5 w-5" />
                </div>
            </div>

            <Button
                className="mt-4 w-full bg-[#0f766e] text-white hover:bg-[#115e59]"
                disabled={disabled || sharing}
                onClick={shareLeaderboard}
                type="button"
            >
                <Trophy className="h-4 w-4" />
                {sharing ? "Sharing..." : "Share leaderboard"}
            </Button>

            {disabled && (
                <p className="mt-3 text-sm leading-6 text-[#52606d]">
                    {disabledReason}
                </p>
            )}

            {message && (
                <div className="mt-3 flex gap-2 rounded-md bg-[#f8fafc] p-3 text-sm leading-6">
                    {status === "success" ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />
                    ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#dc2626]" />
                    )}
                    <p className={status === "success" ? "text-[#126457]" : "text-[#b91c1c]"}>
                        {message}
                    </p>
                </div>
            )}
        </div>
    )
}
