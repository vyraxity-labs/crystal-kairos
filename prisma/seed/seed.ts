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
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
