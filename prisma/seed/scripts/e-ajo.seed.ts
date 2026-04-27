import { prisma } from '@/lib/prisma'
import { eAjo } from '../data/e-ajo'
import { randomize } from '@/prisma/utils'

export const seedEajo = async (
  userIds: {
    id: string
    name: string
    bankName: string
    accountNumber: string
    accountName: string
  }[],
) => {
  console.log('🌱 Seeding e-ajo...')
  const users = randomize({ list: userIds, total: eAjo.length })

  await Promise.all(
    eAjo.map(async (item, index) => {
      await prisma.eAjo.create({
        data: {
          userId: users[index].id,
          contributionAmount: item.contributionAmount,
          duration: item.duration,
          frequency: item.frequency,
          totalParticipants: item.totalParticipants,
          payoutPosition: item.payoutPosition,
          feePercentage: item.feePercentage,
          feeAmount: item.feeAmount,
          totalExpectedPayout: item.totalExpectedPayout,
          netPayoutAmount: item.netPayoutAmount,
          guarantorName: '',
          guarantorPhoneNumber: '',
          bankName: users[index].bankName,
          accountNumber: users[index].accountNumber,
          accountName: users[index].accountName,
        },
      })
    }),
  )
  console.log('✅ e-ajo seeded successfully.')
}
