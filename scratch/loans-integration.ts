import { prisma } from '../lib/prisma'
import {
  applyForLoanAction,
  searchMemberByEmailAction,
  submitLoanRepaymentAction,
} from '../models/loans/actions'
import { transitionTransaction } from '../models/transactions/actions'
import { getLoanPlanById } from '../models/loans/query'
import {
  LoanStatus,
  TransactionCategory,
  TransactionType,
  TransactionStatus,
  UserRole,
} from '@/generated/prisma/enums'
import { Prisma } from '../generated/prisma/client'

async function runLoansIntegrationTest() {
  console.log('🤖 Running Loans Integration Test...')

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

  // Fetch admin user to use as a guarantor
  const adminUser = await prisma.user.findFirst({
    where: { role: 'OWNER' },
  })

  if (!adminUser) {
    console.error('❌ No admin user found to nominate as a guarantor.')
    process.exit(1)
  }

  // 2. Test Guarantor Search
  console.log('\n--- Test 1: Searching for Guarantor Member by Email ---')
  const searchRes = await searchMemberByEmailAction(adminUser.email)
  if (!searchRes.success || !searchRes.member) {
    console.error('❌ Failed to find guarantor:', searchRes.error)
    process.exit(1)
  }

  console.log('✅ Guarantor found successfully!')
  console.log(`- Name: ${searchRes.member.name}`)
  console.log(`- Email: ${adminUser.email}`)

  // 3. Create Loan Application (₦50,000 for 2 months)
  console.log('\n--- Test 2: Applying for a Tier 3 Member Loan (₦50,000, 2 Months) ---')
  const applyRes = await applyForLoanAction(testUser.id, {
    requestedAmount: 50000,
    duration: 2,
    purpose: 'Business stock purchase',
    guarantorEmail: adminUser.email,
  })

  if (!applyRes.success || !applyRes.data) {
    console.error('❌ Loan application failed:', applyRes.error)
    process.exit(1)
  }

  const loan = applyRes.data
  console.log('✅ Loan application created successfully!')
  console.log(`- ID: ${loan.id}`)
  console.log(`- Status: ${loan.status}`)
  console.log(`- Requested Amount: ₦${loan.requestedAmount}`)
  console.log(`- Interest Rate: ${loan.interestRate}%/month`)
  console.log(`- Application Fee: ₦${loan.applicationFee}`)

  // 4. Simulate Admin Approval and Disbursement
  console.log('\n--- Test 3: Simulating Admin Loan Disbursement ---')
  
  // Set mock session user to Admin/Owner to execute disbursement
  process.env.MOCK_SESSION_USER = JSON.stringify({
    user: {
      id: adminUser.id,
      role: 'OWNER',
      email: adminUser.email,
    }
  })

  // Create PENDING LOAN_DISBURSEMENT transaction
  const disburseTx = await prisma.transaction.create({
    data: {
      userId: testUser.id,
      amount: new Prisma.Decimal('50000'),
      category: TransactionCategory.LOAN_DISBURSEMENT,
      type: TransactionType.WITHDRAWAL, // Disbursement is money paid OUT of cooperative
      status: TransactionStatus.PENDING,
      loanId: loan.id,
      recordedBy: adminUser.id,
    },
  })

  // Confirm disbursement
  const disburseConfirm = await transitionTransaction(disburseTx.id, 'DISBURSE', adminUser.id)
  if (!disburseConfirm) {
    console.error('❌ Failed to transition disbursement transaction.')
    process.exit(1)
  }

  console.log('✅ Loan disbursement processed!')

  // Verify loan is ACTIVE and has outstanding balance
  const activeLoanRes = await getLoanPlanById(loan.id)
  if (!activeLoanRes.success || !activeLoanRes.data) {
    console.error('❌ Failed to load updated loan plan details.')
    process.exit(1)
  }

  const activeLoan = activeLoanRes.data
  console.log(`- Loan Status: ${activeLoan.status}`)
  console.log(`- Outstanding Balance: ₦${activeLoan.outstandingBalance}`)
  console.log(`- Disbursed At: ${activeLoan.disbursedAt}`)

  if (activeLoan.status !== LoanStatus.ACTIVE) {
    console.error(`❌ Expected status ACTIVE, got ${activeLoan.status}`)
    process.exit(1)
  }
  if (activeLoan.outstandingBalance !== 50000) {
    console.error(`❌ Expected outstandingBalance 50000, got ${activeLoan.outstandingBalance}`)
    process.exit(1)
  }

  // 5. Submit Repayment (₦27,500 - 1 Installment: ₦25,000 principal + ₦2,500 interest)
  console.log('\n--- Test 4: Submitting Loan Repayment installment (₦27,500) ---')
  
  // Restore mock session user to Member
  process.env.MOCK_SESSION_USER = JSON.stringify({
    user: {
      id: testUser.id,
      role: UserRole.USER,
      email: testUser.email,
    }
  })

  const repayRes = await submitLoanRepaymentAction(testUser.id, {
    loanId: loan.id,
    amount: 27500,
    receiptUrl: 'https://cloudinary.com/receipts/loan-repayment-1.jpg',
    referenceNumber: 'TX-REF-REPAY-01',
    notes: 'Month 1 installment repayment',
  })

  if (!repayRes.success || !repayRes.data) {
    console.error('❌ Failed to submit loan repayment:', repayRes.error)
    process.exit(1)
  }

  const repayTx = repayRes.data
  console.log('✅ Repayment transaction logged!')
  console.log(`- ID: ${repayTx.id}`)
  console.log(`- Status: ${repayTx.status}`)

  // Confirm repayment
  // Set mock session user to Admin/Owner to confirm payment
  process.env.MOCK_SESSION_USER = JSON.stringify({
    user: {
      id: adminUser.id,
      role: 'OWNER',
      email: adminUser.email,
    }
  })

  const repayConfirm = await transitionTransaction(repayTx.id, 'CONFIRM', adminUser.id)
  if (!repayConfirm) {
    console.error('❌ Failed to transition repayment transaction.')
    process.exit(1)
  }

  console.log('✅ Repayment confirmed!')

  // Verify outstanding balance reduction and installment schedule calculations
  const finalLoanRes = await getLoanPlanById(loan.id)
  if (!finalLoanRes.success || !finalLoanRes.data) {
    console.error('❌ Failed to load final loan plan details.')
    process.exit(1)
  }

  const finalLoan = finalLoanRes.data
  console.log(`- Outstanding Balance: ₦${finalLoan.outstandingBalance} (Should be 22,500)`)
  console.log(`- Total Repaid: ₦${finalLoan.totalRepaid} (Should be 27,500)`)
  console.log('- Amortization Schedule Installment Statuses:')
  finalLoan.schedule.forEach((inst: any) => {
    console.log(`  - Installment ${inst.installmentNumber}: ₦${inst.totalAmount} is ${inst.status}`)
  })

  if (finalLoan.outstandingBalance !== 22500) {
    console.error(`❌ Expected outstandingBalance 22500, got ${finalLoan.outstandingBalance}`)
    process.exit(1)
  }
  if (finalLoan.schedule[0].status !== 'PAID') {
    console.error(`❌ Expected installment 1 to be PAID, got ${finalLoan.schedule[0].status}`)
    process.exit(1)
  }
  if (finalLoan.schedule[1].status !== 'PENDING') {
    console.error(`❌ Expected installment 2 to be PENDING, got ${finalLoan.schedule[1].status}`)
    process.exit(1)
  }

  // 6. Cleanup test records
  console.log('\n--- Cleaning up test records ---')
  await prisma.transaction.deleteMany({
    where: { loanId: loan.id },
  })
  await prisma.loan.delete({
    where: { id: loan.id },
  })
  console.log('✅ Test records cleaned up successfully.')

  console.log('\n🌟 LOANS INTEGRATION TEST PASSED COMPLETELY! 🌟\n')
}

runLoansIntegrationTest().catch((err) => {
  console.error('❌ Loans Integration Test Failed:', err)
  process.exit(1)
})
