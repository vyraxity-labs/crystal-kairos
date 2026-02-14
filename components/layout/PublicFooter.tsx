'use client'

import { IconButton, SvgIconProps, Typography } from '@mui/material'
import Logo from '../common/Logo'
import { useTranslation } from 'react-i18next'
import { quickLinks, socials, support } from './data'
import Link from 'next/link'
import HttpsIcon from '@mui/icons-material/Https'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'

const PublicFooter = () => {
  const { t } = useTranslation('common')

  return (
    <div className='border-t border-border'>
      <div className='w-[90%] max-w-300 mx-auto py-5'>
        <div
          className='flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-4 pb-5
        '
        >
          <div className='flex flex-col items-start'>
            <Logo />
            <Typography variant='body2' sx={{ marginTop: 2 }}>
              {t('footer.app_slogan')}
            </Typography>
            <article className='mt-3'>
              {socials.map((social) => {
                return (
                  <Link href={social.href} key={social.id} target='_blank'>
                    <IconButton color='primary'>
                      <social.Icon />
                    </IconButton>
                  </Link>
                )
              })}
            </article>
          </div>

          <div>
            <LinksList data={quickLinks} heading='footer.quick_links.heading' />
          </div>

          <div>
            <LinksList data={support} heading='footer.support.heading' />
          </div>

          <div>
            <Typography variant='h6'>
              {t('footer.contact_us.heading')}
            </Typography>

            <section className='mt-3 flex flex-col gap-3'>
              <Contact
                Icon={EmailOutlinedIcon}
                label='email@example.com'
                href='mailto:email@example.com'
              />
              <Contact
                Icon={LocalPhoneOutlinedIcon}
                label='+23408123456789'
                href='tel:23408123456789'
              />
              <Contact
                Icon={LocationOnOutlinedIcon}
                label='123, Financial Avenue, Victoria Island, Lagos'
                href='https://www.google.com/maps/search/123,+financial+avenue,+victoria+island+lagos/@6.6834172,3.3559375,11z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D'
              />
            </section>
          </div>
        </div>

        <div className='border-t border-border/70 flex flex-col gap-4 justify-center items-center md:flex-row md:justify-between pt-5'>
          <Typography variant='body2' sx={{ textAlign: 'center' }}>
            &copy; {t('footer.copyright', { year: new Date().getFullYear() })}
          </Typography>

          <article className='flex gap-3 items-center'>
            <HttpsIcon fontSize='small' />
            <Typography variant='body2'>{t('footer.secure')}</Typography>
          </article>
        </div>
      </div>
    </div>
  )
}

export default PublicFooter

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
      <Typography variant='h6'>{t(heading)}</Typography>
      <section className='flex flex-col mt-3 gap-3'>
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

const Contact = ({
  Icon,
  label,
  href,
}: {
  Icon: React.ComponentType<SvgIconProps>
  label: string
  href: string
}) => {
  return (
    <article className='flex gap-2 items-center'>
      <Icon fontSize='small' color='primary' />
      <Link href={href} className='text-primary hover:underline text-sm'>
        {label}
      </Link>
    </article>
  )
}
