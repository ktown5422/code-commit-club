
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, Menu, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { AuthButton } from "./AuthButton"
import {
    NavigationMenu,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/styleguide/components/ui/navigation-menu"

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const { data: session } = useSession()

    return (
        <header className="fixed inset-x-0 top-0 z-20">
            <div className="mx-auto max-w-7xl px-4 pt-4">
                <div className="rounded-lg border border-black/10 bg-white/90 shadow-sm backdrop-blur">
                    <nav className="flex items-center justify-between px-4 py-3 sm:px-5">
                        <Link href="/" className="flex min-w-0 items-center gap-3">
                            <Image
                                src="/Code-Commit-Club-Logo.png"
                                alt="Code Commit Club Logo"
                                width={36}
                                height={36}
                                className="rounded-md"
                            />
                            <div className="min-w-0">
                                <span className="block truncate text-base font-bold text-gray-900 sm:text-lg">
                                    Code Commit Club
                                </span>
                                <span className="hidden text-xs text-gray-500 sm:block">
                                    Daily commits, lasting habits
                                </span>
                            </div>
                        </Link>

                        <div className="hidden items-center gap-4 md:flex">
                            <NavigationMenu viewport={false}>
                                <NavigationMenuList className="gap-2">
                                    <NavigationMenuLink
                                        href="/"
                                        className="rounded-md px-3 py-2 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        Home
                                    </NavigationMenuLink>
                                    {session && (
                                        <NavigationMenuLink
                                            href="/dashboard"
                                            className="flex flex-row items-center gap-2 rounded-md px-3 py-2 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </NavigationMenuLink>
                                    )}
                                </NavigationMenuList>
                            </NavigationMenu>

                            <AuthButton />
                        </div>

                        <button
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
                            onClick={() => setMobileOpen((open) => !open)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </nav>

                    {mobileOpen && (
                        <div className="border-t border-black/10 px-4 py-4 md:hidden">
                            <div className="space-y-2">
                                <Link
                                    href="/"
                                    className="block rounded-md px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Home
                                </Link>
                                {session && (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                            <div className="mt-4 border-t border-black/10 pt-4">
                                <AuthButton />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
