'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Field, FieldLabel } from '../ui/field'
import { Pagination, PaginationContent } from '../ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useTranslation } from 'react-i18next'

const TablePagination = ({
  page,
  totalPages,
  setPage,
  setSize,
  rowsPerPageOption,
}: {
  page: number
  totalPages: number
  setPage: (val: number) => void
  setSize: (val: number) => void
  rowsPerPageOption: number[]
}) => {
  const { t } = useTranslation('common')

  return (
    <div className='flex items-center justify-between gap-4 mt-3'>
      <Field orientation='horizontal' className='w-fit'>
        <FieldLabel htmlFor='select-rows-per-page'>
          {t('table.pagination.rows_per_page')}
        </FieldLabel>
        <Select
          defaultValue={String(rowsPerPageOption[0])}
          onValueChange={(value) => setSize(Number(value))}
        >
          <SelectTrigger className='w-20 rounded-md' id='select-rows-per-page'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align='start'>
            <SelectGroup>
              {rowsPerPageOption.map((item) => (
                <SelectItem value={String(item)} key={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Pagination className='mx-0 w-auto'>
        <PaginationContent>
          <Button
            variant='outline'
            size='icon'
            disabled={page === 1}
            className='disabled:cursor-not-allowed'
            onClick={() => setPage(page - 1)}
            title={t('table.pagination.previous')}
          >
            <ChevronLeft />
          </Button>
          <span>
            {page} {t('table.pagination.of')} {totalPages}
          </span>
          <Button
            variant='outline'
            size='icon'
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            title={t('table.pagination.next')}
          >
            <ChevronRight />
          </Button>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default TablePagination
