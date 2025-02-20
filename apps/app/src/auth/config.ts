import type { DefaultSession, NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@kouza/db"
import { PrismaAdapter } from "@auth/prisma-adapter"

declare module "next-auth" {
  interface User {
    organizationId?: string
    onboarded?: boolean
    full_name?: string
    avatar_url?: string
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      onboarded?: boolean
      full_name?: string
      avatar_url?: string
    } & DefaultSession["user"]
  }
}

async function comparePasswords(plaintext: string, hashed: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plaintext)
  const hashBuffer = Uint8Array.from(atob(hashed), (c) => c.charCodeAt(0))

  const digest = await crypto.subtle.digest("SHA-256", data)
  const hashedInput = btoa(String.fromCharCode(...new Uint8Array(digest)))

  return hashedInput === hashed
}

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        const user = await db.user.findFirst({
          where: {
            email,
          },
        })

        if (!user || !user.password) return null

        const isValidPassword = await comparePasswords(password, user.password)
        if (!isValidPassword) return null

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.user.findFirst({
          where: { email: user.email! },
        })

        if (!existingUser) {
          const newUser = await db.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image!,
              emailVerified: new Date(),
              googleId: user.id,
            },
          })
          user.id = String(newUser.id)
        } else {
          if (!existingUser.googleId) {
            await db.user.update({
              where: { id: existingUser.id },
              data: { googleId: user.id },
            })
          }
          user.id = String(existingUser.id)
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        try {
          const user = await db.user.findFirst({
            where: {
              OR: [{ id: parseInt(token.sub) }, { googleId: token.sub }],
            },
          })
          if (user) {
            session.user.id = String(user.id)
          }
        } catch (error) {
          console.error("Session Error:", error)
        }
      }
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
  events: {
    signIn: async ({ user }) => {
      if (user?.id) {
        const userId = parseInt(user.id)
        if (!isNaN(userId)) {
          await db.user.update({
            where: { id: userId },
            data: { lastLogin: new Date() },
          })
        }
      }
    },
  },
} satisfies NextAuthConfig
