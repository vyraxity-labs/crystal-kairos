'use client'

import { ComponentType, ReactNode, SVGProps } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { BookPlus, PackagePlus, TicketPlus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const AddPopUp = ({ trigger }: { trigger: ReactNode }) => {
  const { t } = useTranslation('admin')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='w-full'>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent className='w-16 rounded-md'>
        <AddMenuItem
          href='/admin/members/new'
          Icon={UserPlus}
          label={t('layout.mobile-bottom-bar.add.new-member')}
        />
        <AddMenuItem
          href='/admin/savings/new'
          Icon={TicketPlus}
          label={t('layout.mobile-bottom-bar.add.new-saving')}
        />
        <AddMenuItem
          href='/admin/loans/new'
          Icon={BookPlus}
          label={t('layout.mobile-bottom-bar.add.new-loan')}
        />
        <AddMenuItem
          href='/admin/eajo/new'
          Icon={PackagePlus}
          label={t('layout.mobile-bottom-bar.add.new-eajo')}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AddPopUp

const AddMenuItem = ({
  href,
  label,
  Icon,
}: {
  href: string
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}) => {
  return (
    <DropdownMenuItem>
      <Link
        href={href}
        className='flex items-center gap-2 w-full p-2 rounded-md'
      >
        <Icon />
        {label}
      </Link>
    </DropdownMenuItem>
  )
}
