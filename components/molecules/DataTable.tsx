'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { cn } from '@/lib/utils'
import { ReactNode, useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TableProps<TData, TValues> {
  columns: ColumnDef<TData, TValues>[]
  data: TData[]
  loading: boolean
  emptyText: string
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  filterUI?: ReactNode
  onSelectedRowsChange?: (rows: TData[]) => void
}

const DataTable = <TData, TValues>({
  columns,
  data,
  loading,
  emptyText,
  sorting,
  filterUI,
  onSortingChange,
  onSelectedRowsChange,
}: TableProps<TData, TValues>) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { t } = useTranslation('common')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    state: { sorting, columnVisibility, rowSelection },
  })

  useEffect(() => {
    if (!onSelectedRowsChange) return
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original)
    onSelectedRowsChange(selectedRows)
  }, [rowSelection, data, onSelectedRowsChange, table])

  return (
    <div>
      <div className='flex mb-4 gap-2'>
        {filterUI}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='ml-auto rounded-sm cursor-pointer text-on-primary text-xs'>
              {t('table.filters.column')} <ChevronUp />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='rounded-md'>
            {(() => {
              const hideAbleColumns = table
                .getAllColumns()
                .filter((column) => column.getCanHide())
              const areAllHideAbleColumnsVisible = hideAbleColumns.every(
                (column) => column.getIsVisible(),
              )

              return (
                <>
                  {hideAbleColumns.map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        className='capitalize cursor-pointer hover:bg-surface-container-low rounded-sm'
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                  {hideAbleColumns.length > 0 && (
                    <div className='my-1 h-px bg-outline-variant' />
                  )}
                  <DropdownMenuCheckboxItem
                    checked={areAllHideAbleColumnsVisible}
                    onCheckedChange={(value) => {
                      const shouldShowAll = !!value
                      hideAbleColumns.forEach((column) => {
                        column.toggleVisibility(shouldShowAll)
                      })
                    }}
                    className='capitalize cursor-pointer hover:bg-surface-container-low rounded-sm font-medium'
                  >
                    {areAllHideAbleColumnsVisible
                      ? t('table.filters.hide_all_columns')
                      : t('table.filters.show_all_columns')}
                  </DropdownMenuCheckboxItem>
                </>
              )
            })()}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableHeader>

          <TableBody className={cn(loading ? 'opacity-50' : 'opacity-100')}>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DataTable
