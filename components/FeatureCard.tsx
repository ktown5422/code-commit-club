import { Card, CardContent } from "../styleguide/components/ui/card"
import { Award } from "lucide-react"

interface FeatureCardProps {
    title: string
    description: string
    descriptionTwo: string
}

export function FeatureCard({ title, description, descriptionTwo }: FeatureCardProps) {
    return (
        <Card className="p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-shadow">
            <CardContent className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-full">
                    <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-center">
                    {title}
                </h3>
                <p className="mt-2  text-gray-600 text-center">
                    {description}
                </p>
                <p className="mt-2 text-base text-center">
                    {descriptionTwo}
                </p>
            </CardContent>
        </Card>
    )
}
