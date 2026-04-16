import { MemberTableColumns } from '@/types/members.interface'
import { Column } from '@tanstack/react-table'
import { Button } from '../ui/button'
import TranslatedContent from './TranslatedContent'
import { ArrowDown, ArrowUp } from 'lucide-react'

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
      {column.getIsSorted() ? (
        column.getIsSorted() === 'desc' ? (
          <ArrowDown color='green' />
        ) : (
          <ArrowUp color='green' />
        )
      ) : null}
    </Button>
  )
}

export default ColumnSortRender
