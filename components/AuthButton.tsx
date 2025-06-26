"use client"

import { Button } from "../styleguide/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"

export function AuthButton() {
    const { data: session } = useSession()
    console.log("AuthButton session:", session)
    return session
        ? <Button onClick={() => signOut()}>Sign out</Button>
        : <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
}
