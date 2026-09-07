"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Users2 } from "lucide-react"

import { Button } from "@/styleguide/components/ui/button"
import type { DiscordAccountabilityPairing } from "@/lib/discord"

interface AccountabilityPairingCardProps {
    canAnnounce: boolean
    disabledReason?: string
    pairing: DiscordAccountabilityPairing
}

export default function AccountabilityPairingCard({
    canAnnounce,
    disabledReason = "Connect the Discord bot before announcing pairs.",
    pairing,
}: AccountabilityPairingCardProps) {
    const [message, setMessage] = useState<string | null>(null)
    const [status, setStatus] = useState<"error" | "idle" | "success">("idle")
    const [announcing, setAnnouncing] = useState(false)

    async function announcePairs() {
        setAnnouncing(true)
        setMessage(null)
        setStatus("idle")

        try {
            const response = await fetch("/api/discord/announce-pairs", {
                method: "POST",
            })
            const data = await response.json() as { message?: string }

            if (!response.ok) {
                throw new Error(data.message ?? "Could not announce pairs.")
            }

            setStatus("success")
            setMessage(data.message ?? "Announced pairs in Discord.")
        } catch (error) {
            setStatus("error")
            setMessage(error instanceof Error ? error.message : "Could not announce pairs.")
        } finally {
            setAnnouncing(false)
        }
    }

    return (
        <div className="rounded-lg border border-[#d9e2ec] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase text-[#52606d]">Week {pairing.weekKey}</p>
                    <h2 className="mt-1 text-2xl font-bold text-[#111827]">Accountability pairs</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f6f3] text-[#0f766e]">
                    <Users2 className="h-6 w-6" />
                </div>
            </div>

            {!pairing.configured ? (
                <p className="mt-5 rounded-md bg-[#f8fafc] p-3 text-sm leading-6 text-[#52606d]">
                    Configure the Discord bot to pair matched community members for weekly check-ins.
                </p>
            ) : pairing.pairs.length === 0 ? (
                <p className="mt-5 rounded-md bg-[#f8fafc] p-3 text-sm leading-6 text-[#52606d]">
                    Need at least two members with matched GitHub handles to form a pair.
                </p>
            ) : (
                <div className="mt-5 space-y-2">
                    {pairing.pairs.map((pair) => (
                        <div key={`${pair.a.discordId}-${pair.b.discordId}`} className="flex items-center justify-between gap-3 rounded-md bg-[#f8fafc] p-3 text-sm">
                            <span className="truncate font-medium text-[#111827]">{pair.a.displayName}</span>
                            <span className="shrink-0 text-[#52606d]">paired with</span>
                            <span className="truncate font-medium text-[#111827]">{pair.b.displayName}</span>
                        </div>
                    ))}

                    {pairing.unpaired && (
                        <p className="text-sm leading-6 text-[#52606d]">
                            {pairing.unpaired.displayName} is on standby for next week&apos;s pairing.
                        </p>
                    )}
                </div>
            )}

            <Button
                className="mt-5 w-full bg-[#0f766e] text-white hover:bg-[#115e59]"
                disabled={!canAnnounce || announcing || pairing.pairs.length === 0}
                onClick={announcePairs}
                type="button"
            >
                <Users2 className="h-4 w-4" />
                {announcing ? "Announcing..." : "Announce pairs in Discord"}
            </Button>

            {!canAnnounce && (
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
