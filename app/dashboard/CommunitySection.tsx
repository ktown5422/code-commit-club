import AccountabilityPairingCard from "@/components/AccountabilityPairingCard"
import BotStatusCard from "@/components/BotStatusCard"
import CommunityMatchingCard from "@/components/CommunityMatchingCard"
import Leaderboard from "@/components/Leaderboard"
import ShareLeaderboardCard from "@/components/ShareLeaderboardCard"
import ShareProgressCard from "@/components/ShareProgressCard"
import WeeklyChallengeCard from "@/components/WeeklyChallengeCard"
import {
    filterLeaderboardToDiscordMembers,
    getAccountabilityPairing,
    getDiscordCommunityMatching,
    type DiscordAccountabilityPairing,
    type DiscordCommunityMatchingResult,
} from "@/lib/discord"

import { loadBotStatus, loadDashboardData } from "./data"

export default async function CommunitySection({ accessToken }: { accessToken?: string }) {
    const [{ data }, discordBotStatus] = await Promise.all([
        loadDashboardData(accessToken),
        loadBotStatus(),
    ])
    const topContributors = data?.topContributors ?? []
    const followingLeaderboard = data?.followingContributors ?? []
    let leaderboard = topContributors
    let isDiscordLeaderboard = false

    const hasDiscordShareChannel = Boolean(process.env.DISCORD_CHANNEL_ID)
    const canShareToDiscord = discordBotStatus.online && hasDiscordShareChannel
    const discordShareDisabledReason = !hasDiscordShareChannel
        ? "Add DISCORD_CHANNEL_ID to .env.local, then restart the dev server."
        : "Connect the Discord bot before sharing."

    let communityMatching: DiscordCommunityMatchingResult = {
        configured: discordBotStatus.configured,
        githubContributorCount: topContributors.length,
        matchedContributors: [],
        matchedMemberCount: 0,
        totalMemberCount: discordBotStatus.memberCount ?? 0,
        unmatchedMembers: [],
    }

    try {
        communityMatching = await getDiscordCommunityMatching(topContributors)
    } catch (error) {
        console.error("Failed to load Discord community matching", error)
    }

    let accountabilityPairing: DiscordAccountabilityPairing = {
        configured: discordBotStatus.configured,
        pairs: [],
        weekKey: "",
    }

    try {
        accountabilityPairing = await getAccountabilityPairing(topContributors)
    } catch (error) {
        console.error("Failed to load Discord accountability pairing", error)
    }

    if (leaderboard.length > 0) {
        try {
            const discordLeaderboard = await filterLeaderboardToDiscordMembers(leaderboard)
            leaderboard = discordLeaderboard.contributors
            isDiscordLeaderboard = discordLeaderboard.configured
        } catch (error) {
            console.error("Failed to load Discord community leaderboard", error)
        }
    }

    return (
        <>
            <div className="mt-3">
                <WeeklyChallengeCard contributors={leaderboard} isDiscordFiltered={isDiscordLeaderboard} />
            </div>

            <div className="mt-4 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="grid gap-6">
                    <CommunityMatchingCard matching={communityMatching} />
                    <AccountabilityPairingCard
                        canAnnounce={canShareToDiscord}
                        disabledReason={discordShareDisabledReason}
                        pairing={accountabilityPairing}
                    />
                    <BotStatusCard status={discordBotStatus} />
                </div>
                <div className="grid gap-6">
                    <Leaderboard data={leaderboard} isDiscordFiltered={isDiscordLeaderboard} />
                    <Leaderboard
                        badgeText="Following"
                        data={followingLeaderboard}
                        emptyMessage="No recent public push activity from people you follow."
                        eyebrow="GitHub following"
                        title="People you follow"
                    />
                </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <ShareProgressCard
                    disabled={!canShareToDiscord}
                    disabledReason={discordShareDisabledReason}
                />

                <ShareLeaderboardCard
                    disabled={!canShareToDiscord}
                    disabledReason={discordShareDisabledReason}
                />
            </div>
        </>
    )
}
