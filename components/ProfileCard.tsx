import { Card, CardContent } from "../styleguide/components/ui/card"
import Image from "next/image"

interface ProfileCardProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

export default function ProfileCard({ user }: ProfileCardProps) {
    return (
        <Card className="max-w-sm mx-auto p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center space-y-4">
                {user.image && (
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                        <Image
                            src={user.image}
                            alt={user.name ?? "User avatar"}
                            width={96}
                            height={96}
                            className="object-cover"
                        />
                    </div>
                )}
                <h2 className="text-xl font-semibold">
                    {user.name ?? "Unknown User"}
                </h2>
                <p className="text-gray-600">{user.email}</p>
            </CardContent>
        </Card>
    )
}
