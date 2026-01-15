import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow emails ending with @cornell.edu
      return user.email?.endsWith("@cornell.edu") ?? false;
    },
    async redirect({ baseUrl }) {
      // Always redirect to /files after successful login
      return `${baseUrl}/files`;
    },
  },
} satisfies NextAuthConfig;

