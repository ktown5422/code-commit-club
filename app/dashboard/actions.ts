"use server"

import { auth } from "@/lib/auth"
import {
    saveChecklistForDay,
    saveMemberSettings,
    type MemberIdentity,
    type MemberSettings,
} from "@/lib/member-store"

// Actions are a public HTTP surface, so each one re-derives who is calling from
// the session rather than accepting a user id from the client.
async function requireIdentity(): Promise<MemberIdentity> {
    const session = await auth()
    const githubLogin = session?.user?.login

    if (!githubLogin) {
        throw new Error("Sign in with GitHub before saving changes.")
    }

    return {
        email: session.user?.email,
        githubLogin,
        imageUrl: session.user?.image,
        name: session.user?.name,
    }
}

export async function saveSettingsAction(patch: Partial<MemberSettings>) {
    return saveMemberSettings(await requireIdentity(), patch)
}

export async function saveChecklistAction(dayKey: string, completedItems: string[]) {
    return saveChecklistForDay(await requireIdentity(), dayKey, completedItems)
}
