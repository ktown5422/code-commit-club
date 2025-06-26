
import { redirect } from "next/navigation"
import { auth } from "../../lib/auth"
import Navbar from "@/components/Navbar"

export default async function DashboardPage() {
    const session = await auth()
    if (!session) {

        return redirect("/")
    }

    return (
        <>
            <Navbar />
            <div className="mt-40 mb-8 text-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Manage your account and settings.</p>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-center">
                Welcome back, {session.user?.name}!
            </h1>
            {/* dashboard UI… */}
        </>
    )
}
