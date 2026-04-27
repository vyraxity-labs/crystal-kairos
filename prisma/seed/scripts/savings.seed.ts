import { prisma } from '@/lib/prisma'
import { randomize } from '@/prisma/utils'
import { savings } from '../data/savings'
import { SavingsStatus } from '@/generated/prisma/enums'
import { Decimal } from '@prisma/client/runtime/index-browser'

export const seedSavings = async (
  users: {
    id: string
    name: string
    bankName: string
    accountNumber: string
    accountName: string
  }[],
) => {
  console.log('🌱 Seeding savings...')
  const neededUsers = randomize({ list: users, total: savings.length })

  await Promise.all(
    savings.map(async (saving, index) => {
      await prisma.savings.create({
        data: {
          userId: neededUsers[index].id,
          savingsType: saving.savingsType,
          targetAmount: saving.targetAmount,
          frequency: saving.frequency,
          maturity: saving.maturity,
          interestRate: new Decimal(saving.interestRate),
          bankName: neededUsers[index].bankName,
          accountNumber: neededUsers[index].accountNumber,
          accountName: neededUsers[index].accountName,
          currentBalance: new Decimal(0),
          accruedInterest: new Decimal(0),
          totalDeposited: new Decimal(0),
          expectedMaturityAmount: new Decimal(saving.targetAmount),
          isAnonymousRequest: false,
          status: SavingsStatus.PENDING,
        },
      })
    }),
  )
  console.log('✅ Savings seeded successfully.')
}
