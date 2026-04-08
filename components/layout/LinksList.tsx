'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const LinksList = ({
  data,
  heading,
}: {
  data: {
    id: string
    label: string
    href: string
  }[]
  heading: string
}) => {
  const { t } = useTranslation('common')

  return (
    <>
      <h6 className='font-semibold'>{t(heading)}</h6>
      <section className='flex flex-col mt-3 gap-3 text-muted-foreground'>
        {data.map((item) => {
          return (
            <Link
              href={item.href}
              key={item.id}
              className='text-sm hover:text-primary'
              target='_blank'
            >
              {t(item.label)}
            </Link>
          )
        })}
      </section>
    </>
  )
}

export default LinksList
