import type {
  Gender,
  Relationship,
  MembershipInterest,
  Assumptions,
} from '@/generated/prisma/client'

export interface RegistrationFormData {
  // Step 1: Personal
  fullName: string
  email: string
  phoneNumber: string
  gender: Gender | ''
  dateOfBirth: string
  occupation: string
  address: string
  stateOfOrigin: string

  // Step 2: Bank
  bankName: string
  accountNumber: string
  accountName: string

  // Step 3: Next of Kin
  kinFullName: string
  kinRelationship: Relationship | ''
  kinPhoneNumber: string
  kinOccupation: string
  kinAddress: string
  kinBankName: string
  kinAccountNumber: string
  kinAccountName: string

  // Step 4: Interests
  interests: MembershipInterest[]
  referrerName: string
  referrerPhone: string
  assumptions: Assumptions[]

  // Step 5: Review - declaration
  declarationAccepted: boolean
}

export const initialRegistrationForm: RegistrationFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  gender: '',
  dateOfBirth: '',
  occupation: '',
  address: '',
  stateOfOrigin: '',

  bankName: '',
  accountNumber: '',
  accountName: '',

  kinFullName: '',
  kinRelationship: '',
  kinPhoneNumber: '',
  kinOccupation: '',
  kinAddress: '',
  kinBankName: '',
  kinAccountNumber: '',
  kinAccountName: '',

  interests: [],
  referrerName: '',
  referrerPhone: '',
  assumptions: [],

  declarationAccepted: false,
}
