
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub],
    callbacks: {
        async redirect({ baseUrl }) {
            // always send users to /dashboard on sign-in
            return `${baseUrl}/dashboard`
        },
    },
})
