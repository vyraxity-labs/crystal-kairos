'use server'

import { MembershipStatus, UserRole } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'

export const getAllMembers = async () => {
  try {
    const members = await prisma.user.findMany({
      where: {
        role: UserRole.USER,
      },
    })

    return { success: true, data: members }
  } catch (error) {
    return { success: false, data: [], error: error as Error }
  }
}

export const getMembersCount = async () => {
  try {
    const membersCount = await prisma.user.count({
      where: {
        role: UserRole.USER,
      },
    })
    return { success: true, data: membersCount }
  } catch (error) {
    return { success: false, data: 0, error: error as Error }
  }
}

export const getMembersLastMonth = async () => {
  try {
    const members = await prisma.user.findMany({
      where: {
        role: UserRole.USER,
        createdAt: {
          lte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    })
    return { success: true, data: members }
  } catch (error) {
    return { success: false, data: [], error: error as Error }
  }
}

export const getLastMonthMembersCount = async () => {
  try {
    const membersCount = await prisma.user.count({
      where: {
        role: UserRole.USER,
        createdAt: {
          lte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    })
    return { success: true, data: membersCount }
  } catch (error) {
    return { success: false, data: 0, error: error as Error }
  }
}

export const getPendingApprovals = async () => {
  try {
    const pendingApprovals = await prisma.membership.findMany({
      where: {
        status: MembershipStatus.PENDING,
      },
    })
    return { success: true, data: pendingApprovals }
  } catch (error) {
    return { success: false, data: [], error: error as Error }
  }
}

export const getPendingApprovalsCount = async () => {
  try {
    const pendingApprovalsCount = await prisma.membership.count({
      where: {
        status: MembershipStatus.PENDING,
      },
    })
    return { success: true, data: pendingApprovalsCount }
  } catch (error) {
    return { success: false, data: 0, error: error as Error }
  }
}
