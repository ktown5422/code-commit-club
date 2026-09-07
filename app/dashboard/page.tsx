import { Suspense } from "react"
import { redirect } from "next/navigation"

import Container from "@/components/Container"
import Navbar from "@/components/Navbar"
import RefreshButton from "@/components/RefreshButton"
import SectionNav from "@/components/SectionNav"
import { auth } from "@/lib/auth"

import ActivitySection from "./ActivitySection"
import CommunitySection from "./CommunitySection"
import HeroSection from "./HeroSection"
import TodaySection from "./TodaySection"
import { ActivitySkeleton, CardSkeleton, CommunitySkeleton, HeroSkeleton } from "./skeletons"

export default async function DashboardPage() {
    const session = await auth()
    if (!session) return redirect("/")

    const user = session.user
    const firstName = user?.name?.split(" ")[0] ?? "developer"
    const accessToken = session.accessToken

    return (
        <main className="min-h-screen bg-[#f8fafc] text-[#111827]">
            <Navbar />

            <Container className="pt-28 pb-16">
                <Suspense fallback={<HeroSkeleton />}>
                    <HeroSection accessToken={accessToken} firstName={firstName} user={user} />
                </Suspense>

                <SectionNav
                    items={[
                        { id: "today", label: "Today" },
                        { id: "your-activity", label: "Your activity" },
                        { id: "community", label: "Community" },
                    ]}
                />

                {/* Today: the one thing to act on right now */}
                <section className="mt-10 scroll-mt-40" id="today">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xs font-bold uppercase tracking-wide text-[#52606d]">Today</h2>
                        <RefreshButton />
                    </div>
                    <div className="mt-3">
                        <Suspense fallback={<CardSkeleton />}>
                            <TodaySection accessToken={accessToken} />
                        </Suspense>
                    </div>
                </section>

                {/* Your activity: personal GitHub history and goals */}
                <section className="mt-10 scroll-mt-40" id="your-activity">
                    <h2 className="text-xs font-bold uppercase tracking-wide text-[#52606d]">Your activity</h2>
                    <Suspense fallback={<ActivitySkeleton />}>
                        <ActivitySection accessToken={accessToken} />
                    </Suspense>
                </section>

                {/* Community: club-wide challenges, matching, and the leaderboard */}
                <section className="mt-10 scroll-mt-40" id="community">
                    <h2 className="text-xs font-bold uppercase tracking-wide text-[#52606d]">Community</h2>
                    <Suspense fallback={<CommunitySkeleton />}>
                        <CommunitySection accessToken={accessToken} />
                    </Suspense>
                </section>
            </Container>
        </main>
    )
}
