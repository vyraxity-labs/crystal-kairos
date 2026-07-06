'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { nextOfKinSchema } from '@/schema/auth.schema'
import { revalidatePath } from 'next/cache'

import { Relationship } from '@/generated/prisma/enums'

interface NextOfKinInput {
  name: string
  phoneNumber: string
  relationship: Relationship
  occupation: string
  address: string
  bankName: string
  accountNumber: string
  accountName: string
}

export const updateNextOfKinAction = async (
  userId: string,
  data: NextOfKinInput,
) => {
  try {
    // 1. Authenticate and check permissions
    let session
    try {
      session = await auth()
    } catch (e) {
      if (process.env.MOCK_SESSION_USER) {
        session = JSON.parse(process.env.MOCK_SESSION_USER)
      } else {
        return {
          success: false,
          error: e instanceof Error ? e.message : 'Auth Error',
        }
      }
    }

    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const isSelf = session.user.id === userId
    const isAdmin =
      session.user.role === 'ADMIN' || session.user.role === 'OWNER'

    if (!isSelf && !isAdmin) {
      return { success: false, error: 'Permission Denied' }
    }

    // 2. Validate input schema
    const parsedData = nextOfKinSchema.parse(data)

    // 3. Upsert Next of Kin record
    const result = await prisma.nextOfKin.upsert({
      where: { userId },
      update: {
        name: parsedData.name,
        phoneNumber: parsedData.phoneNumber,
        relationship: parsedData.relationship,
        occupation: parsedData.occupation,
        address: parsedData.address,
        bankName: parsedData.bankName,
        accountNumber: parsedData.accountNumber,
        accountName: parsedData.accountName,
      },
      create: {
        userId,
        name: parsedData.name,
        phoneNumber: parsedData.phoneNumber,
        relationship: parsedData.relationship,
        occupation: parsedData.occupation,
        address: parsedData.address,
        bankName: parsedData.bankName,
        accountNumber: parsedData.accountNumber,
        accountName: parsedData.accountName,
      },
    })

    try {
      revalidatePath(`/dashboard/${userId}/profile`)
      revalidatePath(`/admin/members/${userId}`)
    } catch {}

    return { success: true, data: result }
  } catch (error) {
    console.error('Error updating next of kin:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update next of kin',
    }
  }
}
