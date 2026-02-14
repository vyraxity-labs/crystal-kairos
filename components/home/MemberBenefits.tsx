'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { cardConfig } from './data'

const MemberBenefits = () => {
  const { t } = useTranslation('home')

  return (
    <section
      className='px-6 py-16 md:py-24'
      style={{ backgroundColor: 'var(--color-bg-main)' }}
    >
      <div className='max-w-6xl mx-auto'>
        {/* Section header */}
        <div className='text-center mb-12'>
          <h2
            className='text-display mb-3'
            style={{ color: 'var(--color-text-primary)' }}
          >
            {t('memberBenefits.heading')}
          </h2>
          <div
            className='w-16 h-1 rounded-full mx-auto'
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
        </div>

        {/* Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
          {cardConfig.map(({ key, icon: Icon, iconBg, iconColor, href }) => (
            <article
              key={key}
              className='flex flex-col p-6 rounded-xl'
              style={{
                backgroundColor: 'var(--color-bg-paper)',
                boxShadow: 'var(--shadow-card)',
                borderRadius: 'var(--radius-card)',
              }}
            >
              {/* Icon */}
              <div
                className='w-12 h-12 rounded-lg flex items-center justify-center mb-4'
                style={{ backgroundColor: iconBg }}
              >
                <Icon sx={{ fontSize: 24, color: iconColor }} />
              </div>

              {/* Title */}
              <h3
                className='text-card-title mb-3'
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t(`memberBenefits.cards.${key}.title`)}
              </h3>

              {/* Description */}
              <p
                className='flex-1 text-sm leading-relaxed mb-4'
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t(`memberBenefits.cards.${key}.description`)}
              </p>

              {/* CTA link */}
              <Link
                href={href}
                className='inline-flex items-center gap-1 text-sm font-semibold hover:underline'
                style={{ color: 'var(--color-primary)' }}
              >
                {t(`memberBenefits.cards.${key}.cta`)}
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MemberBenefits
