import { useEffect, useState } from 'react'

const useDesignToken = (variable: string) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim()
    setValue(`hsl(${raw})`)
  }, [variable])

  return value
}

export default useDesignToken
