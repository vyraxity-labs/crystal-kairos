'use server'

import { prisma } from '@/lib/prisma'
import { getSessionHelper } from '../members/actions'
import { revalidatePath } from 'next/cache'
import { LoanStatus, TransactionCategory, TransactionStatus, TransactionType } from '@/generated/prisma/enums'

/**
 * Admin approves a loan and sets the final approved amount.
 */
export const approveLoanAction = async (loanId: string, approvedAmount: number) => {
  try {
    const session = await getSessionHelper()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return { success: false, error: 'Unauthorized admin access.' }
    }

    const loan = await prisma.loan.findUnique({ where: { id: loanId } })
    if (!loan) return { success: false, error: 'Loan not found.' }
    if (loan.status !== LoanStatus.PENDING) return { success: false, error: 'Only pending loans can be approved.' }

    const updated = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: LoanStatus.APPROVED,
        approvedAmount,
        approvedBy: session.user.id,
        approvedAt: new Date(),
      },
    })

    try {
      revalidatePath('/admin/loans')
      revalidatePath(`/admin/loans/${loanId}`)
    } catch {}

    return { success: true, data: updated }
  } catch (error) {
    console.error('Error approving loan:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to approve loan.' }
  }
}

/**
 * Admin rejects a loan with a mandatory reason.
 */
export const rejectLoanAction = async (loanId: string, rejectionReason: string) => {
  try {
    const session = await getSessionHelper()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return { success: false, error: 'Unauthorized admin access.' }
    }

    const loan = await prisma.loan.findUnique({ where: { id: loanId } })
    if (!loan) return { success: false, error: 'Loan not found.' }
    if (loan.status !== LoanStatus.PENDING) return { success: false, error: 'Only pending loans can be rejected.' }

    const updated = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: LoanStatus.REJECTED,
        rejectionReason,
        approvedBy: session.user.id,
        approvedAt: new Date(),
      },
    })

    try {
      revalidatePath('/admin/loans')
      revalidatePath(`/admin/loans/${loanId}`)
    } catch {}

    return { success: true, data: updated }
  } catch (error) {
    console.error('Error rejecting loan:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reject loan.' }
  }
}

/**
 * Admin disburses a loan and uploads the receipt.
 */
export const disburseLoanAction = async (loanId: string, receiptUrl: string) => {
  try {
    const session = await getSessionHelper()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return { success: false, error: 'Unauthorized admin access.' }
    }

    const loan = await prisma.loan.findUnique({ where: { id: loanId } })
    if (!loan) return { success: false, error: 'Loan not found.' }
    if (loan.status !== LoanStatus.APPROVED) return { success: false, error: 'Only approved loans can be disbursed.' }
    if (!loan.approvedAmount) return { success: false, error: 'Approved amount is missing.' }

    const now = new Date()
    const repaymentEndDate = new Date(now)
    repaymentEndDate.setMonth(repaymentEndDate.getMonth() + loan.duration)

    const approvedAmountNum = Number(loan.approvedAmount || 0)
    const interestRateNum = Number(loan.interestRate || 0)
    const totalInterest = (approvedAmountNum * interestRateNum * loan.duration) / 100
    const initialDebt = approvedAmountNum + totalInterest

    // Run in a transaction: Create disbursement record + update loan
    const result = await prisma.$transaction(async (tx) => {
      // Create the disbursement transaction
      const transaction = await tx.transaction.create({
        data: {
          userId: loan.userId,
          amount: loan.approvedAmount!,
          type: TransactionType.WITHDRAWAL, // Money leaving the system
          category: TransactionCategory.LOAN_DISBURSEMENT,
          status: TransactionStatus.DISBURSED,
          receiptUrl,
          loanId: loan.id,
          notes: `Disbursement for Loan ${loan.id.substring(0, 8)}`,
          recordedBy: session.user.id,
          processedBy: session.user.id,
          processedAt: now,
        },
      })

      // Update the loan status to ACTIVE
      const updatedLoan = await tx.loan.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.ACTIVE,
          disbursedAt: now,
          repaymentStartDate: now,
          repaymentEndDate,
          outstandingBalance: initialDebt, // initial debt matches approved amount + interest
        },
      })

      return updatedLoan
    })

    try {
      revalidatePath('/admin/loans')
      revalidatePath(`/admin/loans/${loanId}`)
      revalidatePath(`/dashboard/${loan.userId}/loans`)
      revalidatePath(`/dashboard/${loan.userId}/loans/${loanId}`)
    } catch {}

    return { success: true, data: result }
  } catch (error) {
    console.error('Error disbursing loan:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to disburse loan.' }
  }
}
