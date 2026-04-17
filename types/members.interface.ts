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
