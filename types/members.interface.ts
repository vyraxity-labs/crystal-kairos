import {
  Gender,
  MembershipInterest,
  MembershipStatus,
  Relationship,
} from '@/generated/prisma/enums'

export interface MemberTableColumns {
  id: string
  name: string
  email: string
  phone: string
  status: MembershipStatus
  interests: MembershipInterest[]
  createdAt: Date
  gender: Gender
}

export interface MembershipStatusFormatData {
  label: string
  value: MembershipStatus
  bg: string
  text: string
}

export interface AllMembersQueryParams {
  page: number
  pageSize: number
  sortField: string
  sortDirection: 'asc' | 'desc'
  search?: string
  createdFrom?: Date
  createdTo?: Date
  status?: MembershipStatus
  gender?: Gender
}

export interface MemberDetails {
  personalInfo: {
    name: string
    email: string
    phone?: string | null
    address?: string | null
    dateOfBirth?: Date | null
    occupation?: string | null
    gender?: Gender | null
  }
  bankInfo: {
    bankName: string
    accountNumber: string
    accountName: string
    isPrimary: boolean
    id: string
  }
  nextOfKinInfo: {
    name: string | undefined
    address: string | undefined
    occupation: string | undefined
    phoneNumber: string | undefined
    accountNumber: string | undefined
    accountName: string | undefined
    bankName: string | undefined
    relationship: Relationship | undefined
  }
}
