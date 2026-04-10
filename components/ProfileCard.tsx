import { Card, CardContent } from "../styleguide/components/ui/card"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProfileCardProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
    className?: string
}

export default function ProfileCard({ user, className }: ProfileCardProps) {
    return (
        <Card className={cn("rounded-lg border-[#d9e2ec] p-6 shadow-sm", className)}>
            <CardContent className="flex flex-col items-center px-0 text-center">
                <div className="h-24 w-24 overflow-hidden rounded-full border border-[#d9e2ec] bg-[#f8fafc]">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name ?? "User avatar"}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl font-black text-[#0f766e]">
                            {(user.name ?? "C").charAt(0)}
                        </div>
                    )}
                </div>
                <div className="mt-4 space-y-1">
                    <h2 className="text-xl font-bold text-[#111827]">
                        {user.name ?? "Club member"}
                    </h2>
                    <p className="break-all text-sm text-[#52606d]">{user.email ?? "GitHub member"}</p>
                </div>
            </CardContent>
        </Card>
    )
}
