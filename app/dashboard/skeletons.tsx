import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/styleguide/components/ui/card"

function SkeletonBlock({ className }: { className?: string }) {
    return <div className={cn("animate-pulse rounded-md bg-[#e2e8f0]", className)} />
}

export function CardSkeleton({ lines = 4 }: { lines?: number }) {
    return (
        <Card className="rounded-lg border-[#d9e2ec] bg-white p-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-7 w-56" />
                {Array.from({ length: lines }, (_, index) => (
                    <SkeletonBlock key={index} className="h-4 w-full" />
                ))}
            </CardContent>
        </Card>
    )
}

export function HeroSkeleton() {
    return (
        <section className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
            <Card className="rounded-lg border-[#d9e2ec] bg-white p-0 shadow-sm">
                <CardContent className="space-y-6 p-6 sm:p-8">
                    <SkeletonBlock className="h-7 w-44" />
                    <SkeletonBlock className="h-10 w-72" />
                    <SkeletonBlock className="h-5 w-96 max-w-full" />
                    <div className="grid gap-3 sm:grid-cols-3">
                        <SkeletonBlock className="h-24" />
                        <SkeletonBlock className="h-24" />
                        <SkeletonBlock className="h-24" />
                    </div>
                </CardContent>
            </Card>
            <Card className="rounded-lg border-[#d9e2ec] bg-[#111827] p-0 shadow-sm">
                <CardContent className="space-y-4 p-6">
                    <SkeletonBlock className="h-4 w-24 bg-white/20" />
                    <SkeletonBlock className="h-7 w-48 bg-white/20" />
                    <SkeletonBlock className="h-14 w-full bg-white/10" />
                    <SkeletonBlock className="h-14 w-full bg-white/10" />
                    <SkeletonBlock className="h-14 w-full bg-white/10" />
                </CardContent>
            </Card>
        </section>
    )
}

export function ActivitySkeleton() {
    return (
        <div className="mt-3 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
                <SkeletonBlock className="h-24" />
                <SkeletonBlock className="h-24" />
                <SkeletonBlock className="h-24" />
            </div>
            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <CardSkeleton lines={5} />
                <CardSkeleton lines={5} />
            </div>
            <CardSkeleton lines={7} />
        </div>
    )
}

export function CommunitySkeleton() {
    return (
        <div className="mt-3 space-y-4">
            <CardSkeleton lines={3} />
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <CardSkeleton lines={6} />
                <CardSkeleton lines={6} />
            </div>
        </div>
    )
}
