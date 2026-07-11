'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import {
  EAjoStatus,
  EAjoMemberStatus,
  TransactionCategory,
  TransactionType,
  TransactionStatus,
} from '@/generated/prisma/enums'
import { getSessionHelper } from '../members/actions'
import { revalidatePath } from 'next/cache'
import { uploadReceipt } from '@/lib/upload'

const serializeMember = (m: any) => ({
  ...m,
  feePercentage: Number(m.feePercentage),
  feeAmount: Number(m.feeAmount),
  totalExpectedPayout: Number(m.totalExpectedPayout),
  netPayoutAmount: Number(m.netPayoutAmount),
  currentBalance: Number(m.currentBalance),
  totalContributed: Number(m.totalContributed),
})

const serializeTransaction = (tx: any) => ({
  ...tx,
  amount: Number(tx.amount),
})

/**
 * User applies to join an eAjo group slot
 */
export const applyToEAjoGroupAction = async (
  userId: string,
  groupId: string,
  formData: {
    payoutPosition: number
    guarantorName: string
    guarantorPhoneNumber: string
    bankName: string
    accountNumber: string
    accountName: string
  }
) => {
  try {
    const session = await getSessionHelper()
    const currentUser = session?.user
    if (!currentUser) return { success: false, error: 'Unauthorized' }

    const isSelf = currentUser.id === userId
    const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'OWNER'
    if (!isSelf && !isAdmin) return { success: false, error: 'Forbidden: Access Denied' }

    // Verify the group exists and is PENDING (accepting applications)
    const group = await prisma.eAjoGroup.findUnique({ where: { id: groupId } })
    if (!group) return { success: false, error: 'Ajo group not found.' }
    if (group.status !== EAjoStatus.PENDING && group.status !== EAjoStatus.ACTIVE) {
      return { success: false, error: 'This group is no longer accepting applications.' }
    }

    // Verify slot is still available
    const slotTaken = await prisma.eAjoMember.findUnique({
      where: { groupId_payoutPosition: { groupId, payoutPosition: formData.payoutPosition } },
    })
    if (slotTaken) {
      return { success: false, error: 'This slot has already been taken. Please choose another.' }
    }

    // Verify user hasn't already applied to this group
    const existingApplication = await prisma.eAjoMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    })
    if (existingApplication) {
      return { success: false, error: 'You have already applied to this group.' }
    }

    // Fetch fee config for position
    const durationMonthsMap: Record<string, number> = {
      FOUR_MONTHS: 4,
      SIX_MONTHS: 6,
      TWELVE_MONTHS: 12,
    }
    const months = durationMonthsMap[group.duration]
    const feeConfig = await prisma.ajoFeeConfig.findUnique({
      where: {
        durationMonths_pickPosition: {
          durationMonths: months,
          pickPosition: formData.payoutPosition,
        },
      },
    })

    const feePercentage = feeConfig ? Number(feeConfig.feePercentage) : 0
    const totalExpectedPayout = Number(group.contributionAmount) * group.totalSlots
    const feeAmount = (totalExpectedPayout * feePercentage) / 100
    const netPayoutAmount = totalExpectedPayout - feeAmount

    const newMember = await prisma.eAjoMember.create({
      data: {
        groupId,
        userId,
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
        status: EAjoMemberStatus.PENDING,
      },
    })

    try {
      revalidatePath(`/dashboard/${userId}/eajo`)
    } catch {}

    return { success: true, data: serializeMember(newMember) }
  } catch (error) {
    console.error('Error applying to eAjo group:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to apply to group.',
    }
  }
}

/**
 * User submits a contribution receipt for their eAjo membership
 */
export const submitEAjoContributionAction = async (
  userId: string,
  eAjoMemberId: string,
  amount: number,
  receiptUrl: string,
  referenceNumber?: string,
  notes?: string
) => {
  try {
    const session = await getSessionHelper()
    const currentUser = session?.user
    if (!currentUser) return { success: false, error: 'Unauthorized' }

    const isSelf = currentUser.id === userId
    const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'OWNER'
    if (!isSelf && !isAdmin) return { success: false, error: 'Forbidden: Access Denied' }

    // Verify membership record
    const membership = await prisma.eAjoMember.findFirst({
      where: { id: eAjoMemberId, userId },
    })
    if (!membership) return { success: false, error: 'Ajo membership record not found.' }
    if (membership.status !== EAjoMemberStatus.ACTIVE && membership.status !== EAjoMemberStatus.APPROVED) {
      return { success: false, error: 'Your membership is not yet active.' }
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        userId,
        amount,
        category: TransactionCategory.AJO_CONTRIBUTION,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PENDING,
        eAjoMemberId,
        receiptUrl,
        referenceNumber,
        notes,
        recordedBy: userId,
      },
    })

    try {
      revalidatePath(`/dashboard/${userId}/eajo`)
      revalidatePath(`/dashboard/${userId}`)
    } catch {}

    return { success: true, data: serializeTransaction(newTransaction) }
  } catch (error) {
    console.error('Error submitting contribution receipt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit contribution receipt.',
    }
  }
}

/**
 * Uploads a receipt file to cloud storage and returns the URL
 */
export const uploadReceiptAction = async (formData: FormData) => {
  try {
    const file = formData.get('file') as File | null
    if (!file) return { success: false, error: 'No file uploaded' }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadResult = await uploadReceipt(buffer, file.name)
    return { success: true, url: uploadResult.url }
  } catch (error) {
    console.error('File upload action error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload receipt file.',
    }
  }
}
