'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Button } from '@mui/material'
import theme from '@/lib/theme'

const Hero = () => {
  const { t } = useTranslation('home')

  return (
    <section
      className='relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-16 md:py-24'
      style={{
        background:
          'linear-gradient(135deg, #fafbff 0%, #f0f4ff 50%, #eef2ff 100%)',
      }}
    >
      <div className='flex flex-col items-center text-center max-w-3xl mx-auto'>
        {/* Badge */}
        <div
          className='inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 shadow-sm'
          style={{
            backgroundColor: 'var(--color-primary-light)',
            borderColor: theme.palette.primary.main,
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 18, color: 'var(--color-primary)' }}
          />
          <span
            className='text-sm font-medium'
            style={{ color: 'var(--color-primary)' }}
          >
            {t('hero.badge')}
          </span>
        </div>

        {/* Heading */}
        <h1 className='text-hero mb-4'>
          <span
            style={{
              background:
                'linear-gradient(90deg, #1E3A5F 0%, #1A4CEB 50%, #4361ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('hero.title_part1')}
          </span>{' '}
          <span className='font-bold' style={{ color: 'var(--color-accent)' }}>
            {t('hero.title_part2')}
          </span>
        </h1>

        {/* Description */}
        <p
          className='text-lg md:text-xl mb-8 max-w-2xl'
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 mb-16'>
          <Link href='/register'>
            <Button variant='contained'>{t('hero.button_member')}</Button>
          </Link>
          <Link href='/eajo'>
            <Button variant='contained' color='secondary'>
              {t('hero.button_explore')}
            </Button>
          </Link>
        </div>

        {/* Placeholder logos row */}
        <div className='flex flex-wrap justify-center gap-6 md:gap-10'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='w-14 h-14 md:w-16 md:h-16 rounded-lg border flex items-center justify-center'
              style={{
                backgroundColor: 'var(--color-bg-paper)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className='w-8 h-8 rounded'
                style={{
                  backgroundColor: 'var(--color-text-muted)',
                  opacity: 0.4,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
