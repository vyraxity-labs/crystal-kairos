'use server'

import { assumptionsData } from '@/components/auth/registration-steps/data'
import { prisma } from '@/lib/prisma'
import {
  Step1State,
  Step2State,
  Step3State,
  Step4State,
  Step5State,
} from '@/types/register.interface'
import { Gender } from '@/types/user.interface'

export const register = async (
  personalInfo: Step1State['data'],
  bankInfo: Step2State['data'],
  nextOfKin: Step3State['data'],
  membershipInfo: Step4State['data'],
  reviewAndSubmit: Step5State['data'],
) => {
  // Validations
  if (
    personalInfo.name.trim() === '' ||
    personalInfo.email.trim() === '' ||
    personalInfo.phoneNumber.trim() === '' ||
    personalInfo.dateOfBirth.trim() === '' ||
    personalInfo.gender.trim() === '' ||
    personalInfo.address.trim() === '' ||
    personalInfo.occupation.trim() === ''
  ) {
    return { success: false, error: 'Personal information is incomplete' }
  }

  if (
    bankInfo.bankName.trim() === '' ||
    bankInfo.accountNumber.trim() === '' ||
    bankInfo.accountName.trim() === ''
  ) {
    return { success: false, error: 'Banking details are incomplete' }
  }

  if (
    nextOfKin.name.trim() === '' ||
    nextOfKin.phoneNumber.trim() === '' ||
    nextOfKin.relationship.trim() === '' ||
    nextOfKin.occupation.trim() === '' ||
    nextOfKin.address.trim() === '' ||
    nextOfKin.bankName.trim() === '' ||
    nextOfKin.accountNumber.trim() === '' ||
    nextOfKin.accountName.trim() === ''
  ) {
    return { success: false, error: 'Next of kin details are incomplete' }
  }

  if (
    membershipInfo.interests.length === 0 ||
    membershipInfo.referralName.trim() === '' ||
    membershipInfo.referralPhoneNumber.trim() === '' ||
    membershipInfo.assumptions.length !== assumptionsData.length
  ) {
    return { success: false, error: 'Membership information is incomplete' }
  }

  if (reviewAndSubmit.termsAndConditions === false) {
    return { success: false, error: 'Terms and conditions are not accepted' }
  }

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

  return { success: true, message: 'Registration successful' }
}
