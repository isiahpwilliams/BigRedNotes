import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user.email?.endsWith("@cornell.edu") ?? false
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/files`
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth } = NextAuth(authConfig)