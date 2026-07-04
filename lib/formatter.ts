export const formatCurrency = (
  amount: number,
  options?: {
    currency?: string
    locale?: string
    showSymbol?: boolean
  },
): string => {
  const {
    currency = 'NGN',
    locale = 'en-NG',
    showSymbol = true,
  } = options ?? {}

  return new Intl.NumberFormat(locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
