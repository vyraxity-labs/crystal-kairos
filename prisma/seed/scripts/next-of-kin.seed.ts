import { prisma } from '@/lib/prisma'
import { nextOfKins } from '../data/next-of-kins'

export const seedNextOfKins = async (userIds: string[]) => {
  console.log('🌱 Seeding next of kins...')
  await Promise.all(
    nextOfKins.map(async (nextOfKin, index) => {
      await prisma.nextOfKin.create({
        data: {
          userId: userIds[index],
          name: nextOfKin.name,
          phoneNumber: nextOfKin.phoneNumber,
          relationship: nextOfKin.relationship,
          bankName: nextOfKin.bankName,
          accountNumber: nextOfKin.accountNumber,
          accountName: nextOfKin.accountName,
          occupation: nextOfKin.occupation,
          address: nextOfKin.address,
        },
      })
    }),
  )
  console.log('✅ Next of kins seeded successfully.')
}
