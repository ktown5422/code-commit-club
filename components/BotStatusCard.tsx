import { Bot, CheckCircle2, Server, Users, XCircle } from "lucide-react"

import type { DiscordBotStatus } from "@/lib/discord"
import { Card, CardContent } from "@/styleguide/components/ui/card"

interface BotStatusCardProps {
    status: DiscordBotStatus
}

export default function BotStatusCard({ status }: BotStatusCardProps) {
    const statusLabel = !status.configured
        ? "Not configured"
        : status.online
            ? "Connected"
            : "Needs attention"
    const StatusIcon = status.online ? CheckCircle2 : XCircle
    const statusColor = status.online ? "text-[#0f766e]" : "text-[#dc2626]"

    return (
        <Card className="rounded-lg border-[#d9e2ec] bg-white p-0 shadow-sm">
            <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase text-[#52606d]">Discord</p>
                        <h2 className="mt-1 text-2xl font-bold text-[#111827]">CodeStreak Bot</h2>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff7ed] text-[#f97316]">
                        <Bot className="h-6 w-6" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                    <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
                </div>

                <div className="grid gap-3 text-sm">
                    <div className="flex items-center justify-between gap-4 rounded-md bg-[#f8fafc] px-3 py-3">
                        <span className="flex items-center gap-2 text-[#52606d]">
                            <Bot className="h-4 w-4" />
                            Bot
                        </span>
                        <span className="truncate font-semibold text-[#111827]">
                            {status.botName ?? "Missing token"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-md bg-[#f8fafc] px-3 py-3">
                        <span className="flex items-center gap-2 text-[#52606d]">
                            <Server className="h-4 w-4" />
                            Server
                        </span>
                        <span className="truncate font-semibold text-[#111827]">
                            {status.guildName ?? "Missing guild"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-md bg-[#f8fafc] px-3 py-3">
                        <span className="flex items-center gap-2 text-[#52606d]">
                            <Users className="h-4 w-4" />
                            Members visible
                        </span>
                        <span className="font-semibold text-[#111827]">
                            {status.memberCount ?? 0}
                        </span>
                    </div>
                </div>

                {status.error && (
                    <p className="rounded-md bg-red-50 px-3 py-3 text-sm leading-6 text-red-700">
                        {status.error}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
