import { Card, CardContent } from "../styleguide/components/ui/card"

interface StatsCardProps {
    label: string
    value: number
}

export default function StatsCard({ label, value }: StatsCardProps) {
    return (
        <Card className="p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
            <CardContent className="text-center">
                <p className="text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
            </CardContent>
        </Card>
    )
}
