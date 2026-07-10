'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import {
  EAjoDuration,
  EAjoFrequency,
  EAjoStatus,
  TransactionCategory,
  TransactionType,
  TransactionStatus,
} from '@/generated/prisma/enums'
import { getSessionHelper } from '../members/actions'
import { revalidatePath } from 'next/cache'
import { uploadReceipt } from '@/lib/upload'

const durationMonthsMap: Record<EAjoDuration, number> = {
  [EAjoDuration.FOUR_MONTHS]: 4,
  [EAjoDuration.SIX_MONTHS]: 6,
  [EAjoDuration.TWELVE_MONTHS]: 12,
}

const serializeAjo = (ajo: any) => {
  return {
    ...ajo,
    contributionAmount: Number(ajo.contributionAmount),
    feePercentage: Number(ajo.feePercentage),
    feeAmount: Number(ajo.feeAmount),
    totalExpectedPayout: Number(ajo.totalExpectedPayout),
    netPayoutAmount: Number(ajo.netPayoutAmount),
    currentBalance: Number(ajo.currentBalance),
    totalContributed: Number(ajo.totalContributed),
  }
}

const serializeTransaction = (tx: any) => {
  return {
    ...tx,
    amount: Number(tx.amount),
  }
}

export const joinEAjoAction = async (
  userId: string,
  formData: {
    contributionAmount: number
    totalParticipants: number
    duration: EAjoDuration
    frequency: EAjoFrequency
    payoutPosition: number
    guarantorName: string
    guarantorPhoneNumber: string
    bankName: string
    accountNumber: string
    accountName: string
  },
) => {
  try {
    const session = await getSessionHelper()
    const currentUser = session?.user

    if (!currentUser) {
      return { success: false, error: 'Unauthorized' }
    }

    const isSelf = currentUser.id === userId
    const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'OWNER'

    if (!isSelf && !isAdmin) {
      return { success: false, error: 'Forbidden: Access Denied' }
    }

    // Map duration enum to months
    const months = durationMonthsMap[formData.duration]

    // Fetch fee configuration from DB
    const feeConfig = await prisma.ajoFeeConfig.findUnique({
      where: {
        durationMonths_pickPosition: {
          durationMonths: months,
          pickPosition: formData.payoutPosition,
        },
      },
    })

    const feePercentage = feeConfig ? Number(feeConfig.feePercentage) : 0
    const totalExpectedPayout =
      formData.contributionAmount * formData.totalParticipants
    const feeAmount = (totalExpectedPayout * feePercentage) / 100
    const netPayoutAmount = totalExpectedPayout - feeAmount

    const newAjo = await prisma.eAjo.create({
      data: {
        userId,
        contributionAmount: formData.contributionAmount,
        totalParticipants: formData.totalParticipants,
        duration: formData.duration,
        frequency: formData.frequency,
        payoutPosition: formData.payoutPosition,
        feePercentage,
        feeAmount,
        totalExpectedPayout,
        netPayoutAmount,
        guarantorName: formData.guarantorName,
        guarantorPhoneNumber: formData.guarantorPhoneNumber,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        status: EAjoStatus.PENDING,
      },
    })

    try {
      revalidatePath(`/dashboard/${userId}/eajo`)
    } catch (e) {
      // Ignored when running outside Next.js request context
    }

    return { success: true, data: serializeAjo(newAjo) }
  } catch (error) {
    console.error('Error joining Ajo group:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to join Ajo group',
    }
  }
}

export const submitEAjoContributionAction = async (
  userId: string,
  eAjoId: string,
  amount: number,
  receiptUrl: string,
  referenceNumber?: string,
  notes?: string,
) => {
  try {
    const session = await getSessionHelper()
    const currentUser = session?.user

    if (!currentUser) {
      return { success: false, error: 'Unauthorized' }
    }

    const isSelf = currentUser.id === userId
    const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'OWNER'

    if (!isSelf && !isAdmin) {
      return { success: false, error: 'Forbidden: Access Denied' }
    }

    // Verify the eAjo record exists and belongs to the user
    const ajo = await prisma.eAjo.findFirst({
      where: { id: eAjoId, userId },
    })

    if (!ajo) {
      return { success: false, error: 'Ajo plan subscription not found' }
    }

    // Create a pending contribution deposit transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        userId,
        amount,
        category: TransactionCategory.AJO_CONTRIBUTION,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PENDING,
        eAjoId,
        receiptUrl,
        referenceNumber,
        notes,
        recordedBy: userId,
      },
    })

    try {
      revalidatePath(`/dashboard/${userId}/eajo`)
      revalidatePath(`/dashboard/${userId}`)
    } catch (e) {
      // Ignored when running outside Next.js request context
    }

    return { success: true, data: serializeTransaction(newTransaction) }
  } catch (error) {
    console.error('Error submitting contribution receipt:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to submit contribution receipt',
    }
  }
}

export const uploadReceiptAction = async (formData: FormData) => {
  try {
    const file = formData.get('file') as File | null

    if (!file) {
      return { success: false, error: 'No file uploaded' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadResult = await uploadReceipt(buffer, file.name)
    return { success: true, url: uploadResult.url }
  } catch (error) {
    console.error('File upload action error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to upload receipt file',
    }
  }
}
