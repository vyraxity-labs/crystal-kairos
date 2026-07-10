'use server'

import { prisma } from '@/lib/prisma'
import { serializeSavings } from '@/lib/savings'

/**
 * Fetches a single savings plan by ID along with its transactions
 */
export const getSavingsPlanById = async (savingsId: string) => {
  try {
    const savings = await prisma.savings.findUnique({
      where: { id: savingsId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!savings) {
      return { success: false, error: 'Savings plan not found' }
    }

    const serializedSavings = serializeSavings(savings)
    const serializedTransactions = (savings.transactions || []).map((t) => ({
      ...t,
      amount: Number(t.amount),
    }))

    return {
      success: true,
      data: {
        ...serializedSavings,
        transactions: serializedTransactions,
      },
    }
  } catch (error) {
    console.error('Error fetching savings plan:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch savings plan',
    }
  }
}
