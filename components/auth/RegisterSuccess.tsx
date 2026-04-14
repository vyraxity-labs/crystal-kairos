'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const RegisterSuccess = () => {
  const { t } = useTranslation('auth')

  return (
    <div className='w-[90%] mx-auto flex flex-col justify-center items-center gap-5'>
      <h1 className='text-2xl text-center font-bold'>
        {t('register.success.title')}
      </h1>
      <p className='text-center'>{t('register.success.description')}</p>
      <Link href='/' className='underline'>
        {t('register.success.back_home')}
      </Link>
    </div>
  )
}

export default RegisterSuccess
