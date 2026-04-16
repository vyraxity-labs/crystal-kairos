'use client'

import { useTranslation } from 'react-i18next'

const TranslatedContent = ({ label, ns }: { label: string; ns: string }) => {
  const { t } = useTranslation(ns)

  return <span>{t(label)}</span>
}

export default TranslatedContent
