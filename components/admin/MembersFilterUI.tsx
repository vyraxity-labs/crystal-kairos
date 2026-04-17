'use client'

import { useTranslation } from 'react-i18next'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { CheckIcon, ListFilter, SearchIcon, X } from 'lucide-react'
import { Button } from '../ui/button'
import useMediaQuery from '@/hooks/useMediaQuery'
import { breakpoints } from '@/lib/breakpoints'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Gender, MembershipStatus } from '@/generated/prisma/enums'
import { useState } from 'react'
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '../ui/select'
import { Field, FieldLabel } from '../ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'

const genderOptions = [
  {
    id: Gender.MALE,
    label: 'table.filters.gender.male',
    value: Gender.MALE,
  },
  {
    id: Gender.FEMALE,
    label: 'table.filters.gender.female',
    value: Gender.FEMALE,
  },
]

const statusOptions = [
  {
    id: MembershipStatus.APPROVED,
    label: 'table.filters.status.approved',
    value: MembershipStatus.APPROVED,
  },
  {
    id: MembershipStatus.PENDING,
    label: 'table.filters.status.pending',
    value: MembershipStatus.PENDING,
  },
  {
    id: MembershipStatus.REJECTED,
    label: 'table.filters.status.rejected',
    value: MembershipStatus.REJECTED,
  },
  {
    id: MembershipStatus.EXPIRED,
    label: 'table.filters.status.expired',
    value: MembershipStatus.EXPIRED,
  },
]

const MembersFilterUI = ({
  search,
  setSearch,
  isFiltered,
  gender,
  setGender,
  status,
  setStatus,
  createdFrom,
  createdTo,
  setCreatedFrom,
  setCreatedTo,
}: {
  search: string
  setSearch: (val: string) => void
  isFiltered: boolean
  gender: Gender | null
  setGender: (val: Gender | null) => void
  status: MembershipStatus | null
  setStatus: (val: MembershipStatus | null) => void
  createdFrom: Date | undefined
  createdTo: Date | undefined
  setCreatedFrom: (val: Date | undefined) => void
  setCreatedTo: (val: Date | undefined) => void
}) => {
  const { t } = useTranslation('admin-members')
  const md = useMediaQuery(breakpoints.md)
  const { sidebarIsCollapsed } = useSelector((store: RootState) => store.nav)
  const [open, setOpen] = useState(false)

  const clearFilters = () => {
    setSearch('')
    setGender(null)
    setStatus(null)
    setCreatedFrom(undefined)
    setCreatedTo(undefined)
  }

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
        {search.trim() && (
          <InputGroupAddon align='inline-end'>
            <Button
              size='icon'
              variant='ghost'
              className='cursor-pointer text-error'
              onClick={() => setSearch('')}
            >
              <X />
            </Button>
          </InputGroupAddon>
        )}
      </InputGroup>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>
          <Button
            variant='outline'
            size={md ? 'default' : 'icon'}
            className='rounded-sm'
            onClick={() => setOpen(true)}
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
        </DropdownMenuTrigger>

        <DropdownMenuContent className='rounded-md min-w-72'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              {t('table.filters.gender.label')}
            </DropdownMenuLabel>
            <div className='grid grid-cols-3 gap-1'>
              {genderOptions.map((item) => {
                return (
                  <DropdownMenuItem
                    className={cn(
                      'flex justify-center rounded-sm py-1.5',
                      gender === item.value
                        ? 'bg-surface-container-high text-on-surface'
                        : '',
                    )}
                    key={item.id}
                    onClick={() => setGender(item.value)}
                  >
                    {gender === item.value && <CheckIcon />}
                    {t(item.label)}
                  </DropdownMenuItem>
                )
              })}
              {gender && (
                <Button
                  variant='ghost'
                  className='text-error'
                  onClick={() => setGender(null)}
                >
                  {t('table.filters.gender.clear')}
                </Button>
              )}
            </div>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>
              {t('table.filters.status.label')}
            </DropdownMenuLabel>

            <div className='flex items-center'>
              <Select
                value={status || undefined}
                onValueChange={(value: MembershipStatus) => setStatus(value)}
              >
                <SelectTrigger className='w-full rounded-sm'>
                  <SelectValue placeholder={t('table.filters.status.empty')} />
                </SelectTrigger>
                <SelectContent className='rounded-md'>
                  {statusOptions.map((item) => {
                    return (
                      <SelectItem key={item.id} value={item.value}>
                        {t(item.label)}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {status && (
                <Button
                  variant='ghost'
                  className='text-error'
                  onClick={() => setStatus(null)}
                >
                  {t('table.filters.status.clear')}
                </Button>
              )}
            </div>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>
              {t('table.filters.date_joined.label')}
            </DropdownMenuLabel>

            <div className='flex items-center gap-3'>
              <DateFilter
                date={createdFrom}
                label='table.filters.date_joined.from_label'
                empty='table.filters.date_joined.from_empty'
                setDate={setCreatedFrom}
                id='from-date'
                min={new Date('01-01-1970')}
                max={createdTo || new Date()}
              />
              <DateFilter
                date={createdTo}
                label='table.filters.date_joined.to_label'
                empty='table.filters.date_joined.to_empty'
                setDate={setCreatedTo}
                id='to-date'
                min={createdFrom || new Date('01-01-1970')}
                max={new Date()}
              />
            </div>
            <article className='flex justify-end'>
              <Button
                variant='ghost'
                className='text-error'
                onClick={() => {
                  setCreatedFrom(undefined)
                  setCreatedTo(undefined)
                }}
              >
                {t('table.filters.date_joined.clear')}
              </Button>
            </article>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={clearFilters}>
              <Button variant='ghost' className='w-full text-error'>
                {t('buttons.clear_all')}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default MembersFilterUI

const DateFilter = ({
  date,
  label,
  empty,
  setDate,
  id,
  min,
  max,
}: {
  date: Date | undefined
  label: string
  empty: string
  setDate: (val: Date | undefined) => void
  id: string
  min: Date
  max: Date
}) => {
  const { t } = useTranslation('admin-members')
  const [open, setOpen] = useState(false)

  return (
    <Field>
      <FieldLabel htmlFor={id}>{t(label)}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id={id}
            className='justify-start font-normal rounded-sm text-xs'
          >
            {date ? format(date, 'MMM d, yyy') : t(empty)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={date}
            captionLayout='dropdown'
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
            defaultMonth={date}
            disabled={{ after: max, before: min }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
