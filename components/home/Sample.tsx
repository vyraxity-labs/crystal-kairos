'use client'

import { useTranslation } from 'react-i18next'

const Sample = () => {
  const { t } = useTranslation('common')

  return (
    <div>
      <h1>{t('home')}</h1>
      <p>{t('text')}</p>
    </div>
  )
}

export default Sample
