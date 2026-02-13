import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        // Vercel provider usually requires custom implementation or OIDC, 
        // for now we'll stick to GitHub as the primary "Developer" login.
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.sub
                session.accessToken = token.accessToken // Pass to client/API
            }
            return session
        },
    },
})
