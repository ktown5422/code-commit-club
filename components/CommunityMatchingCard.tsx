import { Github, Users } from "lucide-react"

import type { DiscordCommunityMatchingResult } from "@/lib/discord"
import { Card, CardContent } from "@/styleguide/components/ui/card"

interface CommunityMatchingCardProps {
    matching: DiscordCommunityMatchingResult
}

function formatHandle(handle?: string) {
    return handle ? `@${handle}` : "No GitHub handle"
}

export default function CommunityMatchingCard({ matching }: CommunityMatchingCardProps) {
    const matchRate = matching.totalMemberCount > 0
        ? Math.round((matching.matchedMemberCount / matching.totalMemberCount) * 100)
        : 0
    const matchedPreview = matching.matchedContributors.slice(0, 4)
    const unmatchedPreview = matching.unmatchedMembers.slice(0, 4)

    return (
        <Card className="rounded-lg border-[#d9e2ec] bg-white p-0 shadow-sm">
            <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase text-[#52606d]">Community matching</p>
                        <h2 className="mt-1 text-2xl font-bold text-[#111827]">Discord + GitHub</h2>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f6f3] text-[#0f766e]">
                        <Users className="h-6 w-6" />
                    </div>
                </div>

                {!matching.configured ? (
                    <p className="rounded-md bg-[#f8fafc] p-3 text-sm leading-6 text-[#52606d]">
                        Configure the Discord bot to compare server members with GitHub contributors.
                    </p>
                ) : (
                    <>
                        <div>
                            <div className="flex items-center justify-between gap-4 text-sm">
                                <span className="font-medium text-[#111827]">Matched members</span>
                                <span className="font-bold text-[#0f766e]">
                                    {matching.matchedMemberCount}/{matching.totalMemberCount}
                                </span>
                            </div>
                            <div className="mt-2 h-3 overflow-hidden rounded-md bg-[#e5e7eb]">
                                <div
                                    className="h-full rounded-md bg-[#0f766e]"
                                    style={{ width: `${matchRate}%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm text-[#52606d]">
                                {matchRate}% of visible Discord members match current GitHub contributor data.
                            </p>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <div className="rounded-lg border border-[#d9e2ec] bg-[#f8fafc] p-4">
                                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#126457]">
                                    <Github className="h-4 w-4" />
                                    Matched
                                </div>
                                <div className="space-y-2">
                                    {matchedPreview.length > 0 ? (
                                        matchedPreview.map((member) => (
                                            <div key={`${member.displayName}-${member.githubHandle}`} className="flex items-center justify-between gap-3 text-sm">
                                                <span className="truncate font-medium text-[#111827]">{member.displayName}</span>
                                                <span className="shrink-0 font-bold text-[#0f766e]">{formatHandle(member.githubHandle)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm leading-6 text-[#52606d]">
                                            No contributors matched Discord members yet.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-[#d9e2ec] bg-[#fff7ed] p-4">
                                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#9a3412]">
                                    <Users className="h-4 w-4" />
                                    Needs handle
                                </div>
                                <div className="space-y-2">
                                    {unmatchedPreview.length > 0 ? (
                                        unmatchedPreview.map((member) => (
                                            <div key={member.displayName} className="flex items-center justify-between gap-3 text-sm">
                                                <span className="truncate font-medium text-[#111827]">{member.displayName}</span>
                                                <span className="shrink-0 text-[#9a3412]">Add @handle</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm leading-6 text-[#52606d]">
                                            Every visible member is matched.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="rounded-md bg-[#f8fafc] p-3 text-sm leading-6 text-[#52606d]">
                            Ask members to include their GitHub handle in their Discord nickname or display name.
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
