'use server'

import { assumptionsData } from '@/components/auth/registration-steps/data'
import { onMemberRegistered } from '@/features/notification/triggers/member.triggers'
import { getRequiredEnv } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import {
  bankInfoSchema,
  nextOfKinSchema,
  personalInfoSchema,
  membershipInfoSchema,
  reviewAndSubmitSchema,
  setPasswordSchema,
  SetPasswordFormSchema,
} from '@/schema/auth.schema'
import {
  Step1State,
  Step2State,
  Step3State,
  Step4State,
  Step5State,
} from '@/types/register.interface'
import axios from 'axios'
import { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (
  personalInfo: Step1State['data'],
  bankInfo: Step2State['data'],
  nextOfKin: Step3State['data'],
  membershipInfo: Step4State['data'],
  reviewAndSubmit: Step5State['data'],
) => {
  try {
    // Validations
    const parsedPersonalInfo = personalInfoSchema.parse({
      ...personalInfo,
      dateOfBirth: new Date(personalInfo.dateOfBirth),
    })
    const parsedBankInfo = bankInfoSchema.parse(bankInfo)
    const parsedNextOfKin = nextOfKinSchema.parse(nextOfKin)
    membershipInfoSchema.parse(membershipInfo)
    reviewAndSubmitSchema.parse(reviewAndSubmit)

    //   check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: personalInfo.email,
      },
    })
    if (existingUser) {
      return {
        success: false,
        error: `Email ${personalInfo.email} already in use`,
      }
    }

    //   create a new user
    const { user } = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: parsedPersonalInfo.email,
          name: parsedPersonalInfo.name,
        },
      })

      await tx.userInfo.create({
        data: {
          userId: newUser.id,
          address: parsedPersonalInfo.address,
          dateOfBirth: parsedPersonalInfo.dateOfBirth,
          gender: parsedPersonalInfo.gender,
          occupation: parsedPersonalInfo.occupation,
          phoneNumber: parsedPersonalInfo.phoneNumber,
        },
      })

      await tx.bankAccount.create({
        data: {
          userId: newUser.id,
          bankName: parsedBankInfo.bankName,
          accountNumber: parsedBankInfo.accountNumber,
          accountName: parsedBankInfo.accountName,
        },
      })

      await tx.nextOfKin.create({
        data: {
          userId: newUser.id,
          name: parsedNextOfKin.name,
          phoneNumber: parsedNextOfKin.phoneNumber,
          relationship: parsedNextOfKin.relationship,
          occupation: parsedNextOfKin.occupation,
          address: parsedNextOfKin.address,
          bankName: parsedNextOfKin.bankName,
          accountNumber: parsedNextOfKin.accountNumber,
          accountName: parsedNextOfKin.accountName,
        },
      })

      await tx.membership.create({
        data: {
          userId: newUser.id,
          interests: membershipInfo.interests,
          referralName: membershipInfo.referralName,
          referralPhoneNumber: membershipInfo.referralPhoneNumber,
          assumptions: membershipInfo.assumptions,
        },
      })

      return { user: newUser }
    })

    if (user) {
      try {
        await onMemberRegistered(user.id)
      } catch (error) {
        console.error('Registration notification failed:', error)
      }
    }

    return { success: true, message: 'Registration successful', user }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid data',
    }
  }
}

export const signUser = async (userId: string, userEmail: string) => {
  try {
    const secret = getRequiredEnv('JWT_SECRET')
    const expiresIn = getRequiredEnv(
      'JWT_EXPIRATION',
    ) as jwt.SignOptions['expiresIn']
    if (!secret || !expiresIn) {
      return { success: false, error: 'Missing JWT configuration' }
    }
    const token = jwt.sign({ userId, userEmail }, secret, { expiresIn })

    return { success: true, token }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, getRequiredEnv('JWT_SECRET'))
    if (!decoded) {
      return { success: false, error: 'Invalid token' }
    }
    return {
      success: true,
      data: decoded as { userId: string; userEmail: string },
    }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

export const verifyPasswordSetToken = async (token: string) => {
  try {
    const response = await verifyToken(token)
    if (!response.success) {
      return {
        success: false,
        error: response.error,
      }
    }

    if (response.success && response.data?.userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: response.data.userEmail },
      })
      if (user && user.hasSetPassword) {
        return {
          success: false,
          error: 'Password set',
          redirect: '/login',
        }
      }
    }

    return {
      success: true,
      data: response.data as { userEmail: string; userId: string },
    }
  } catch (error) {
    return { success: false, data: null, error: error as Error }
  }
}

export const setPassword = async (
  formData: SetPasswordFormSchema,
  token: string,
) => {
  try {
    // Validations
    setPasswordSchema.parse(formData)

    // verify token
    const response = await verifyToken(token)
    if (!response.success) {
      return {
        success: false,
        error: response.error,
      }
    }

    if (response.data) {
      if (response.data.userEmail !== formData.email) {
        return {
          success: false,
          error: 'Invalid email address',
        }
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: formData.email },
    })
    if (!user) {
      return {
        success: false,
        error: 'No account found with this email address.',
      }
    }
    const hashedPassword = await hash(formData.password, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword, hasSetPassword: true },
    })
    return { success: true, data: user }
  } catch (error) {
    return { success: false, data: null, error: error as Error }
  }
}
