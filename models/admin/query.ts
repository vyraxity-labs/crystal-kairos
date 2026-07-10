'use server'

import { prisma } from '@/lib/prisma'
import { getSessionHelper } from '../members/actions'
import {
  MembershipStatus,
  SavingsStatus,
  LoanStatus,
  EAjoStatus,
  TransactionStatus,
  TransactionType,
  TransactionCategory,
} from '@/generated/prisma/enums'

/**
 * Fetches comprehensive aggregate statistics and activity feeds for the Admin Dashboard
 */
export const getAdminDashboardStats = async () => {
  try {
    const session = await getSessionHelper()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return { success: false, error: 'Unauthorized admin access.' }
    }

    // 1. Pending Receipts (awaiting review - deposits that are PENDING)
    const pendingReceiptsCount = await prisma.transaction.count({
      where: {
        status: TransactionStatus.PENDING,
        type: TransactionType.DEPOSIT,
      },
    })

    // 2. Disbursements Due (money-out transactions that are PENDING)
    const disbursementsDueCount = await prisma.transaction.count({
      where: {
        status: TransactionStatus.PENDING,
        type: TransactionType.WITHDRAWAL,
      },
    })

    // 3. Active Members (approved KYC users)
    const activeMembersCount = await prisma.user.count({
      where: {
        role: 'USER',
        membership: {
          status: MembershipStatus.APPROVED,
        },
      },
    })

    // 4. Active Ajo Groups
    const activeGroupsCount = await prisma.eAjo.count({
      where: {
        status: EAjoStatus.ACTIVE,
      },
    })

    // 5. Pending KYC Documents (Memberships awaiting approval)
    const pendingKycCount = await prisma.membership.count({
      where: {
        status: MembershipStatus.PENDING,
      },
    })

    // 6. Recent Admin Actions (last 5 processed or verified transactions)
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        status: {
          in: [TransactionStatus.CONFIRMED, TransactionStatus.DISBURSED, TransactionStatus.REJECTED],
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
      include: {
        user: {
          select: { name: true },
        },
        processor: {
          select: { name: true },
        },
      },
    })

    // Map recent actions to a clean UI format
    const recentActions = recentTransactions.map((tx) => {
      let actionLabel = ''
      if (tx.status === TransactionStatus.CONFIRMED) {
        actionLabel = 'Approved Receipt'
      } else if (tx.status === TransactionStatus.DISBURSED) {
        actionLabel = 'Processed Payout'
      } else if (tx.status === TransactionStatus.REJECTED) {
        actionLabel = 'Rejected Receipt'
      }

      let targetLabel = 'Transaction'
      if (tx.category === TransactionCategory.SAVINGS_DEPOSIT || tx.category === TransactionCategory.SAVINGS_WITHDRAWAL) {
        targetLabel = `Savings: ${tx.savingsId ? tx.savingsId.substring(0, 8).toUpperCase() : 'Plan'}`
      } else if (tx.category === TransactionCategory.LOAN_DISBURSEMENT || tx.category === TransactionCategory.LOAN_REPAYMENT) {
        targetLabel = `Loan: ${tx.loanId ? tx.loanId.substring(0, 8).toUpperCase() : 'Record'}`
      } else if (tx.category === TransactionCategory.AJO_CONTRIBUTION || tx.category === TransactionCategory.AJO_PAYOUT) {
        targetLabel = `Ajo: ${tx.eAjoId ? tx.eAjoId.substring(0, 8).toUpperCase() : 'Group'}`
      }

      return {
        id: tx.id,
        timestamp: tx.processedAt || tx.updatedAt,
        adminName: tx.processor?.name || 'System Auto',
        action: actionLabel,
        target: targetLabel,
        status: tx.status,
      }
    })

    return {
      success: true,
      data: {
        pendingReceiptsCount,
        disbursementsDueCount,
        activeMembersCount,
        activeGroupsCount,
        pendingKycCount,
        recentActions,
      },
    }
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch admin stats.',
    }
  }
}

/**
 * Fetches all administrators and owners for the staff directory list
 */
export const getAdminStaffMembers = async () => {
  try {
    const session = await getSessionHelper()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return { success: false, error: 'Unauthorized admin access.' }
    }

    const staff = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'OWNER'],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return { success: true, data: staff }
  } catch (error) {
    console.error('Error fetching admin staff:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch admin staff.',
    }
  }
}
