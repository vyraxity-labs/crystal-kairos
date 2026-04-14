'use client'

import { Button } from '../ui/button'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { DropdownMenuContent } from '../ui/dropdown-menu'
import Logout from './logout'
import Link from 'next/link'
import UserAvatar from './UserAvatar'
import { useTranslation } from 'react-i18next'

const AvatarMenu = () => {
  const { t } = useTranslation('admin')

  return (
    <div className='md:hidden'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            className='rounded-full cursor-pointer'
            variant='ghost'
          >
            <UserAvatar />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='w-32 rounded-md'>
          <DropdownMenuGroup>
            <AvatarMenuItem
              href='/admin/profile'
              label={t('layout.sidebar.menu-items.profile')}
            />
            <AvatarMenuItem
              href='/admin/settings'
              label={t('layout.sidebar.menu-items.settings')}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default AvatarMenu

const AvatarMenuItem = ({ href, label }: { href: string; label: string }) => {
  return (
    <DropdownMenuItem>
      <Button asChild variant='ghost' className='w-full justify-start'>
        <Link href={href}>{label}</Link>
      </Button>
    </DropdownMenuItem>
  )
}
