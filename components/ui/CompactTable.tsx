import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from './table'

interface CompactTableColumn<T> {
  header: React.ReactNode
  accessorKey?: keyof T | string
  cell?: (row: T, index: number) => React.ReactNode
  className?: string
}

interface CompactTableProps<T> {
  data: T[]
  columns: CompactTableColumn<T>[]
  emptyMessage?: string
  className?: string
  rowClassName?: string
}

export function CompactTable<T>({
  data,
  columns,
  emptyMessage = 'No records found.',
  className,
  rowClassName,
}: CompactTableProps<T>) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-md border border-outline-variant/30',
        className,
      )}
    >
      <Table className='w-full font-sans text-xs border-collapse'>
        <TableHeader className='bg-primary hover:bg-primary border-b-0'>
          <TableRow className='border-b-0 hover:bg-primary/95'>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  'h-10 px-4 text-on-primary font-semibold text-xs select-none first:rounded-tl-md last:rounded-tr-md',
                  column.className,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow className='border-b-0 hover:bg-transparent'>
              <TableCell
                colSpan={columns.length}
                className='h-24 text-center text-muted-foreground font-medium p-4'
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={cn(
                  'border-b border-outline-variant/20 hover:bg-muted-foreground/5 transition-colors',
                  rowIndex % 2 === 1
                    ? 'bg-surface-container-low'
                    : 'bg-surface',
                  rowClassName,
                )}
              >
                {columns.map((column, colIndex) => {
                  let cellContent: React.ReactNode = ''
                  if (column.cell) {
                    cellContent = column.cell(row, rowIndex)
                  } else if (column.accessorKey) {
                    cellContent = (row as any)[column.accessorKey]
                  }

                  return (
                    <TableCell
                      key={colIndex}
                      className={cn(
                        'px-4 py-2 text-on-surface-variant font-medium select-text align-middle h-10',
                        column.className,
                      )}
                    >
                      {cellContent}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default CompactTable
