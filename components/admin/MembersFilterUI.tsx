'use client'

import { useTranslation } from 'react-i18next'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { ListFilter, SearchIcon } from 'lucide-react'
import { Button } from '../ui/button'
import useMediaQuery from '@/hooks/useMediaQuery'
import { breakpoints } from '@/lib/breakpoints'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { cn } from '@/lib/utils'

const MembersFilterUI = ({
  search,
  setSearch,
  isFiltered,
}: {
  search: string
  setSearch: (val: string) => void
  isFiltered: boolean
}) => {
  const { t } = useTranslation('admin-members')
  const md = useMediaQuery(breakpoints.md)
  const { sidebarIsCollapsed } = useSelector((store: RootState) => store.nav)

  return (
    <div className='w-full flex justify-between'>
      <InputGroup className='max-w-60'>
        <InputGroupInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('table.filters.search.placeholder')}
          className='placeholder:text-xs'
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      <Button
        variant='outline'
        size={md ? 'default' : 'icon'}
        className='rounded-sm'
      >
        <article className='relative text-success'>
          <ListFilter />
          {isFiltered && (
            <span className='flex w-2 aspect-square bg-error rounded-full absolute top-0'></span>
          )}
        </article>
        <span
          className={cn(
            'hidden',
            sidebarIsCollapsed ? 'md:block' : 'hidden lg:block',
          )}
        >
          {t('table.filters.filter')}
        </span>
      </Button>
    </div>
  )
}

export default MembersFilterUI
