'use client'

import { useTranslation } from 'react-i18next'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'

interface Data {
  label: string
  href?: string
}

const BreadCrumb = ({ data }: { data: Data[] }) => {
  const { t } = useTranslation('admin-members')

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {data.map((item, index) => {
          const isLast = data.length - 1 === index
          return (
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>
                  {t(item.label)}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{t(item.label)}</BreadcrumbPage>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadCrumb
