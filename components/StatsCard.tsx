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
                <p
                    className="font-sans text-[clamp(0.8rem,0.78rem+0.2vw,0.95rem)] leading-5 font-medium text-[#52606d]"
                    style={{ overflowWrap: "anywhere" }}
                >
                    {label}
                </p>
                <p
                    className="mt-2 font-sans text-[clamp(1.5rem,1.15rem+1.2vw,2rem)] leading-tight font-black tracking-normal tabular-nums text-[#111827]"
                    style={{ overflowWrap: "anywhere" }}
                >
                    {value}
                </p>
                {detail && <p className="mt-3 font-sans text-sm leading-6 text-[#52606d]">{detail}</p>}
            </CardContent>
        </Card>
    )
}
