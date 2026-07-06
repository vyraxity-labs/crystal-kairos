'use server'

import { prisma } from '@/lib/prisma'
import {
  TransactionStatus,
  TransactionCategory,
  TransactionType,
  SavingsStatus,
  LoanStatus,
} from '@/generated/prisma/enums'
import { Prisma } from '@/generated/prisma/client'
import { revalidatePath } from 'next/cache'

interface CreateTransactionInput {
  userId: string
  amount: number | Prisma.Decimal
  category: TransactionCategory
  type: TransactionType
  eAjoId?: string
  savingsId?: string
  loanId?: string
  receiptUrl?: string
  notes?: string
  bankAccountId?: string
  recordedBy: string
}

/**
 * Creates a pending or directly confirmed transaction in the database.
 */
export const createTransaction = async (input: CreateTransactionInput) => {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId: input.userId,
        amount: new Prisma.Decimal(input.amount.toString()),
        category: input.category,
        type: input.type,
        status: TransactionStatus.PENDING,
        eAjoId: input.eAjoId || null,
        savingsId: input.savingsId || null,
        loanId: input.loanId || null,
        receiptUrl: input.receiptUrl || null,
        notes: input.notes || null,
        bankAccountId: input.bankAccountId || null,
        recordedBy: input.recordedBy,
      },
    })

    try {
      revalidatePath('/admin/transactions')
      revalidatePath(`/dashboard/${input.userId}`)
    } catch {}

    return { success: true, data: transaction }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create transaction',
    }
  }
}

/**
 * Transition a transaction to a new state (CONFIRMED, REJECTED, DISBURSED, FAILED)
 * and apply the business ledger calculations dynamically in a transaction lock.
 */
export const transitionTransaction = async (
  transactionId: string,
  action: 'CONFIRM' | 'REJECT' | 'DISBURSE' | 'FAIL',
  adminId: string,
  rejectionReason?: string,
  referenceNumber?: string
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch current transaction details
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId },
        include: {
          eAjo: true,
          savings: true,
          loan: true,
        },
      })

      if (!transaction) {
        throw new Error('Transaction not found')
      }

      if (transaction.status !== TransactionStatus.PENDING) {
        throw new Error(`Transaction is already processed. Status: ${transaction.status}`)
      }

      let newStatus: TransactionStatus = TransactionStatus.PENDING

      if (action === 'CONFIRM') {
        newStatus = TransactionStatus.CONFIRMED
      } else if (action === 'REJECT') {
        newStatus = TransactionStatus.REJECTED
      } else if (action === 'DISBURSE') {
        newStatus = TransactionStatus.DISBURSED
      } else if (action === 'FAIL') {
        newStatus = TransactionStatus.FAILED
      }

      // 2. Apply Ledger Invariants based on Category & Action
      if (newStatus === TransactionStatus.CONFIRMED) {
        // A. Ajo contributions
        if (transaction.category === TransactionCategory.AJO_CONTRIBUTION && transaction.eAjoId) {
          await tx.eAjo.update({
            where: { id: transaction.eAjoId },
            data: {
              currentBalance: { increment: transaction.amount },
              totalContributed: { increment: transaction.amount },
            },
          })
        }

        // B. Savings deposits
        if (transaction.category === TransactionCategory.SAVINGS_DEPOSIT && transaction.savingsId) {
          // If the savings was pending, activate it on first deposit
          const updateData: Prisma.SavingsUpdateInput = {
            currentBalance: { increment: transaction.amount },
            totalDeposited: { increment: transaction.amount },
          }
          if (transaction.savings?.status === SavingsStatus.PENDING) {
            updateData.status = SavingsStatus.ACTIVE
            updateData.startDate = new Date()
            
            // If it is FIXED savings, calculate maturity date from startDate
            if (transaction.savings.savingsType === 'FIXED') {
              const maturityMonths = transaction.savings.maturity === 'SIX_MONTHS' ? 6 : 12
              const maturityDate = new Date()
              maturityDate.setMonth(maturityDate.getMonth() + maturityMonths)
              updateData.maturityDate = maturityDate
            }
          }
          await tx.savings.update({
            where: { id: transaction.savingsId },
            data: updateData,
          })
        }

        // C. Loan Repayments
        if (transaction.category === TransactionCategory.LOAN_REPAYMENT && transaction.loanId) {
          const currentOutstanding = new Prisma.Decimal(transaction.loan?.outstandingBalance?.toString() || '0')
          const repaymentAmount = transaction.amount
          const newOutstanding = Prisma.Decimal.max(0, currentOutstanding.minus(repaymentAmount))

          await tx.loan.update({
            where: { id: transaction.loanId },
            data: {
              outstandingBalance: newOutstanding,
              totalRepaid: { increment: repaymentAmount },
              status: newOutstanding.equals(0) ? LoanStatus.COMPLETED : undefined,
            },
          })
        }
      }

      if (newStatus === TransactionStatus.DISBURSED) {
        // A. Ajo Payouts (Money disbursed to member)
        if (transaction.category === TransactionCategory.AJO_PAYOUT && transaction.eAjoId) {
          await tx.eAjo.update({
            where: { id: transaction.eAjoId },
            data: {
              currentBalance: { decrement: transaction.amount },
              hasReceivedPayout: true,
            },
          })
        }

        // B. Savings Withdrawals (Money paid back to saver)
        if (transaction.category === TransactionCategory.SAVINGS_WITHDRAWAL && transaction.savingsId) {
          await tx.savings.update({
            where: { id: transaction.savingsId },
            data: {
              currentBalance: 0,
              status: SavingsStatus.WITHDRAWN,
            },
          })
        }

        // C. Loan Disbursements (Approved borrow amount paid to applicant)
        if (transaction.category === TransactionCategory.LOAN_DISBURSEMENT && transaction.loanId) {
          await tx.loan.update({
            where: { id: transaction.loanId },
            data: {
              status: LoanStatus.ACTIVE,
              disbursedAt: new Date(),
              outstandingBalance: transaction.amount, // Initial debt matches approved amount
            },
          })
        }
      }

      // 3. Save processed changes to transaction
      const updatedTx = await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: newStatus,
          processedBy: adminId,
          processedAt: new Date(),
          rejectionReason: rejectionReason || null,
          referenceNumber: referenceNumber || null,
        },
      })

      return updatedTx
    })

    try {
      revalidatePath('/admin/transactions')
      revalidatePath(`/dashboard/${result.userId}`)
    } catch {}

    return { success: true, data: result }
  } catch (error) {
    console.error('Error transitioning transaction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transition failed',
    }
  }
}

/**
 * Returns user ledger balance summaries (unified wallet + products details)
 */
export const getUserLedgerBalances = async (userId: string) => {
  try {
    // 1. Fetch confirmed/disbursed transactions
    const txs = await prisma.transaction.findMany({
      where: {
        userId,
        status: { in: [TransactionStatus.CONFIRMED, TransactionStatus.DISBURSED] },
      },
    })

    let ledgerBalance = new Prisma.Decimal(0)
    let totalAjoContributed = new Prisma.Decimal(0)
    let totalSavingsDeposited = new Prisma.Decimal(0)
    let totalSavingsWithdrawn = new Prisma.Decimal(0)
    let totalLoansDisbursed = new Prisma.Decimal(0)
    let totalLoansRepaid = new Prisma.Decimal(0)

    for (const tx of txs) {
      const isDeposit = tx.type === TransactionType.DEPOSIT

      // Base ledger balance includes general WALLET transactions
      if (tx.category === TransactionCategory.WALLET_TOPUP) {
        ledgerBalance = ledgerBalance.plus(tx.amount)
      } else if (tx.category === TransactionCategory.WALLET_WITHDRAWAL) {
        ledgerBalance = ledgerBalance.minus(tx.amount)
      }

      // Sub-ledgers breakdown
      if (tx.category === TransactionCategory.AJO_CONTRIBUTION) {
        totalAjoContributed = totalAjoContributed.plus(tx.amount)
      } else if (tx.category === TransactionCategory.SAVINGS_DEPOSIT) {
        totalSavingsDeposited = totalSavingsDeposited.plus(tx.amount)
      } else if (tx.category === TransactionCategory.SAVINGS_WITHDRAWAL) {
        totalSavingsWithdrawn = totalSavingsWithdrawn.plus(tx.amount)
      } else if (tx.category === TransactionCategory.LOAN_DISBURSEMENT) {
        totalLoansDisbursed = totalLoansDisbursed.plus(tx.amount)
      } else if (tx.category === TransactionCategory.LOAN_REPAYMENT) {
        totalLoansRepaid = totalLoansRepaid.plus(tx.amount)
      }
    }

    return {
      success: true,
      data: {
        generalWalletBalance: ledgerBalance.toNumber(),
        subLedgers: {
          ajo: {
            totalContributed: totalAjoContributed.toNumber(),
          },
          savings: {
            totalDeposited: totalSavingsDeposited.toNumber(),
            totalWithdrawn: totalSavingsWithdrawn.toNumber(),
            currentSavingsBalance: totalSavingsDeposited.minus(totalSavingsWithdrawn).toNumber(),
          },
          loans: {
            totalBorrowed: totalLoansDisbursed.toNumber(),
            totalRepaid: totalLoansRepaid.toNumber(),
            outstandingDebt: totalLoansDisbursed.minus(totalLoansRepaid).toNumber(),
          },
        },
      },
    }
  } catch (error) {
    console.error('Error fetching user ledger balances:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve ledger balances',
    }
  }
}

export const getUserTransactions = async (userId: string) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: transactions }
  } catch (error) {
    console.error('Error fetching user transactions:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve transactions',
    }
  }
}

