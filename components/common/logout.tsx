'use client'

import { signOut } from 'next-auth/react'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { LogOutIcon } from 'lucide-react'

const Logout = ({ showText = true }: { showText?: boolean }) => {
  const { t } = useTranslation('common')

  return (
    <Button
      onClick={() => signOut()}
      className='w-full bg-error text-on-error hover:bg-error/80 rounded-sm'
      variant='destructive'
      title={t('buttons.logout')}
    >
      <LogOutIcon />
      {showText && <span>{t('buttons.logout')}</span>}
    </Button>
  )
}
export default Logout
