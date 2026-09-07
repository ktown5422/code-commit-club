import DailyChecklist from "@/components/DailyChecklist"

import { hasCommitToday, loadDashboardData } from "./data"

export default async function TodaySection({ accessToken }: { accessToken?: string }) {
    const result = await loadDashboardData(accessToken)

    return <DailyChecklist hasCommitToday={hasCommitToday(result)} />
}
