import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/styleguide/components/ui/navigation-menu"

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="fixed top-0 w-full bg-white shadow z-10">
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    Code Commit Club
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <NavigationMenu>
                        <NavigationMenuList className="flex space-x-4">
                            <NavigationMenuLink href="/contact">Leaderboard</NavigationMenuLink>
                            <NavigationMenuLink href="/login">Login</NavigationMenuLink>
                            <NavigationMenuLink
                                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                href="/signup">Sign Up
                            </NavigationMenuLink>
                        </NavigationMenuList>
                        <NavigationMenuIndicator />
                        <NavigationMenuViewport />
                    </NavigationMenu>

                    {/* <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-gray-700 hover:text-gray-900">
                            Log In
                        </Link>
                        <Link href="/signup" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                            Sign Up
                        </Link>
                    </div> */}
                </div>

                {/* Mobile toggle button */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setMobileOpen((o) => !o)}
                    aria-label="Toggle navigation menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Mobile nav */}
            {mobileOpen && (
                <div className="md:hidden bg-white shadow border-t">
                    <div className="px-4 py-3 space-y-2">
                        <Link href="/contact" className="block px-2 py-1 rounded hover:bg-gray-100">
                            Leaderboard
                        </Link>
                        <Link href="/login" className="block px-2 py-1 rounded hover:bg-gray-100">
                            Log In
                        </Link>
                        <Link href="/signup" className="block px-2 py-2 text-center bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
