'use client'

import { useTranslation } from 'react-i18next'
import DashboardIcon from '@mui/icons-material/Dashboard'

const MemberSteps = () => {
  const { t } = useTranslation('home')

  return (
    <section
      className='px-6 py-16 md:py-24'
      style={{ backgroundColor: 'var(--color-bg-paper)' }}
    >
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          {/* Left: Title and steps */}
          <div>
            <h2
              className='text-display mb-4'
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('memberSteps.title_part1')}{' '}
              <span
                className='font-bold'
                style={{ color: 'var(--color-primary)' }}
              >
                {t('memberSteps.title_part2')}
              </span>
            </h2>

            <p
              className='text-base mb-10'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('memberSteps.intro')}
            </p>

            <div className='flex flex-col gap-8'>
              {(['1', '2', '3'] as const).map((step) => (
                <div key={step} className='flex gap-4'>
                  <div
                    className='shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg'
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {step}
                  </div>
                  <div>
                    <h3
                      className='font-bold text-lg mb-1'
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {t(`memberSteps.steps.${step}.title`)}
                    </h3>
                    <p
                      className='text-sm leading-relaxed'
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {t(`memberSteps.steps.${step}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard preview card */}
          <div className='flex justify-center lg:justify-end'>
            <div
              className='w-full max-w-md aspect-4/3 rounded-2xl flex flex-col items-center justify-center gap-4'
              style={{
                backgroundColor: 'var(--color-bg-main)',
                boxShadow: 'var(--shadow-card)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              <DashboardIcon
                sx={{ fontSize: 80, color: 'var(--color-primary-light)' }}
              />
              <p
                className='text-base font-medium'
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('memberSteps.dashboard_preview')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MemberSteps
