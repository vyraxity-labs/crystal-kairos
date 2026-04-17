'use client'

import { MemberTableColumns } from '@/types/members.interface'
import { ColumnDef } from '@tanstack/react-table'
import StatusChip from '../molecules/StatusChip'
import { Button } from '../ui/button'
import Link from 'next/link'
import TranslatedContent from '../atoms/TranslatedContent'
import ColumnSortRender from '../atoms/ColumnsSortRender'
import { format } from 'date-fns'
import { Gender } from '@/generated/prisma/enums'
import { Checkbox } from '../ui/checkbox'

export const columns: ColumnDef<MemberTableColumns>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      )
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <ColumnSortRender
        column={column}
        label='table.header.name'
        ns='admin-members'
      />
    ),
  },
  {
    accessorKey: 'gender',
    header: () => (
      <TranslatedContent label='table.header.gender' ns='admin-members' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('gender') as Gender
      return (
        <span className='flex justify-center items-center text-xs'>
          <TranslatedContent
            ns='admin-members'
            label={`table.filters.gender.${value.toLowerCase()}`}
          />
        </span>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <ColumnSortRender
        label='table.header.email'
        ns='admin-members'
        column={column}
      />
    ),
  },
  {
    accessorKey: 'phone',
    header: () => (
      <TranslatedContent label='table.header.phone' ns='admin-members' />
    ),
  },
  {
    accessorKey: 'status',
    header: () => (
      <TranslatedContent label='table.header.status' ns='admin-members' />
    ),
    cell: ({ row }) => <StatusChip status={row.getValue('status')} />,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <ColumnSortRender
        column={column}
        ns='admin-members'
        label='table.header.date_joined'
      />
    ),
    cell: ({ row }) => {
      const formatted = format(row.getValue('createdAt'), 'MMM d, yyyy')
      return <span className='flex justify-center'>{formatted}</span>
    },
  },
  {
    id: 'actions',
    header: () => (
      <TranslatedContent label='table.header.actions' ns='admin-members' />
    ),
    cell: ({ row }) => {
      const memberId = row.original.id

      return (
        <Button className='rounded-sm text-on-primary' asChild>
          <Link href={`/admin/members/${memberId}`}>
            <TranslatedContent label='buttons.view' ns='admin-members' />
          </Link>
        </Button>
      )
    },
  },
]
