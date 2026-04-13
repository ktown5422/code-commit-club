import Link from "next/link"
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa"

import Container from "../components/Container"
import { AuthButton } from "./AuthButton"

const links = {
    product: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Home", href: "/" },
    ],
    community: [
        { label: "Discord", href: "https://discord.gg/aFNtEHSy76" },
        { label: "GitHub", href: "https://github.com/your-org" },
    ],
    social: [
        { label: "GitHub", href: "https://github.com/your-org", icon: FaGithub },
        { label: "Twitter", href: "https://twitter.com/your-handle", icon: FaTwitter },
        { label: "Discord", href: "https://discord.gg/aFNtEHSy76", icon: FaDiscord },
    ],
}

export default function Footer() {
    return (
        <footer className="border-t border-black/5 bg-white text-black">
            <div id="ready" className="border-b border-black/5 bg-[#111827] text-white">
                <Container className="py-14">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-sm font-medium uppercase tracking-wide text-indigo-300">
                                Ready when you are
                            </p>
                            <h3 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                                Make today&apos;s commit the one that keeps the habit alive.
                            </h3>
                            <p className="mt-4 max-w-xl text-lg leading-8 text-gray-300">
                                Sign in, join the club, and give your next streak a place to grow.
                            </p>
                        </div>

                        <div className="w-full max-w-sm rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                            <p className="text-sm text-gray-300">Start with one small win.</p>
                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <AuthButton />
                                <Link
                                    href="https://discord.gg/aFNtEHSy76"
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-[#5865F2] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4752C4]"
                                >
                                    Join Discord
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <div className="bg-[#f8fafc]">
                <Container className="py-16">
                    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.7fr_0.7fr_1fr]">
                        <div className="max-w-md">
                            <Link href="/" className="text-xl font-bold text-gray-900">
                                Code Commit Club
                            </Link>
                            <p className="mt-4 text-lg leading-8 text-gray-600">
                                A steady place for developers building consistency through daily
                                commits, visible progress, and shared momentum.
                            </p>
                        </div>

                        <div>
                            <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Product
                            </h5>
                            <ul className="mt-4 space-y-3">
                                {links.product.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-gray-700 transition-colors hover:text-black">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Community
                            </h5>
                            <ul className="mt-4 space-y-3">
                                {links.community.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-gray-700 transition-colors hover:text-black">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Stay connected
                            </h5>
                            <p className="mt-4 text-gray-600">
                                Keep up with community wins, updates, and the people showing up every day.
                            </p>
                            <div className="mt-5 flex items-center gap-3">
                                {links.social.map((link) => {
                                    const Icon = link.icon

                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            aria-label={link.label}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:border-indigo-200 hover:text-indigo-600"
                                        >
                                            <Icon className="h-5 w-5" />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <div className="border-t border-black/5 bg-white">
                <Container className="flex flex-col gap-2 py-5 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
                    <p>&copy; {new Date().getFullYear()} Code Commit Club. All rights reserved.</p>
                    <p>Show up, push code, keep going.</p>
                </Container>
            </div>
        </footer>
    )
}
