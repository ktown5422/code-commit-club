import Link from "next/link"
import Container from "../components/Container"
import { Button } from "../styleguide/components/ui/button"

export default function Footer() {
    return (
        <footer className="text-gray-200">
            <div className="bg-indigo-600">
                <Container className="py-12 flex flex-col md:flex-row items-center justify-between">
                    <h3 className="text-2xl font-semibold text-white mb-4 md:mb-0">
                        Ready to build the habit?
                    </h3>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </Container>
            </div>


            <div className="bg-gray-900">
                <Container className="py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h5 className="text-lg font-semibold text-white mb-4">Company</h5>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-white">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>


                    <div>
                        <h5 className="text-lg font-semibold text-white mb-4">Community</h5>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/signup" className="hover:text-white">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-white">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/discord" className="hover:text-white">
                                    Discord
                                </Link>
                            </li>
                        </ul>
                    </div>


                    <div className="md:col-span-2">
                        <h5 className="text-lg font-semibold text-white mb-4">
                            Stay Connected
                        </h5>
                        <p className="mb-4 text-gray-400">
                            Follow us on social media for updates and community highlights.
                        </p>

                    </div>
                </Container>
            </div>


            <div className="bg-gray-800">
                <Container className="py-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Code Commit Club. All rights reserved.
                </Container>
            </div>
        </footer>
    )
}
