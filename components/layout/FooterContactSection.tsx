import Link from 'next/link'
import { ComponentType, SVGProps } from 'react'

const FooterContactSection = ({
  Icon,
  label,
  href,
}: {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  href: string
}) => {
  return (
    <article className='flex gap-2 items-center text-muted-foreground'>
      <Icon />
      <Link href={href} className='hover:underline text-sm'>
        {label}
      </Link>
    </article>
  )
}

export default FooterContactSection
