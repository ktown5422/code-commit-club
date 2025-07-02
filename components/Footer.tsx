import Link from "next/link"
import Container from "../components/Container"
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa"
import { AuthButton } from "./AuthButton"

export default function Footer() {
    return (
        <footer className="text-gray-200">
            <div id="ready" className="bg-indigo-600">
                <Container className="py-12 flex flex-col md:flex-row items-center justify-between">
                    <h3 className="text-2xl font-semibold text-white mb-4 md:mb-0">
                        Ready to build the habit?
                    </h3>
                    <AuthButton />
                </Container>
            </div>


            <div className="bg-gray-900">
                <Container className="py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h5 className="text-lg font-semibold text-white mb-4">Company</h5>
                        <ul className="space-y-2">

                            <li>
                                <Link href="/" className="hover:text-white">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>


                    <div>
                        <h5 className="text-lg font-semibold text-white mb-4">Community</h5>
                        <ul className="space-y-2">

                            <li>
                                <Link href="https://discord.gg/aFNtEHSy76" className="hover:text-white">
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
                        <div className="flex space-x-4">
                            <Link className="hover:text-white" href="https://github.com/your-org">
                                <FaGithub className="w-6 h-6" />
                            </Link>
                            <Link className="hover:text-white" href="https://twitter.com/your-handle">
                                <FaTwitter className="w-6 h-6" />
                            </Link>
                            <Link className="hover:text-white" href="https://discord.gg/your-invite">
                                <FaDiscord className="w-6 h-6" />
                            </Link>
                        </div>
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
