import { LoanStatus } from '@/generated/prisma/enums'

export interface MembersLoansQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  search?: string
  createdFrom?: Date
  createdTo?: Date
  status?: LoanStatus
}
