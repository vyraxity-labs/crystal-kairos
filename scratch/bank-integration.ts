import { prisma } from '../lib/prisma'
import {
  addBankAccountAction,
  setPrimaryBankAccountAction,
  deleteBankAccountAction,
  resolveAccountNameAction,
} from '../models/members/actions'
import { UserRole } from '../generated/prisma/enums'

async function runTest() {
  console.log('🔄 Starting Bank Configurations Integration Test...')

  // 1. Fetch test users
  const users = await prisma.user.findMany({
    where: { role: UserRole.USER },
    take: 2,
  })

  if (users.length < 2) {
    throw new Error('Test requires at least 2 regular users seeded in the database')
  }

  const [user1, user2] = users
  console.log('User 1 (Target):', user1.email)
  console.log('User 2 (Stranger):', user2.email)

  // Pre-test cleanup to ensure clean slate for user1 and user2
  console.log('Performing pre-test database bank account cleanup...')
  await prisma.bankAccount.deleteMany({
    where: { userId: { in: [user1.id, user2.id] } }
  })

  // 2. Test Account Name Lookup Resolver
  console.log('\n--- 2. Testing Account Name Lookup Resolver ---')
  const lookup1 = await resolveAccountNameAction('Access Bank', '0123456789')
  console.log('Lookup starting with 0:', lookup1)
  if (!lookup1.success || lookup1.accountName !== 'Ade Wale') {
    throw new Error('Mock lookup starting with 0 failed')
  }

  const lookup2 = await resolveAccountNameAction('GTBank', '1122334455')
  console.log('Lookup starting with 1:', lookup2)
  if (!lookup2.success || lookup2.accountName !== 'Chinelo Ngozi') {
    throw new Error('Mock lookup starting with 1 failed')
  }

  const lookup3 = await resolveAccountNameAction('UBA', '5566778899')
  console.log('Lookup starting with 5:', lookup3)
  if (!lookup3.success || lookup3.accountName !== 'Olumide Bakare') {
    throw new Error('Mock lookup default failed')
  }
  console.log('✅ Mock account lookup verified successfully.')

  // 3. Test Bank Account Creation & Primary Autoselection
  console.log('\n--- 3. Testing Bank Account Creation & Primary Autoselection ---')
  process.env.MOCK_SESSION_USER = JSON.stringify({ user: { id: user1.id, role: UserRole.USER } })

  const account1 = await addBankAccountAction(user1.id, {
    bankName: 'Access Bank',
    accountNumber: '0123456789',
    accountName: 'Ade Wale',
  })
  console.log('Added account 1 result:', account1)
  if (!account1.success || !account1.data) {
    throw new Error(`Failed to add account 1: ${account1.error}`)
  }
  if (!account1.data.isPrimary) {
    throw new Error('Expected first bank account to automatically be primary')
  }

  const account2 = await addBankAccountAction(user1.id, {
    bankName: 'GTBank',
    accountNumber: '1122334455',
    accountName: 'Chinelo Ngozi',
  })
  console.log('Added account 2 result:', account2)
  if (!account2.success || !account2.data) {
    throw new Error(`Failed to add account 2: ${account2.error}`)
  }
  if (account2.data.isPrimary) {
    throw new Error('Expected second bank account to default to not primary')
  }
  console.log('✅ Account creation and primary default selection verified.')

  // 4. Test Set Primary Bank Account
  console.log('\n--- 4. Testing Set Primary Bank Account ---')
  const primaryResult = await setPrimaryBankAccountAction(user1.id, account2.data.id)
  console.log('Set account 2 as primary result:', primaryResult)
  if (!primaryResult.success || !primaryResult.data) {
    throw new Error(`Failed to set account 2 as primary: ${primaryResult.error}`)
  }

  const checkAccount1 = await prisma.bankAccount.findUnique({ where: { id: account1.data.id } })
  const checkAccount2 = await prisma.bankAccount.findUnique({ where: { id: account2.data.id } })
  console.log('Account 1 isPrimary after update:', checkAccount1?.isPrimary)
  console.log('Account 2 isPrimary after update:', checkAccount2?.isPrimary)

  if (checkAccount1?.isPrimary || !checkAccount2?.isPrimary) {
    throw new Error('Failed to update primary account states correctly')
  }
  console.log('✅ Set primary functionality verified.')

  // 5. Test Deletion Constraints
  console.log('\n--- 5. Testing Deletion Constraints ---')
  // Try to delete primary account when user has multiple accounts (should fail)
  const deletePrimaryResult = await deleteBankAccountAction(user1.id, account2.data.id)
  console.log('Delete primary account result:', deletePrimaryResult)
  if (deletePrimaryResult.success) {
    throw new Error('Expected deletion of primary account to fail since multiple accounts exist')
  }
  console.log('✅ Deletion constraint successfully blocked deleting primary account.')

  // Delete non-primary account (should succeed)
  const deleteSecondaryResult = await deleteBankAccountAction(user1.id, account1.data.id)
  console.log('Delete non-primary account result:', deleteSecondaryResult)
  if (!deleteSecondaryResult.success) {
    throw new Error(`Failed to delete non-primary account: ${deleteSecondaryResult.error}`)
  }

  // Delete last account (which is primary, should succeed since it's the last one)
  const deleteLastResult = await deleteBankAccountAction(user1.id, account2.data.id)
  console.log('Delete last account result:', deleteLastResult)
  if (!deleteLastResult.success) {
    throw new Error(`Failed to delete last bank account: ${deleteLastResult.error}`)
  }
  console.log('✅ Deletion constraints verified successfully.')

  // 6. Test Security / Permission Block
  console.log('\n--- 6. Testing Security / Permission Block ---')
  process.env.MOCK_SESSION_USER = JSON.stringify({ user: { id: user2.id, role: UserRole.USER } })
  const strangerAddResult = await addBankAccountAction(user1.id, {
    bankName: 'Zenith Bank',
    accountNumber: '2233445566',
    accountName: 'Chinedu Okafor',
  })
  console.log('Stranger add result:', strangerAddResult)
  if (strangerAddResult.success) {
    throw new Error('Stranger was able to add bank account! Security check failed.')
  }
  console.log('✅ Stranger permission blocks verified.')

  console.log('\n🎉 BANK CONFIGURATIONS INTEGRATION TEST PASSED SUCCESSFULLY!')
}

runTest()
  .catch((err) => {
    console.error('❌ Integration Test Failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
