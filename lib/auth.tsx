import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [GitHub],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account?.provider === "github") {
                token.accessToken = account.access_token
            }

            if (profile && "login" in profile && typeof profile.login === "string") {
                token.login = profile.login
            }

            return token
        },
        async session({ session, token }) {
            session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined

            if (session.user) {
                session.user.login = typeof token.login === "string" ? token.login : undefined
            }

            return session
        },
        async redirect({ baseUrl }) {
            // always send users to /dashboard on sign-in
            return `${baseUrl}/dashboard`
        },
    },
})
