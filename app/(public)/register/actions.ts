'use server'

import { prisma } from '@/db/prisma'
import type { RegistrationFormData } from '@/types/registration.interface'
import {
  Gender,
  Relationship,
  MembershipInterest,
  Assumptions,
  MembershipTier,
} from '@/generated/prisma/client'

function generateMembershipNumber(): string {
  const prefix = 'CK'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export async function submitRegistration(formData: RegistrationFormData) {
  if (!formData.declarationAccepted) {
    return { success: false, error: 'Declaration must be accepted' }
  }

  if (
    !formData.fullName ||
    !formData.email ||
    !formData.phoneNumber ||
    !formData.gender ||
    !formData.dateOfBirth ||
    !formData.occupation ||
    !formData.address ||
    !formData.stateOfOrigin
  ) {
    return { success: false, error: 'Personal information is incomplete' }
  }

  if (!formData.bankName || !formData.accountNumber || !formData.accountName) {
    return { success: false, error: 'Bank details are incomplete' }
  }

  if (
    !formData.kinFullName ||
    !formData.kinRelationship ||
    !formData.kinPhoneNumber ||
    !formData.kinOccupation ||
    !formData.kinAddress ||
    !formData.kinBankName ||
    !formData.kinAccountNumber ||
    !formData.kinAccountName
  ) {
    return { success: false, error: 'Next of kin details are incomplete' }
  }

  if (formData.interests.length === 0 || formData.assumptions.length === 0) {
    return { success: false, error: 'Please select interests and confirm all assumptions' }
  }

  try {
    const dateOfBirth = new Date(formData.dateOfBirth)
    if (isNaN(dateOfBirth.getTime())) {
      return { success: false, error: 'Invalid date of birth' }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    })

    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' }
    }

    const user = await prisma.user.create({
      data: {
        email: formData.email,
        name: formData.fullName,
      },
    })

    await prisma.userInfo.create({
      data: {
        userId: user.id,
        address: formData.address,
        dateOfBirth,
        gender: formData.gender as Gender,
        occupation: formData.occupation,
        phoneNumber: formData.phoneNumber,
        stateOfOrigin: formData.stateOfOrigin,
      },
    })

    await prisma.bankAccount.create({
      data: {
        userId: user.id,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        isPrimary: true,
      },
    })

    await prisma.nextOfKin.create({
      data: {
        userId: user.id,
        name: formData.kinFullName,
        phoneNumber: formData.kinPhoneNumber,
        relationship: formData.kinRelationship as Relationship,
        occupation: formData.kinOccupation,
        address: formData.kinAddress,
        bankName: formData.kinBankName,
        accountNumber: formData.kinAccountNumber,
        accountName: formData.kinAccountName,
      },
    })

    const tier =
      formData.interests.includes(MembershipInterest.SAVINGS) ||
      formData.interests.includes(MembershipInterest.AJO)
        ? MembershipTier.GOLD_MEMBER
        : MembershipTier.MEMBER

    await prisma.membership.create({
      data: {
        userId: user.id,
        sourceOfIncome: [],
        interests: formData.interests as MembershipInterest[],
        referralName: formData.referrerName || null,
        referralPhoneNumber: formData.referrerPhone || null,
        assumptions: formData.assumptions as Assumptions[],
        membershipNumber: generateMembershipNumber(),
        tier,
      },
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    }
  }
}
