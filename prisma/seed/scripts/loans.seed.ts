import { randomize } from '@/prisma/utils'
import { loans } from '../data/loans'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/client'

export const seedLoans = async (
  users: {
    id: string
    name: string
    bankName: string
    accountNumber: string
    accountName: string
  }[],
) => {
  console.log('🌱 Seeding loans...')
  const neededUsers = randomize({ list: users, total: loans.length })

  await Promise.all(
    loans.map(async (loan, index) => {
      await prisma.loan.create({
        data: {
          userId: neededUsers[index].id,
          requestedAmount: new Decimal(loan.requestedAmount),
          approvedAmount: new Decimal(loan.approvedAmount),
          interestRate: new Decimal(loan.interestRate),
          duration: loan.duration,
          purpose: loan.purpose,
          guarantorId: loan.guarantorId,
          guarantorName: loan.guarantorName,
          guarantorPhoneNumber: loan.guarantorPhoneNumber,
          collateralDetails: loan.collateralDetails,
          applicationFee: new Decimal(loan.applicationFee),
          outstandingBalance: new Decimal(loan.outstandingBalance),
          totalRepaid: new Decimal(loan.totalRepaid),
          defaultPenalty: new Decimal(loan.defaultPenalty),
          gracePeriodDays: loan.gracePeriodDays,
          isAnonymousRequest: false,
          status: loan.status,
        },
      })
    }),
  )
  console.log('✅ Loans seeded successfully.')
}
