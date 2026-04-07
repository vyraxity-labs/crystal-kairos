import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './lib/prisma'
import Credentials from 'next-auth/providers/credentials'
import { UserRole } from './generated/prisma/enums'

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('CRED ==>', credentials)

        if (!credentials.email) return null

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!user) return null

        return user
      },
    }),
  ],
})
