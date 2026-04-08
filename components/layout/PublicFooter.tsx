'use client'

import Link from 'next/link'
import Logo from '../common/Logo'
import { mapLink, quickLinks, socials, support } from './data'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import LinksList from './LinksList'
import FooterContactSection from './FooterContactSection'
import { Mail, Phone, MapPin, LockKeyhole } from 'lucide-react'

const PublicFooter = () => {
  const { t } = useTranslation('common')

  return (
    <div className='border-t'>
      <div className='w-[90%] max-w-300 mx-auto py-5'>
        <div
          className='flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-4 pb-5
        '
        >
          <div className='flex flex-col items-start'>
            <Logo />
            <p className='mt-2 text-muted-foreground'>
              {t('footer.app_slogan')}
            </p>
            <article className='mt-3'>
              {socials.map((social) => {
                return (
                  <Link href={social.href} key={social.id} target='_blank'>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='cursor-pointer'
                    >
                      <social.Icon />
                    </Button>
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
            <h6 className='font-semibold'>{t('footer.contact_us.heading')}</h6>
            <section className='mt-3 flex flex-col gap-3'>
              <FooterContactSection
                Icon={Mail}
                label={t('footer.contact_us.email_content')}
                href={`mailto:${t('footer.contact_us.email_content')}`}
              />
              <FooterContactSection
                Icon={Phone}
                label={t('footer.contact_us.phone_content')}
                href={`tel:${t('footer.contact_us.phone_content')}`}
              />
              <FooterContactSection
                Icon={MapPin}
                label={t('footer.contact_us.address_content')}
                href={mapLink}
              />
            </section>
          </div>
        </div>

        <div className='border-t border-outline-variant text-muted-foreground flex flex-col gap-4 justify-center items-center md:flex-row md:justify-between pt-5'>
          <p className='text-center'>
            &copy; {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>

          <article className='flex gap-3 items-center'>
            <LockKeyhole fontSize='small' />
            <p>{t('footer.secure')}</p>
          </article>
        </div>
      </div>
    </div>
  )
}

export default PublicFooter
