import { prisma } from '@/lib/prisma'
import { users } from '../data/users'
import bcrypt from 'bcryptjs'

export const seedUsers = async () => {
  console.log('🌱 Seeding users...')
  await Promise.all(
    users.map(async (user) => {
      let passwordHash: string | undefined
      if (user.hasSetPassword && user.password) {
        const salt = await bcrypt.genSalt(10)
        passwordHash = await bcrypt.hash(user.password, salt)
      }

      await prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          name: user.name,
          passwordHash,
          role: user.role,
          hasSetPassword: user.hasSetPassword,
        },
      })
    }),
  )
  console.log('✅ Users seeded successfully.')
}
