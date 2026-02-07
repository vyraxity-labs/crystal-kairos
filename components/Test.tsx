'use client'

import { useTranslation } from 'react-i18next'

const Test = () => {
  const { t } = useTranslation('common')

  return (
    <div>
      {t('test')} and {t('sample.test')}
    </div>
  )
}

export default Test
