'use client'

import { signOut } from 'next-auth/react'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'

const Logout = () => {
  const { t } = useTranslation('common')

  return (
    <Button
      onClick={() => signOut()}
      className='w-full bg-error text-on-error hover:bg-error/80 rounded-sm'
      variant='destructive'
    >
      {t('buttons.logout')}
    </Button>
  )
}
export default Logout
