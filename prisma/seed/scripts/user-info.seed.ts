import { prisma } from '@/lib/prisma'
import { userInfos } from '../data/user-infos'

export const seedUserInfos = async (userIds: string[]) => {
  console.log('🌱 Seeding user infos...')
  await Promise.all(
    userInfos.map(async (userInfo, index) => {
      await prisma.userInfo.create({
        data: {
          address: userInfo.address,
          dateOfBirth: userInfo.dateOfBirth,
          gender: userInfo.gender,
          occupation: userInfo.occupation,
          phoneNumber: userInfo.phoneNumber,
          userId: userIds[index],
        },
      })
    }),
  )
  console.log('✅ User infos seeded successfully.')
}
