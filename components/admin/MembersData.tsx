'use client'

import { MembershipStatus } from '@/generated/prisma/enums'
import { getAllMembers } from '@/models/members/query'
import { MemberTableColumns } from '@/types/members.interface'
import { useEffect, useState } from 'react'
import { columns } from '../tables/membersColumns'
import { useSearchParams } from 'next/navigation'
import TablePagination from '../molecules/TablePagination'
import DataTable from '../molecules/DataTable'
import { useTranslation } from 'react-i18next'
import { SortingState } from '@tanstack/react-table'

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
  const [sorting, setSorting] = useState<SortingState>([])

  const sortField = sorting[0]?.id ?? 'createdAt'
  const sortDirection = sorting[0]?.desc ? 'desc' : 'asc'

  useEffect(() => {
    const getMembers = async () => {
      setLoading(true)
      const { data: members, meta } = await getAllMembers({
        page,
        pageSize: size,
        sortField,
        sortDirection,
      })
      const membersData: MemberTableColumns[] = members.map((member) => {
        return {
          id: member.id,
          name: member.name,
          email: member.email,
          phone: member.userInfo?.phoneNumber ?? 'N/A',
          status: member.membership?.status ?? MembershipStatus.PENDING,
          interests: member.membership?.interests ?? [],
          createdAt: member.createdAt,
        }
      })

      setMembers(membersData)
      setMeta(meta)
      setLoading(false)
    }

    getMembers()
  }, [page, size, sortField, sortDirection])

  return (
    <div>
      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        emptyText={t('table.body.empty')}
        sorting={sorting}
        onSortingChange={setSorting}
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
