
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, Menu, Sparkles, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { AuthButton } from "./AuthButton"

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
                                src="/CodeStreak-Logo.png"
                                alt="CodeStreak Logo"
                                width={36}
                                height={36}
                                className="rounded-md"
                            />
                            <div className="min-w-0">
                                <span className="block truncate text-base font-bold text-gray-900 sm:text-lg">
                                    CodeStreak
                                </span>
                                <span className="hidden text-xs text-gray-500 sm:block">
                                    Daily commits, lasting habits
                                </span>
                            </div>
                        </Link>

                        <button
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 text-gray-700 transition-colors hover:bg-gray-100"
                            onClick={() => setMobileOpen((open) => !open)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </nav>
                </div>
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
                    <div className="mx-auto max-w-7xl px-4 pt-4" onClick={(event) => event.stopPropagation()}>
                        <div className="ml-auto w-full max-w-md overflow-hidden rounded-lg border border-black/10 bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                                        Navigation
                                    </p>
                                    <p className="mt-1 text-lg font-bold text-gray-900">
                                        CodeStreak
                                    </p>
                                </div>
                                <button
                                    className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 text-gray-700 transition-colors hover:bg-gray-100"
                                    onClick={() => setMobileOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6 p-5">
                                <div className="rounded-lg bg-[#f8fafc] p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                                        <Sparkles className="h-4 w-4" />
                                        Keep your streak moving
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        Jump back into your workflow, check your dashboard, and keep the habit alive.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Link
                                        href="/"
                                        className="block rounded-lg border border-black/10 px-4 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-50"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Home
                                    </Link>
                                    {session && (
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 rounded-lg border border-black/10 px-4 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-50"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    )}
                                </div>

                                <div className="border-t border-black/10 pt-5">
                                    <AuthButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
