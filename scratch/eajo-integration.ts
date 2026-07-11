import { prisma } from '../lib/prisma'
import { applyToEAjoGroupAction, submitEAjoContributionAction } from '../models/eajo/actions'
import { createEAjoGroupAction, approveEAjoMemberAction, activateEAjoGroupAction } from '../models/admin/actions'
import { getEAjoGroupById } from '../models/admin/query'
import { transitionTransaction } from '../models/transactions/actions'
import { EAjoDuration, EAjoFrequency, TransactionStatus, UserRole } from '../generated/prisma/enums'

const runIntegrationTest = async () => {
  console.log('🤖 Running NEW Digital Ajo Groups Member Flow Integration Test...')

  // Setup mock session
  const testUser = await prisma.user.findFirst({
    where: { role: UserRole.USER },
  })

  const adminUser = await prisma.user.findFirst({
    where: { role: UserRole.OWNER },
  })

  if (!testUser || !adminUser) {
    console.error('❌ No member or admin user found for testing. Please seed the DB.')
    process.exit(1)
  }

  // --- Helper to mock session ---
  const setMockSession = (user: { id: string; role: string; email: string }) => {
    process.env.MOCK_SESSION_USER = JSON.stringify({
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      }
    })
  }

  // Test 1: Admin Creates EAjo Group
  console.log('\n--- Test 1: Admin Creates EAjo Group (SIX_MONTHS) ---')
  setMockSession(adminUser)

  const groupData = {
    title: 'Test Integration Group',
    description: 'A test group for integration flow',
    contributionAmount: 50000,
    frequency: EAjoFrequency.MONTHLY,
    duration: EAjoDuration.SIX_MONTHS,
  }

  const groupResult = await createEAjoGroupAction(groupData)
  if (!groupResult.success || !groupResult.data) {
    console.error('❌ Failed to create EAjo group:', groupResult.error)
    process.exit(1)
  }

  const groupId = groupResult.data.id
  console.log(`✅ Successfully created Ajo group! (ID: ${groupId})`)

  // Test 2: Member Applies to EAjo Group (payout position 3)
  console.log('\n--- Test 2: Member Applies to EAjo Group (payoutPosition: 3) ---')
  setMockSession(testUser)

  const applyData = {
    payoutPosition: 3,
    guarantorName: 'Ade Guarantor',
    guarantorPhoneNumber: '08012345678',
    bankName: 'Access Bank',
    accountNumber: '0123456789',
    accountName: 'Ade Test Account',
  }

  const applyResult = await applyToEAjoGroupAction(testUser.id, groupId, applyData)
  if (!applyResult.success || !applyResult.data) {
    console.error('❌ Failed to apply to Ajo group:', applyResult.error)
    process.exit(1)
  }

  const eAjoMember = applyResult.data
  console.log('✅ Successfully applied to Ajo group!')
  console.log(`- Payout Position: ${eAjoMember.payoutPosition}`)
  console.log(`- Fee Percentage: ${eAjoMember.feePercentage}%`)
  console.log(`- Expected Net Payout: ₦${eAjoMember.netPayoutAmount}`)
  console.log(`- Status: ${eAjoMember.status}`)

  // Test 3: Admin Approves Application & Activates Group
  console.log('\n--- Test 3: Admin Approves Member & Activates Group ---')
  setMockSession(adminUser)

  const approveResult = await approveEAjoMemberAction(eAjoMember.id)
  if (!approveResult.success) {
    console.error('❌ Failed to approve member:', approveResult.error)
    process.exit(1)
  }
  console.log('✅ Successfully approved member application.')

  const activateResult = await activateEAjoGroupAction(groupId)
  if (!activateResult.success) {
    console.error('❌ Failed to activate group:', activateResult.error)
    process.exit(1)
  }
  console.log('✅ Successfully activated Ajo group.')

  // Test 4: Member Submits Contribution Receipt
  console.log('\n--- Test 4: Submitting Ajo Contribution Receipt ---')
  setMockSession(testUser)

  const contributionAmount = 50000
  const receiptUrl = 'https://cloudinary.com/receipts/ajo-contrib-1.jpg'
  const txResult = await submitEAjoContributionAction(
    testUser.id,
    eAjoMember.id,
    contributionAmount,
    receiptUrl,
    'TX-REF-10023',
    'Monthly traders contribution'
  )

  if (!txResult.success || !txResult.data) {
    console.error('❌ Failed to submit contribution:', txResult.error)
    process.exit(1)
  }

  const transaction = txResult.data
  console.log('✅ Contribution transaction created successfully!')
  console.log(`- ID: ${transaction.id}`)
  console.log(`- Category: ${transaction.category}`)
  console.log(`- Status: ${transaction.status}`)

  // Test 5: Admin Confirms Transaction & Balances Update
  console.log('\n--- Test 5: Confirming Ajo Contribution Transaction ---')
  setMockSession(adminUser)

  const confirmResult = await transitionTransaction(transaction.id, 'CONFIRM', adminUser.id)
  if (!confirmResult.success) {
    console.error('❌ Failed to confirm transaction:', confirmResult.error)
    process.exit(1)
  }

  console.log('✅ Transaction confirmed successfully.')

  // Check Ajo balance updates via group query
  const ajoDetailsResult = await getEAjoGroupById(groupId)
  if (!ajoDetailsResult.success || !ajoDetailsResult.data) {
    console.error('❌ Failed to fetch updated Ajo details')
    process.exit(1)
  }

  const updatedGroup = ajoDetailsResult.data
  const updatedMember = updatedGroup.members.find((m: any) => m.id === eAjoMember.id)
  
  if (!updatedMember) {
    console.error('❌ Member not found in updated group details')
    process.exit(1)
  }

  console.log(`✅ Ajo updated details loaded:`)
  console.log(`- Current Balance: ₦${updatedMember.currentBalance}`)
  console.log(`- Total Contributed: ₦${updatedMember.totalContributed}`)

  if (Number(updatedMember.currentBalance) !== 50000 || Number(updatedMember.totalContributed) !== 50000) {
    console.error('❌ Ledger balance synchronization validation failed!')
    process.exit(1)
  }
  console.log('✅ Ledger balance synchronization validation passed successfully.')

  // Clean up
  console.log('\n--- Cleaning up test records ---')
  await prisma.transaction.delete({ where: { id: transaction.id } })
  await prisma.eAjoMember.delete({ where: { id: eAjoMember.id } })
  await prisma.eAjoGroup.delete({ where: { id: groupId } })
  console.log('✅ Test records cleaned up successfully.')

  console.log('\n🌟 DIGITAL AJO GROUPS INTEGRATION TEST PASSED COMPLETELY! 🌟')
}

runIntegrationTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
