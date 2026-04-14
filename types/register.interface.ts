import * as z from 'zod'
import {
  bankInfoSchema,
  membershipInfoSchema,
  nextOfKinSchema,
  personalInfoSchema,
  reviewAndSubmitSchema,
} from '@/schema/auth.schema'
import {
  Assumptions,
  Gender,
  MembershipInterest,
  Relationship,
} from '@/generated/prisma/enums'

export interface InitialState {
  currentStep: number
  step1: Step1State
  step2: Step2State
  step3: Step3State
  step4: Step4State
  step5: Step5State
  stepsState: Record<number, { hasErrors: boolean }>
}

export type RegistrationStepSchema =
  | typeof personalInfoSchema
  | typeof bankInfoSchema
  | typeof nextOfKinSchema
  | typeof membershipInfoSchema
  | typeof reviewAndSubmitSchema

/** Values for any registration step (union); use with per-step `currentSchema` + resolver assertion. */
export type RegistrationFormValues =
  | z.infer<typeof personalInfoSchema>
  | z.infer<typeof bankInfoSchema>
  | z.infer<typeof nextOfKinSchema>
  | z.infer<typeof membershipInfoSchema>
  | z.infer<typeof reviewAndSubmitSchema>

export interface Step1State {
  data: {
    name: string
    email: string
    phoneNumber: string
    dateOfBirth: string
    gender: Gender
    address: string
    occupation: string
  }
  hasErrors: boolean
}

export interface Step2State {
  data: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  hasErrors: boolean
}

export interface Step3State {
  data: {
    name: string
    phoneNumber: string
    relationship: Relationship
    occupation: string
    address: string
    bankName: string
    accountNumber: string
    accountName: string
  }
  hasErrors: boolean
}

export interface Step4State {
  data: {
    interests: MembershipInterest[]
    referralName: string
    referralPhoneNumber: string
    assumptions: Assumptions[]
  }
  hasErrors: boolean
}

export interface Step5State {
  data: {
    termsAndConditions: boolean
  }
  hasErrors: boolean
}
