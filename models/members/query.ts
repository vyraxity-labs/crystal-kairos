'use server'

import { Prisma } from '@/generated/prisma/client'
import { MembershipStatus, UserRole } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { AllMembersQueryParams } from '@/types/members.interface'

export const getAllMembers = async (filters: AllMembersQueryParams) => {
  try {
    const {
      page = 1,
      pageSize = 5,
      sortField = 'createdAt',
      sortDirection = 'asc',
      status,
      search,
      createdFrom,
      createdTo,
      gender,
    } = filters

    const where: Prisma.UserWhereInput = {
      role: UserRole.USER,
      ...(status ? { membership: { status } } : {}),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [members, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        include: {
          userInfo: true,
          bankAccounts: true,
          nextOfKin: true,
          membership: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [sortField]: sortDirection,
        },
      }),
      prisma.user.count({
        where,
      }),
    ])

    return {
      success: true,
      data: members,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error as Error,
      meta: { total: 0, page: 1, pageSize: 5, totalPages: 1 },
    }
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
