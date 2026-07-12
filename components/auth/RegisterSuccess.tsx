'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/button'

const RegisterSuccess = () => {
  const { t } = useTranslation('auth')

  return (
    <div className='min-h-screen flex items-center justify-center bg-surface-container-lowest p-6 relative overflow-hidden w-full'>
      {/* Background Decorative Gradients */}
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl pointer-events-none' />
      
      <div className='w-full max-w-md relative z-10'>
        <div className='bg-surface-container p-8 md:p-12 rounded-3xl border border-outline-variant/20 shadow-xl flex flex-col items-center text-center'>
          <div className='w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-100'>
            <CheckCircle2 className='w-10 h-10 text-emerald-500' />
          </div>
          
          <h1 className='font-heading font-bold text-2xl md:text-3xl text-primary mb-3'>
            {t('register.success.title')}
          </h1>
          <p className='text-muted-foreground text-sm md:text-base mb-8'>
            {t('register.success.description')}
          </p>
          
          <Button asChild className='w-full py-6 font-bold shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all' variant='secondary'>
            <Link href='/login'>
              {t('register.success.back_home')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RegisterSuccess
