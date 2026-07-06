import { prisma } from '@/lib/prisma'
import { seedUsers } from './scripts/user.seed'
import { seedUserInfos } from './scripts/user-info.seed'
import { UserRole } from '@/generated/prisma/enums'
import { seedBankAccounts } from './scripts/bank-accounts.seed'
import { seedNextOfKins } from './scripts/next-of-kin.seed'
import { seedMemberships } from './scripts/membership.seed'
import { seedEajo } from './scripts/e-ajo.seed'
import { seedSavings } from './scripts/savings.seed'
import { seedLoans } from './scripts/loans.seed'

const main = async () => {
  console.log('🌱 Seeding database...')

  await seedUsers()

  const users = await prisma.user.findMany({
    where: { role: UserRole.USER },
    select: { id: true, name: true },
  })
  const userIds = users.map((user) => user.id)
  const userNames = users.map((user) => user.name)

  if (users.length !== 4) {
    throw new Error('4 users must be created before seeding')
  }

  await seedUserInfos(userIds)

  await seedBankAccounts(userIds, userNames)

  await seedNextOfKins(userIds)

  await seedMemberships(userIds)

  const usersWithBankAccounts = await prisma.user.findMany({
    where: { role: UserRole.USER, bankAccounts: { some: {} } },
    select: { id: true, name: true, bankAccounts: true },
  })

  await seedSavings(
    usersWithBankAccounts.map((user) => ({
      id: user.id,
      name: user.name,
      bankName: user.bankAccounts[0].bankName,
      accountNumber: user.bankAccounts[0].accountNumber,
      accountName: user.bankAccounts[0].accountName,
    })),
  )
  await seedEajo(
    usersWithBankAccounts.map((user) => ({
      id: user.id,
      name: user.name,
      bankName: user.bankAccounts[0].bankName,
      accountNumber: user.bankAccounts[0].accountNumber,
      accountName: user.bankAccounts[0].accountName,
    })),
  )
  await seedLoans(
    usersWithBankAccounts.map((user) => ({
      id: user.id,
      name: user.name,
      bankName: user.bankAccounts[0].bankName,
      accountNumber: user.bankAccounts[0].accountNumber,
      accountName: user.bankAccounts[0].accountName,
    })),
  )

  await seedAjoFeeConfigs()

  console.log('✅ Seeding completed successfully.')
}

const seedAjoFeeConfigs = async () => {
  console.log('🌱 Seeding Ajo fee configurations...')

  const configs = [
    // 4-Month
    { durationMonths: 4, pickPosition: 1, feePercentage: 10.0 },
    { durationMonths: 4, pickPosition: 2, feePercentage: 7.0 },
    { durationMonths: 4, pickPosition: 3, feePercentage: 4.0 },
    { durationMonths: 4, pickPosition: 4, feePercentage: 1.0 },

    // 6-Month
    { durationMonths: 6, pickPosition: 1, feePercentage: 10.0 },
    { durationMonths: 6, pickPosition: 2, feePercentage: 8.0 },
    { durationMonths: 6, pickPosition: 3, feePercentage: 6.0 },
    { durationMonths: 6, pickPosition: 4, feePercentage: 4.0 },
    { durationMonths: 6, pickPosition: 5, feePercentage: 2.0 },
    { durationMonths: 6, pickPosition: 6, feePercentage: 1.0 },

    // 12-Month
    { durationMonths: 12, pickPosition: 1, feePercentage: 20.0 },
    { durationMonths: 12, pickPosition: 2, feePercentage: 18.0 },
    { durationMonths: 12, pickPosition: 3, feePercentage: 16.0 },
    { durationMonths: 12, pickPosition: 4, feePercentage: 14.0 },
    { durationMonths: 12, pickPosition: 5, feePercentage: 12.0 },
    { durationMonths: 12, pickPosition: 6, feePercentage: 10.0 },
    { durationMonths: 12, pickPosition: 7, feePercentage: 8.0 },
    { durationMonths: 12, pickPosition: 8, feePercentage: 6.0 },
    { durationMonths: 12, pickPosition: 9, feePercentage: 4.0 },
    { durationMonths: 12, pickPosition: 10, feePercentage: 2.0 },
    { durationMonths: 12, pickPosition: 11, feePercentage: 1.0 },
    { durationMonths: 12, pickPosition: 12, feePercentage: 1.0 },
  ]

  for (const config of configs) {
    await prisma.ajoFeeConfig.upsert({
      where: {
        durationMonths_pickPosition: {
          durationMonths: config.durationMonths,
          pickPosition: config.pickPosition,
        },
      },
      update: {
        feePercentage: config.feePercentage,
      },
      create: {
        durationMonths: config.durationMonths,
        pickPosition: config.pickPosition,
        feePercentage: config.feePercentage,
      },
    })
  }

  console.log('✅ Ajo fee configurations seeded successfully.')
}

main()
  .catch(async (error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
