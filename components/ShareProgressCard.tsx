"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Send } from "lucide-react"

import { Button } from "@/styleguide/components/ui/button"

interface ShareProgressCardProps {
    disabled?: boolean
    disabledReason?: string
}

export default function ShareProgressCard({
    disabled = false,
    disabledReason = "Add a Discord channel ID before sharing progress.",
}: ShareProgressCardProps) {
    const [message, setMessage] = useState<string | null>(null)
    const [status, setStatus] = useState<"error" | "idle" | "success">("idle")
    const [sharing, setSharing] = useState(false)

    async function shareProgress() {
        setSharing(true)
        setMessage(null)
        setStatus("idle")

        try {
            const response = await fetch("/api/discord/share-progress", {
                method: "POST",
            })
            const data = await response.json() as { message?: string }

            if (!response.ok) {
                throw new Error(data.message ?? "Could not share progress.")
            }

            setStatus("success")
            setMessage(data.message ?? "Shared your progress in Discord.")
        } catch (error) {
            setStatus("error")
            setMessage(error instanceof Error ? error.message : "Could not share progress.")
        } finally {
            setSharing(false)
        }
    }

    return (
        <div className="rounded-lg border border-[#d9e2ec] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">Discord share</p>
                    <p className="mt-2 text-xl font-bold text-[#111827]">Post today&apos;s progress.</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#fff7ed] text-[#f97316]">
                    <Send className="h-5 w-5" />
                </div>
            </div>

            <Button
                className="mt-4 w-full bg-[#f97316] text-white hover:bg-[#ea580c]"
                disabled={disabled || sharing}
                onClick={shareProgress}
                type="button"
            >
                <Send className="h-4 w-4" />
                {sharing ? "Sharing..." : "Share to Discord"}
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
