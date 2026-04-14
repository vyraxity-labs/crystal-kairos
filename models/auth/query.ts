'use server'

import { assumptionsData } from '@/components/auth/registration-steps/data'
import { prisma } from '@/lib/prisma'
import {
  bankInfoSchema,
  nextOfKinSchema,
  personalInfoSchema,
  membershipInfoSchema,
  reviewAndSubmitSchema,
} from '@/schema/auth.schema'
import {
  Step1State,
  Step2State,
  Step3State,
  Step4State,
  Step5State,
} from '@/types/register.interface'

export const register = async (
  personalInfo: Step1State['data'],
  bankInfo: Step2State['data'],
  nextOfKin: Step3State['data'],
  membershipInfo: Step4State['data'],
  reviewAndSubmit: Step5State['data'],
) => {
  try {
    // Validations
    personalInfoSchema.parse(personalInfo)
    bankInfoSchema.parse(bankInfo)
    nextOfKinSchema.parse(nextOfKin)
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
          email: personalInfo.email,
          name: personalInfo.name,
        },
      })

      await tx.userInfo.create({
        data: {
          userId: newUser.id,
          address: personalInfo.address,
          dateOfBirth: personalInfo.dateOfBirth,
          gender: personalInfo.gender,
          occupation: personalInfo.occupation,
          phoneNumber: personalInfo.phoneNumber,
        },
      })

      await tx.bankAccount.create({
        data: {
          userId: newUser.id,
          bankName: bankInfo.bankName,
          accountNumber: bankInfo.accountNumber,
          accountName: bankInfo.accountName,
        },
      })

      await tx.nextOfKin.create({
        data: {
          userId: newUser.id,
          name: nextOfKin.name,
          phoneNumber: nextOfKin.phoneNumber,
          relationship: nextOfKin.relationship,
          occupation: nextOfKin.occupation,
          address: nextOfKin.address,
          bankName: nextOfKin.bankName,
          accountNumber: nextOfKin.accountNumber,
          accountName: nextOfKin.accountName,
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

    return { success: true, message: 'Registration successful', user }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid data',
    }
  }
}
