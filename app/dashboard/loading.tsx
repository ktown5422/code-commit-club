import Container from "@/components/Container"
import Navbar from "@/components/Navbar"

import { ActivitySkeleton, HeroSkeleton } from "./skeletons"

export default function DashboardLoading() {
    return (
        <main className="min-h-screen bg-[#f8fafc] text-[#111827]">
            <Navbar />

            <Container className="pt-28 pb-16">
                <HeroSkeleton />
                <div className="mt-10">
                    <ActivitySkeleton />
                </div>
            </Container>
        </main>
    )
}
