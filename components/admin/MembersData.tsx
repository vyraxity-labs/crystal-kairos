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
  switch (status) {
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

const FILTER_KEYS: (keyof AllMembersQueryParams)[] = [
  'search',
  'createdFrom',
  'createdTo',
  'status',
  'gender',
]

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
  const [status, setStatus] = useState<MembershipStatus | null>(
    rawStatus ? statusMap(rawStatus) : null,
  )
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState('')

  const sortField = sorting[0]?.id ?? 'createdAt'
  const sortDirection = sorting[0]?.desc ? 'desc' : 'asc'

  const filterOptions: AllMembersQueryParams = {
    page,
    pageSize: size,
    sortField,
    sortDirection,
    status: status as MembershipStatus,
    search,
  }

  const isFiltered = useMemo(
    () => FILTER_KEYS.some((key) => filterOptions[key] !== undefined),
    [filterOptions],
  )
  console.log('FILTER ==>', isFiltered)

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
  }, [page, size, sortField, sortDirection, status, search])

  return (
    <div>
      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        emptyText={t('table.body.empty')}
        sorting={sorting}
        onSortingChange={setSorting}
        filterUI={
          <MembersFilterUI
            search={search}
            setSearch={setSearch}
            isFiltered={isFiltered}
          />
        }
      />
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
