import { prisma } from '@/lib/prisma'
import { seedUsers } from './scripts/user.seed'
import { seedUserInfos } from './scripts/user-info.seed'
import { UserRole } from '@/generated/prisma/enums'
import { seedBankAccounts } from './scripts/bank-accounts.seed'
import { seedNextOfKins } from './scripts/next-of-kin.seed'
import { seedMemberships } from './scripts/membership.seed'

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

  console.log('✅ Seeding completed successfully.')
}

main()
  .catch(async (error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
