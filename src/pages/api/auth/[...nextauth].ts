import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const clientId = process.env.GOOGLE_ID as string
const clientSecret = process.env.GOOGLE_SECRET as string
const secret = process.env.SECRET as string

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  secret,
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.id
      session.accessToken = token.accessToken
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
})
