"use client"

interface User { username: string; commits: number }
interface LeaderboardProps { data: User[] }

export default function Leaderboard({ data }: LeaderboardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
            <ol className="space-y-2 list-decimal list-inside">
                {data.map((u) => (
                    <li key={u.username} className="flex justify-between">
                        <span>{u.username}</span>
                        <span className="font-medium">{u.commits}</span>
                    </li>
                ))}
            </ol>
        </div>
    )
}
