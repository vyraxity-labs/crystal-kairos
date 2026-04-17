import { MemberTableColumns } from '@/types/members.interface'
import { Column } from '@tanstack/react-table'
import { Button } from '../ui/button'
import TranslatedContent from './TranslatedContent'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const ColumnSortRender = ({
  column,
  label,
  ns,
}: {
  column: Column<MemberTableColumns, unknown>
  label: string
  ns: string
}) => {
  return (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <TranslatedContent label={label} ns={ns} />
      <span
        className={cn(
          column.getIsSorted() ? 'text-success' : 'text-muted-foreground',
        )}
      >
        {column.getIsSorted() === 'desc' ? <ArrowDown /> : <ArrowUp />}
      </span>
    </Button>
  )
}

export default ColumnSortRender
