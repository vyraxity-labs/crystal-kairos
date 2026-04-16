import { useTranslation } from 'react-i18next'

const useTranslated = (ns: string) => {
  const { t } = useTranslation(ns)

  const translate = (key: string) => {
    return t(key)
  }

  return { translate }
}

export default useTranslated
