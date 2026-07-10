import { prisma } from '../lib/prisma'
import { joinEAjoAction, submitEAjoContributionAction } from '../models/eajo/actions'
import { getEAjoById, getAjoFeeConfigsForDuration } from '../models/eajo/query'
import { transitionTransaction } from '../models/transactions/actions'
import { EAjoDuration, EAjoFrequency, EAjoStatus, TransactionStatus, UserRole } from '../generated/prisma/enums'

const runIntegrationTest = async () => {
  console.log('🤖 Running Digital Ajo Groups Member Flow Integration Test...')

  // Setup mock session
  const testUser = await prisma.user.findFirst({
    where: { role: UserRole.USER },
  })

  if (!testUser) {
    console.error('❌ No member user found for testing. Please seed the DB.')
    process.exit(1)
  }

  process.env.MOCK_SESSION_USER = JSON.stringify({
    user: {
      id: testUser.id,
      role: UserRole.USER,
      email: testUser.email,
    }
  })


  // Test 1: Fetch fee configurations for 6-Month duration
  console.log('\n--- Test 1: Fetching Ajo Fee Configs for SIX_MONTHS ---')
  const configResult = await getAjoFeeConfigsForDuration(EAjoDuration.SIX_MONTHS)
  if (!configResult.success || configResult.data.length === 0) {
    console.error('❌ Failed to fetch fee configurations')
    process.exit(1)
  }
  console.log(`✅ Retrieved ${configResult.data.length} fee configurations successfully.`)

  // Test 2: Join EAjo Group (payout position 3 out of 6)
  console.log('\n--- Test 2: Joining EAjo Group (payoutPosition: 3, SIX_MONTHS) ---')
  const joinData = {
    contributionAmount: 50000,
    totalParticipants: 6,
    duration: EAjoDuration.SIX_MONTHS,
    frequency: EAjoFrequency.MONTHLY,
    payoutPosition: 3,
    guarantorName: 'Ade Guarantor',
    guarantorPhoneNumber: '08012345678',
    bankName: 'Access Bank',
    accountNumber: '0123456789',
    accountName: 'Ade Test Account',
  }

  const joinResult = await joinEAjoAction(testUser.id, joinData)
  if (!joinResult.success || !joinResult.data) {
    console.error('❌ Failed to join Ajo group:', joinResult.error)
    process.exit(1)
  }

  const eAjo = joinResult.data
  console.log('✅ Successfully joined Ajo group!')
  console.log(`- Contribution: ₦${eAjo.contributionAmount}`)
  console.log(`- Payout Position: ${eAjo.payoutPosition}`)
  console.log(`- Fee Percentage: ${eAjo.feePercentage}%`)
  console.log(`- Fee Amount: ₦${eAjo.feeAmount}`)
  console.log(`- Expected Net Payout: ₦${eAjo.netPayoutAmount}`)
  console.log(`- Status: ${eAjo.status}`)

  if (Number(eAjo.feePercentage) !== 6 || Number(eAjo.feeAmount) !== 18000 || Number(eAjo.netPayoutAmount) !== 282000) {
    console.error('❌ Calculation check failed! Expected fee: 6%, 18k, net: 282k.')
    process.exit(1)
  }
  console.log('✅ Mathematical verification checks passed.')

  // Test 3: Submit Contribution Receipt
  console.log('\n--- Test 3: Submitting Ajo Contribution Receipt ---')
  const contributionAmount = 50000
  const receiptUrl = 'https://cloudinary.com/receipts/ajo-contrib-1.jpg'
  const txResult = await submitEAjoContributionAction(
    testUser.id,
    eAjo.id,
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
  console.log(`- Receipt URL: ${transaction.receiptUrl}`)

  // Test 4: Confirm Transaction & Check Balance Updates
  console.log('\n--- Test 4: Confirming Ajo Contribution Transaction ---')
  // We mock the session as ADMIN/OWNER to confirm transaction
  const adminUser = await prisma.user.findFirst({
    where: { role: 'OWNER' },
  })
  if (!adminUser) {
    console.error('❌ No admin user found for transaction transition testing.')
    process.exit(1)
  }

  process.env.MOCK_SESSION_USER = JSON.stringify({
    user: {
      id: adminUser.id,
      role: 'OWNER',
      email: adminUser.email,
    }
  })


  const confirmResult = await transitionTransaction(transaction.id, 'CONFIRM', adminUser.id)
  if (!confirmResult.success) {
    console.error('❌ Failed to confirm transaction:', confirmResult.error)
    process.exit(1)
  }

  console.log('✅ Transaction confirmed successfully.')

  // Check Ajo balance updates
  const ajoDetailsResult = await getEAjoById(eAjo.id)
  if (!ajoDetailsResult.success || !ajoDetailsResult.data) {
    console.error('❌ Failed to fetch updated Ajo details')
    process.exit(1)
  }

  const updatedAjo = ajoDetailsResult.data
  console.log(`✅ Ajo updated details loaded:`)
  console.log(`- Current Balance: ₦${updatedAjo.currentBalance}`)
  console.log(`- Total Contributed: ₦${updatedAjo.totalContributed}`)
  console.log(`- Total Transactions: ${updatedAjo.transactions.length}`)

  if (Number(updatedAjo.currentBalance) !== 50000 || Number(updatedAjo.totalContributed) !== 50000) {
    console.error('❌ Ledger balance synchronization validation failed!')
    process.exit(1)
  }
  console.log('✅ Ledger balance synchronization validation passed successfully.')

  // Clean up
  console.log('\n--- Cleaning up test records ---')
  await prisma.transaction.delete({ where: { id: transaction.id } })
  await prisma.eAjo.delete({ where: { id: eAjo.id } })
  console.log('✅ Test records cleaned up successfully.')

  console.log('\n🌟 DIGITAL AJO GROUPS INTEGRATION TEST PASSED COMPLETELY! 🌟')
}

runIntegrationTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
