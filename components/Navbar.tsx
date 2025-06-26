// components/Navbar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { AuthButton } from "./AuthButton"
import {
    NavigationMenu,
    NavigationMenuIndicator,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuViewport,
} from "@/styleguide/components/ui/navigation-menu"

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="fixed top-0 w-full bg-white shadow z-10">
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">

                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/Code-Commit-Club-Logo.png"
                        alt="Code Commit Club Logo"
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <span className="text-xl font-bold">Code Commit Club</span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <NavigationMenu>
                        <NavigationMenuList className="flex space-x-4">
                            <NavigationMenuLink href="/leaderboard">
                                Leaderboard
                            </NavigationMenuLink>
                        </NavigationMenuList>
                        <NavigationMenuIndicator />
                        <NavigationMenuViewport />
                    </NavigationMenu>

                    <AuthButton />
                </div>


                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setMobileOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>


            {mobileOpen && (
                <div className="md:hidden bg-white shadow border-t">
                    <div className="px-4 py-3 space-y-2">
                        <Link
                            href="/leaderboard"
                            className="block px-2 py-1 rounded hover:bg-gray-100"
                        >
                            Leaderboard
                        </Link>
                        <div className="pt-2 border-t">
                            <AuthButton />
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
