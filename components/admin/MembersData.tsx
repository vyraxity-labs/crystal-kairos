'use client'

import { Gender, MembershipStatus } from '@/generated/prisma/enums'
import { getAllMembers } from '@/models/members/query'
import {
  AllMembersQueryParams,
  MemberTableColumns,
} from '@/types/members.interface'
import { useEffect, useMemo, useState } from 'react'
import { columns } from '../tables/membersColumns'
import { useSearchParams } from 'next/navigation'
import TablePagination from '../molecules/TablePagination'
import DataTable from '../molecules/DataTable'
import { useTranslation } from 'react-i18next'
import { SortingState } from '@tanstack/react-table'
import MembersFilterUI from './MembersFilterUI'

const statusMap = (status: string) => {
  const iStatus = status.toLowerCase()
  switch (iStatus) {
    case 'pending':
      return MembershipStatus.PENDING
    case 'approved':
      return MembershipStatus.APPROVED
    case 'rejected':
      return MembershipStatus.REJECTED
    case 'expired':
      return MembershipStatus.EXPIRED
    default:
      return MembershipStatus.PENDING
  }
}

const genderMap = (gender: string) => {
  const iGender = gender.toLowerCase()
  switch (iGender) {
    case 'male':
      return Gender.MALE
    case 'female':
      return Gender.FEMALE
    default:
      return Gender.MALE
  }
}

const FILTER_KEYS: (keyof AllMembersQueryParams)[] = [
  'search',
  'createdFrom',
  'createdTo',
  'status',
  'gender',
]

const hasActiveFilterValue = (
  key: keyof AllMembersQueryParams,
  value: AllMembersQueryParams[keyof AllMembersQueryParams],
) => {
  if (value === undefined || value === null) return false

  if (key === 'search')
    return typeof value === 'string' && value.trim().length > 0

  if (key === 'createdFrom' || key === 'createdTo') {
    return value instanceof Date && !Number.isNaN(value.getTime())
  }

  return true
}

const MembersData = () => {
  const params = useSearchParams()
  const [members, setMembers] = useState<MemberTableColumns[]>([])
  const [page, setPage] = useState(Number(params.get('page')) || 1)
  const [size, setSize] = useState(Number(params.get('size')) || 5)
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<{
    total: number
    page: number
    pageSize: number
    totalPages: number
  }>({
    total: 0,
    page: 1,
    pageSize: 5,
    totalPages: 1,
  })
  const { t } = useTranslation('admin-members')
  const rawStatus = params.get('status')
  const rawGender = params.get('gender')
  const rawCreatedFrom = params.get('createdFrom')
  const rawCreatedTo = params.get('createdTo')
  const [status, setStatus] = useState<MembershipStatus | null>(
    rawStatus ? statusMap(rawStatus) : null,
  )
  const [gender, setGender] = useState<Gender | null>(
    rawGender ? genderMap(rawGender) : null,
  )
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<MemberTableColumns[]>(
    [],
  )
  const [createdFrom, setCreatedFrom] = useState<Date | undefined>(
    rawCreatedFrom ? new Date(rawCreatedFrom) : undefined,
  )
  const [createdTo, setCreatedTo] = useState<Date | undefined>(
    rawCreatedTo ? new Date(rawCreatedTo) : undefined,
  )

  const sortField = sorting[0]?.id ?? 'createdAt'
  const sortDirection = sorting[0]?.desc ? 'desc' : 'asc'

  const filterOptions: AllMembersQueryParams = {
    page,
    pageSize: size,
    sortField,
    sortDirection,
    status: status as MembershipStatus,
    search,
    gender: gender ?? undefined,
    createdFrom,
    createdTo,
  }

  const isFiltered = useMemo(() => {
    return FILTER_KEYS.some((key) =>
      hasActiveFilterValue(key, filterOptions[key]),
    )
  }, [filterOptions])

  useEffect(() => {
    const getMembers = async () => {
      setLoading(true)
      const { data: members, meta } = await getAllMembers(filterOptions)
      const membersData: MemberTableColumns[] = members.map((member) => {
        return {
          id: member.id,
          name: member.name,
          email: member.email,
          phone: member.userInfo?.phoneNumber ?? 'N/A',
          status: member.membership?.status ?? MembershipStatus.PENDING,
          interests: member.membership?.interests ?? [],
          createdAt: member.createdAt,
          gender: member.userInfo?.gender ?? Gender.MALE,
        }
      })

      setMembers(membersData)
      setMeta(meta)
      setLoading(false)
    }

    getMembers()
  }, [
    page,
    size,
    sortField,
    sortDirection,
    status,
    search,
    gender,
    createdFrom,
    createdTo,
  ])

  return (
    <div>
      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        emptyText={t('table.body.empty')}
        sorting={sorting}
        onSortingChange={setSorting}
        onSelectedRowsChange={setSelectedMembers}
        filterUI={
          <MembersFilterUI
            search={search}
            setSearch={setSearch}
            isFiltered={isFiltered}
            gender={gender}
            setGender={setGender}
            status={status}
            setStatus={setStatus}
            createdFrom={createdFrom}
            createdTo={createdTo}
            setCreatedFrom={setCreatedFrom}
            setCreatedTo={setCreatedTo}
            selectedRows={selectedMembers}
          />
        }
      />
      {selectedMembers.length > 0 && (
        <p className='mt-2 text-sm text-muted-foreground'>
          {selectedMembers.length} member(s) selected
        </p>
      )}
      <TablePagination
        page={page}
        totalPages={meta.totalPages}
        setPage={setPage}
        setSize={setSize}
        rowsPerPageOption={[5, 10, 25, 50]}
      />
    </div>
  )
}

export default MembersData
