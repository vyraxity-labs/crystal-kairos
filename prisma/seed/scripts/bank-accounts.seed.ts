import { prisma } from '@/lib/prisma'
import { bankAccounts } from '../data/bank-accounts'

export const seedBankAccounts = async (
  userIds: string[],
  userNames: string[],
) => {
  console.log('🌱 Seeding bank accounts...')
  await Promise.all(
    bankAccounts.map(async (bankAccount, index) => {
      await prisma.bankAccount.create({
        data: {
          userId: userIds[index],
          accountNumber: bankAccount.accountNumber,
          accountName: userNames[index],
          bankName: bankAccount.bankName,
          isPrimary: bankAccount.isPrimary,
        },
      })
    }),
  )
  console.log('✅ Bank accounts seeded successfully.')
}
