import { prisma } from '@/lib/prisma'

const main = async () => {
  const user = await prisma.user.create({
    data: {
      email: 'test@test.com',
      username: 'test',
      name: 'Test User',
    },
  })

  console.log('User created: ', user)
}

main()
  .catch(async (error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
