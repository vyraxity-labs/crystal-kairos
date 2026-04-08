import { prisma } from '@/lib/prisma'
import { memberships } from '../data/memberships'

export const seedMemberships = async (userIds: string[]) => {
  console.log('🌱 Seeding memberships...')
  await Promise.all(
    memberships.map(async (membership, index) => {
      await prisma.membership.create({
        data: {
          sourceOfIncome: membership.sourceOfIncome,
          interests: membership.interests,
          referralName: membership.referralName,
          referralPhoneNumber: membership.referralPhoneNumber,
          membershipNumber: membership.membershipNumber,
          assumptions: membership.assumptions,
          tier: membership.tier,
          status: membership.status,
          userId: userIds[index],
        },
      })
    }),
  )
  console.log('✅ Memberships seeded successfully.')
}
