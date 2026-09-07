"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"

export default function RefreshButton() {
    const router = useRouter()
    const [refreshing, startTransition] = useTransition()

    return (
        <button
            className="inline-flex items-center gap-2 rounded-md border border-[#d9e2ec] bg-white px-3 py-1.5 text-sm font-semibold text-[#52606d] shadow-sm transition-colors hover:bg-[#e8f6f3] hover:text-[#0f766e] disabled:opacity-60"
            disabled={refreshing}
            onClick={() => startTransition(() => router.refresh())}
            type="button"
        >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            {refreshing ? "Refreshing..." : "Refresh"}
        </button>
    )
}
