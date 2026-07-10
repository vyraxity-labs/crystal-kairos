'use server'

import { prisma } from '@/lib/prisma'
import { getSessionHelper } from '../members/actions'
import { hash } from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@/generated/prisma/enums'

/**
 * Creates a new administrative staff member (ADMIN or OWNER)
 */
export const createAdminStaffAction = async (formData: {
  name: string
  email: string
  role: 'ADMIN' | 'OWNER'
  password?: string
}) => {
  try {
    const session = await getSessionHelper()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return { success: false, error: 'Unauthorized admin access.' }
    }

    const { name, email, role, password } = formData

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, error: 'User with this email already exists.' }
    }

    // Default password if not specified
    const defaultPassword = password || 'CrystalKairos2026!'
    const passwordHash = await hash(defaultPassword, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role as UserRole,
        passwordHash,
        hasSetPassword: true,
      },
    })

    revalidatePath('/admin/settings')

    return { success: true, data: user }
  } catch (error) {
    console.error('Error creating admin staff member:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create staff member.',
    }
  }
}
