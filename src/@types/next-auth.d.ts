/* eslint-disable no-unused-vars */
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken: string | undefined
    user: {
      id: string
      name: string
      email: string
      image: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string | undefined
    id: string
  }
}
