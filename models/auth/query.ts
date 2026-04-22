'use server'

import { assumptionsData } from '@/components/auth/registration-steps/data'
import { onMemberRegistered } from '@/features/notification/triggers/member.triggers'
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
      await onMemberRegistered(user.id)
    }

    return { success: true, message: 'Registration successful', user }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid data',
    }
  }
}
