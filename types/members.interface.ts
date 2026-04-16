import {
  Gender,
  MembershipInterest,
  MembershipStatus,
} from '@/generated/prisma/enums'

export interface MemberTableColumns {
  id: string
  name: string
  email: string
  phone: string
  status: MembershipStatus
  interests: MembershipInterest[]
  createdAt: Date
}

export interface MembershipStatusFormatData {
  label: string
  value: MembershipStatus
  bg: string
  text: string
}

export interface AllMembersQueryParams {
  page?: number
  pageSize?: number
  search?: string
  createdFrom?: Date
  createdTo?: Date
  gender?: Gender
  membershipStatus?: MembershipStatus
  sortField?: string
  sortDirection?: 'asc' | 'desc'
}
