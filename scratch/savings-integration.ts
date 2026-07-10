import { prisma } from '../lib/prisma'
import {
  createSavingsPlanAction,
  submitSavingsDepositAction,
  requestSavingsWithdrawalAction,
} from '../models/savings/actions'
import { transitionTransaction } from '../models/transactions/actions'
import {
  SavingsType,
  SavingsFrequency,
  SavingsMaturity,
  SavingsStatus,
  TransactionCategory,
  TransactionType,
  TransactionStatus,
  UserRole,
} from '@/generated/prisma/enums'

async function runSavingsIntegrationTest() {
  console.log('🤖 Running Savings Packages Integration Test...')

  // 1. Fetch a test user
  const testUser = await prisma.user.findFirst({
    where: { role: UserRole.USER },
  })

  if (!testUser) {
    console.error('❌ No user found to run integration tests. Seed database first.')
    process.exit(1)
  }

  // Set mock session user for actions
  process.env.MOCK_SESSION_USER = JSON.stringify({
    user: {
      id: testUser.id,
      role: UserRole.USER,
      email: testUser.email,
    }
  })

  // 2. Create FIXED savings plan
  console.log('\n--- Test 1: Creating FIXED Savings Plan (₦100,000, 6 Months, 12% Interest) ---')
  const createFixedRes = await createSavingsPlanAction(testUser.id, {
    savingsType: SavingsType.FIXED,
    targetAmount: 100000,
    frequency: SavingsFrequency.ONCE,
    maturity: SavingsMaturity.SIX_MONTHS,
    bankName: 'Access Bank',
    accountNumber: '0011223344',
    accountName: 'John Doe Fixed',
  })

  if (!createFixedRes.success || !createFixedRes.data) {
    console.error('❌ Failed to create FIXED savings plan:', createFixedRes.error)
    process.exit(1)
  }

  const fixedPlan = createFixedRes.data
  console.log('✅ FIXED plan created successfully!')
  console.log(`- Type: ${fixedPlan.savingsType}`)
  console.log(`- Target: ₦${fixedPlan.targetAmount}`)
  console.log(`- Interest Rate: ${fixedPlan.interestRate}%`)
  console.log(`- Expected Maturity Amount: ₦${fixedPlan.expectedMaturityAmount}`)
  console.log(`- Status: ${fixedPlan.status}`)

  if (fixedPlan.interestRate !== 12) {
    console.error(`❌ Expected interest rate 12%, got ${fixedPlan.interestRate}%`)
    process.exit(1)
  }
  if (fixedPlan.expectedMaturityAmount !== 112000) {
    console.error(`❌ Expected maturity amount ₦112,000, got ₦${fixedPlan.expectedMaturityAmount}`)
    process.exit(1)
  }

  // 3. Create REGULAR savings plan
  console.log('\n--- Test 2: Creating REGULAR Savings Plan (₦10,000 monthly, 6 Months, 4.5% Interest) ---')
  const createRegularRes = await createSavingsPlanAction(testUser.id, {
    savingsType: SavingsType.REGULAR,
    targetAmount: 10000,
    frequency: SavingsFrequency.MONTHLY,
    maturity: SavingsMaturity.SIX_MONTHS,
    bankName: 'GTBank',
    accountNumber: '1122334455',
    accountName: 'John Doe Regular',
  })

  if (!createRegularRes.success || !createRegularRes.data) {
    console.error('❌ Failed to create REGULAR savings plan:', createRegularRes.error)
    process.exit(1)
  }

  const regularPlan = createRegularRes.data
  console.log('✅ REGULAR plan created successfully!')
  console.log(`- Type: ${regularPlan.savingsType}`)
  console.log(`- Target Amount per period: ₦${regularPlan.targetAmount}`)
  console.log(`- Interest Rate: ${regularPlan.interestRate}%`)
  console.log(`- Expected Maturity Amount: ₦${regularPlan.expectedMaturityAmount}`)
  console.log(`- Status: ${regularPlan.status}`)

  // Total contribution = 10,000 * 6 months = 60,000. Interest = 4.5% of 60,000 = 2,700. Total = 62,700
  if (regularPlan.interestRate !== 4.5) {
    console.error(`❌ Expected interest rate 4.5%, got ${regularPlan.interestRate}%`)
    process.exit(1)
  }
  if (regularPlan.expectedMaturityAmount !== 62700) {
    console.error(`❌ Expected maturity amount ₦62,700, got ₦${regularPlan.expectedMaturityAmount}`)
    process.exit(1)
  }

  // 4. Submit deposit receipt for FIXED savings plan
  console.log('\n--- Test 3: Submitting Deposit Receipt for FIXED plan (₦100,000) ---')
  const depositRes = await submitSavingsDepositAction(testUser.id, {
    savingsId: fixedPlan.id,
    amount: 100000,
    receiptUrl: 'https://cloudinary.com/receipts/fixed-deposit-1.jpg',
    referenceNumber: 'TX-REF-FIXED-01',
    notes: 'Upfront fixed savings deposit',
  })

  if (!depositRes.success || !depositRes.data) {
    console.error('❌ Failed to submit savings deposit:', depositRes.error)
    process.exit(1)
  }

  const transaction = depositRes.data
  console.log('✅ Savings deposit transaction logged successfully!')
  console.log(`- ID: ${transaction.id}`)
  console.log(`- Category: ${transaction.category}`)
  console.log(`- Status: ${transaction.status}`)
  console.log(`- Receipt URL: ${transaction.receiptUrl}`)

  // 5. Admin confirms deposit transaction
  console.log('\n--- Test 4: Confirming Savings Deposit (Simulating Admin Verification) ---')
  const adminUser = await prisma.user.findFirst({
    where: { role: 'OWNER' },
  })
  if (!adminUser) {
    console.error('❌ No admin user found for transaction transition testing.')
    process.exit(1)
  }

  const confirmRes = await transitionTransaction(transaction.id, 'CONFIRM', adminUser.id)
  if (!confirmRes) {
    console.error('❌ Failed to transition transaction.')
    process.exit(1)
  }

  console.log('✅ Transaction confirmed successfully.')

  // Fetch updated savings plan
  const updatedFixedPlan = await prisma.savings.findUnique({
    where: { id: fixedPlan.id },
  })

  if (!updatedFixedPlan) {
    console.error('❌ Updated savings plan not found.')
    process.exit(1)
  }

  console.log('✅ Savings plan updated details loaded:')
  console.log(`- Status: ${updatedFixedPlan.status}`)
  console.log(`- Current Balance: ₦${updatedFixedPlan.currentBalance}`)
  console.log(`- Total Deposited: ₦${updatedFixedPlan.totalDeposited}`)
  console.log(`- Start Date: ${updatedFixedPlan.startDate}`)
  console.log(`- Maturity Date: ${updatedFixedPlan.maturityDate}`)

  if (updatedFixedPlan.status !== SavingsStatus.ACTIVE) {
    console.error(`❌ Expected status ACTIVE, got ${updatedFixedPlan.status}`)
    process.exit(1)
  }
  if (Number(updatedFixedPlan.currentBalance) !== 100000) {
    console.error(`❌ Expected currentBalance 100000, got ${updatedFixedPlan.currentBalance}`)
    process.exit(1)
  }
  if (!updatedFixedPlan.maturityDate) {
    console.error('❌ Expected maturity date to be set, got null')
    process.exit(1)
  }

  // 6. Early Withdrawal request (interest forfeiture verification)
  console.log('\n--- Test 5: Early Withdrawal Request & Forfeiture Validation ---')
  const withdrawRes = await requestSavingsWithdrawalAction(testUser.id, fixedPlan.id, 'Need money early')
  if (!withdrawRes.success || !withdrawRes.data) {
    console.error('❌ Failed to request early withdrawal:', withdrawRes.error)
    process.exit(1)
  }

  const withdrawalDetails = withdrawRes.data
  console.log('✅ Early withdrawal requested successfully!')
  console.log(`- Savings Plan Status: ${withdrawalDetails.savings?.status}`)
  console.log(`- Early Withdrawal Flag: ${withdrawalDetails.savings?.earlyWithdrawal}`)
  console.log(`- Accrued Interest: ₦${withdrawalDetails.savings?.accruedInterest} (Should be 0 - Forfeited)`)
  console.log(`- Withdrawal Transaction Amount: ₦${withdrawalDetails.transaction?.amount} (Should match principal 100,000)`)
  console.log(`- Withdrawal Status: ${withdrawalDetails.transaction?.status}`)

  if (withdrawalDetails.savings?.status !== SavingsStatus.EARLY_WITHDRAWAL) {
    console.error(`❌ Expected savings status EARLY_WITHDRAWAL, got ${withdrawalDetails.savings?.status}`)
    process.exit(1)
  }
  if (withdrawalDetails.savings?.accruedInterest !== 0) {
    console.error(`❌ Expected accruedInterest 0 (forfeited), got ${withdrawalDetails.savings?.accruedInterest}`)
    process.exit(1)
  }
  if (withdrawalDetails.transaction?.amount !== 100000) {
    console.error(`❌ Expected withdrawal amount 100000 (principal only), got ${withdrawalDetails.transaction?.amount}`)
    process.exit(1)
  }

  // 7. Cleanup test records
  console.log('\n--- Cleaning up test records ---')
  await prisma.transaction.deleteMany({
    where: { savingsId: { in: [fixedPlan.id, regularPlan.id] } },
  })
  await prisma.savings.deleteMany({
    where: { id: { in: [fixedPlan.id, regularPlan.id] } },
  })
  console.log('✅ Test records cleaned up successfully.')

  console.log('\n🌟 SAVINGS PACKAGES INTEGRATION TEST PASSED COMPLETELY! 🌟\n')
}

runSavingsIntegrationTest().catch((err) => {
  console.error('❌ Savings Integration Test Failed:', err)
  process.exit(1)
})
