"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface SectionNavItem {
    id: string
    label: string
}

interface SectionNavProps {
    items: SectionNavItem[]
}

export default function SectionNav({ items }: SectionNavProps) {
    const [activeId, setActiveId] = useState(items[0]?.id)

    useEffect(() => {
        const elements = items
            .map((item) => document.getElementById(item.id))
            .filter((element): element is HTMLElement => Boolean(element))

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

                if (visible) {
                    setActiveId(visible.target.id)
                }
            },
            { rootMargin: "-120px 0px -70% 0px", threshold: 0 }
        )

        elements.forEach((element) => observer.observe(element))

        return () => observer.disconnect()
    }, [items])

    return (
        <nav
            aria-label="Dashboard sections"
            className="sticky top-24 z-10 -mx-4 mb-2 overflow-x-auto bg-[#f8fafc]/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:border-[#d9e2ec] sm:px-3"
        >
            <ul className="flex items-center gap-2">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            aria-current={activeId === item.id ? "true" : undefined}
                            className={cn(
                                "block whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
                                activeId === item.id
                                    ? "bg-[#0f766e] text-white"
                                    : "text-[#52606d] hover:bg-[#e8f6f3] hover:text-[#0f766e]"
                            )}
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
