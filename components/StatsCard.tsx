import { Card, CardContent } from "../styleguide/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    label: string
    value: number | string
    detail?: string
    className?: string
}

export default function StatsCard({ label, value, detail, className }: StatsCardProps) {
    return (
        <Card className={cn("rounded-lg border-[#d9e2ec] p-5 shadow-sm", className)}>
            <CardContent className="px-0">
                <p className="text-sm font-medium text-[#52606d]">{label}</p>
                <p className="mt-2 text-3xl font-black text-[#111827]">{value}</p>
                {detail && <p className="mt-3 text-sm text-[#52606d]">{detail}</p>}
            </CardContent>
        </Card>
    )
}
