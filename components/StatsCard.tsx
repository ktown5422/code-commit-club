import { Card, CardContent } from "../styleguide/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    label: string
    value: number | string
    detail?: string
    className?: string
}

export default function StatsCard({ label, value, detail, className }: StatsCardProps) {
    const valueText = String(value)
    const valueSizeClass =
        valueText.length > 18
            ? "text-lg"
            : valueText.length > 12
              ? "text-xl"
              : "text-2xl"

    const labelSizeClass =
        label.length > 24
            ? "text-xs"
            : "text-sm"

    return (
        <Card className={cn("rounded-lg border-[#d9e2ec] p-5 shadow-sm", className)}>
            <CardContent className="px-0">
                <p className={cn("font-sans leading-5 font-medium text-[#52606d]", labelSizeClass)} style={{ overflowWrap: "anywhere" }}>
                    {label}
                </p>
                <p
                    className={cn(
                        "mt-2 font-sans leading-tight font-black tracking-normal tabular-nums text-[#111827]",
                        valueSizeClass
                    )}
                    style={{ overflowWrap: "anywhere" }}
                >
                    {value}
                </p>
                {detail && <p className="mt-3 font-sans text-sm leading-6 text-[#52606d]">{detail}</p>}
            </CardContent>
        </Card>
    )
}
