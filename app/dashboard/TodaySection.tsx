import DailyChecklist from "@/components/DailyChecklist"

import { hasCommitToday, loadDashboardData, loadTodayChecklist } from "./data"

export default async function TodaySection({ accessToken }: { accessToken?: string }) {
    const [result, checklist] = await Promise.all([
        loadDashboardData(accessToken),
        loadTodayChecklist(),
    ])

    return (
        <DailyChecklist
            dayKey={checklist.dayKey}
            hasCommitToday={hasCommitToday(result)}
            initialCompletedItems={checklist.completedItems}
        />
    )
}
