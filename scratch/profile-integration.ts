import { prisma } from '../lib/prisma'
import { getMemberById } from '../models/members/query'
import { updateNextOfKinAction } from '../models/members/actions'
import { Relationship, UserRole } from '../generated/prisma/enums'

async function runTest() {
  console.log('🔄 Starting Profile & Next of Kin Form Integration Test...')

  // 1. Fetch test users (one regular, one admin, another regular)
  const users = await prisma.user.findMany({
    where: { role: UserRole.USER },
    take: 2,
  })

  if (users.length < 2) {
    throw new Error(
      'Test requires at least 2 regular users seeded in the database',
    )
  }

  const [user1, user2] = users
  console.log('User 1 (Target):', user1.email)
  console.log('User 2 (Stranger):', user2.email)

  const admin = await prisma.user.findFirst({
    where: { role: UserRole.ADMIN },
  })
  if (!admin) {
    throw new Error('Test requires an Admin user seeded in the database')
  }
  console.log('Admin:', admin.email)

  // 2. Test Fetch Profile details
  console.log('\nTesting getMemberById...')
  const memberResult = await getMemberById(user1.id)
  if (!memberResult.success || !memberResult.data) {
    throw new Error(`Failed to fetch member info: ${memberResult.error}`)
  }
  console.log(
    '✅ Successfully fetched member profile. Name:',
    memberResult.data.name,
  )

  // 3. Test updateNextOfKinAction (Stranger attempts to update User 1)
  console.log('\nTesting stranger permission blocks...')
  process.env.MOCK_SESSION_USER = JSON.stringify({
    user: { id: user2.id, role: UserRole.USER },
  })

  const mockNextOfKin = {
    name: 'Stranger Mary Doe',
    phoneNumber: '+2348033334444',
    relationship: Relationship.SPOUSE,
    occupation: 'Lawyer',
    address: '99 Stranger Way, Lagos',
    bankName: 'Access Bank',
    accountNumber: '0987654321',
    accountName: 'Mary Doe',
  }

  const strangerResult = await updateNextOfKinAction(user1.id, mockNextOfKin)
  console.log('Stranger result:', strangerResult)
  if (strangerResult.success) {
    throw new Error(
      'Stranger was able to update User 1 Next of Kin! Permission block failed.',
    )
  }
  console.log('✅ stranger permission blocked correctly.')

  // 4. Test updateNextOfKinAction (Self attempts to update User 1)
  console.log('\nTesting self permission updates...')
  process.env.MOCK_SESSION_USER = JSON.stringify({
    user: { id: user1.id, role: UserRole.USER },
  })

  const selfNextOfKin = {
    name: 'Updated Mary Doe',
    phoneNumber: '+2348033334444',
    relationship: Relationship.SPOUSE,
    occupation: 'Software Engineer',
    address: '123 Self Close, Lagos',
    bankName: 'GTBank',
    accountNumber: '0123456789',
    accountName: 'Mary Doe',
  }

  const selfResult = await updateNextOfKinAction(user1.id, selfNextOfKin)
  console.log('Self result:', selfResult)
  if (!selfResult.success) {
    throw new Error(`Self update failed: ${selfResult.error}`)
  }

  // Verify database update
  const user1Nok = await prisma.nextOfKin.findUnique({
    where: { userId: user1.id },
  })
  console.log('Database Next of Kin address:', user1Nok?.address)
  if (user1Nok?.address !== '123 Self Close, Lagos') {
    throw new Error('Database was not updated with the self update values')
  }
  console.log('✅ Self update processed and saved in DB.')

  // 5. Test updateNextOfKinAction (Admin attempts to update User 1)
  console.log('\nTesting admin permission updates...')
  process.env.MOCK_SESSION_USER = JSON.stringify({
    user: { id: admin.id, role: UserRole.ADMIN },
  })

  const adminNextOfKin = {
    name: 'Admin Mary Doe',
    phoneNumber: '+2348033335555',
    relationship: Relationship.PARENT,
    occupation: 'Retired',
    address: '456 Admin Crescent, Lagos',
    bankName: 'UBA',
    accountNumber: '1122334455',
    accountName: 'Mary Doe',
  }

  const adminResult = await updateNextOfKinAction(user1.id, adminNextOfKin)
  console.log('Admin result:', adminResult)
  if (!adminResult.success) {
    throw new Error(`Admin update failed: ${adminResult.error}`)
  }

  // Verify database update
  const adminNok = await prisma.nextOfKin.findUnique({
    where: { userId: user1.id },
  })
  console.log(
    'Database Next of Kin address after admin update:',
    adminNok?.address,
  )
  if (adminNok?.address !== '456 Admin Crescent, Lagos') {
    throw new Error('Database was not updated with the admin update values')
  }
  console.log('✅ Admin update processed and saved in DB.')

  // Clean up
  console.log('\nCleaning up database changes...')
  await prisma.nextOfKin.delete({ where: { userId: user1.id } })
  console.log('✅ Cleanup complete.')

  console.log(
    '\n🎉 PROFILE & NEXT OF KIN FORM INTEGRATION TEST PASSED SUCCESSFULLY!',
  )
}

runTest()
  .catch((err) => {
    console.error('❌ Integration Test Failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
