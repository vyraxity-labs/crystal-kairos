import { ReactNode } from 'react'

export const ShieldIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    viewBox='0 0 24 24'
  >
    <g fill='none'>
      <path
        fill='#e3e3e3'
        d='M21.584 1.508a.91.91 0 0 1 .912.913l-.007 6.906a13.41 13.41 0 0 1-10.432 13.164A13.41 13.41 0 0 1 1.504 9.424l.012-6.999a.91.91 0 0 1 .912-.913z'
      ></path>
      <path
        fill='#fff'
        d='M12.005 1.508h-9.58a.91.91 0 0 0-.908.913l-.013 7.003a13.41 13.41 0 0 0 10.5 13.056z'
      ></path>
      <path
        stroke='#191919'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M21.584 1.508a.91.91 0 0 1 .912.913l-.007 6.906a13.41 13.41 0 0 1-10.432 13.164A13.41 13.41 0 0 1 1.504 9.424l.012-6.999a.91.91 0 0 1 .912-.913z'
        strokeWidth={1}
      ></path>
      <path
        fill='#ffef5e'
        d='M16.125 14.262a.91.91 0 0 1-.913.917l-6.386.028a.91.91 0 0 1-.913-.907L7.89 8.94a.91.91 0 0 1 .91-.91l6.386-.028a.91.91 0 0 1 .912.907z'
      ></path>
      <path
        fill='#fff9bf'
        d='m12.005 8.01l-3.208.014a.91.91 0 0 0-.912.913l.025 5.358a.91.91 0 0 0 .912.908l3.183-.01z'
      ></path>
      <path
        stroke='#191919'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M16.125 14.262a.91.91 0 0 1-.913.917l-6.386.028a.91.91 0 0 1-.913-.907L7.89 8.94a.91.91 0 0 1 .91-.91l6.386-.028a.91.91 0 0 1 .912.907zM11.973 4.245a2.737 2.737 0 0 0-2.723 2.75v1.027l5.473-.024V6.97a2.74 2.74 0 0 0-2.75-2.725'
        strokeWidth={1}
      ></path>
      <path
        fill='#808080'
        stroke='#191919'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12.007 12.743a1.141 1.141 0 1 0 0-2.283a1.141 1.141 0 0 0 0 2.282'
        strokeWidth={1}
      ></path>
    </g>
  </svg>
)

export const BankIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    viewBox='0 0 24 24'
  >
    <g fill='none'>
      <path
        fill='#e3e3e3'
        d='M2.096 8.82a.45.45 0 0 0 .019.739c.08.055.177.084.275.083h19.226a.48.48 0 0 0 .453-.309a.45.45 0 0 0-.158-.511l-9.587-7.223a.5.5 0 0 0-.59 0z'
      ></path>
      <path
        fill='#fff'
        d='M12 6.04a20.1 20.1 0 0 1 8.574 1.776L12.321 1.6a.5.5 0 0 0-.589 0L3.45 7.807A20.15 20.15 0 0 1 12 6.04'
      ></path>
      <path fill='#808080' d='M23 20.661H1v1.837h22z'></path>
      <path
        stroke='#191919'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M1.956 18.825H6.74M1 22.498h22M1 20.661h22M1.956 11.479H6.74m2.869 7.346h4.783m-4.783-7.346h4.783'
        strokeWidth={1}
      ></path>
      <path
        fill='#e3e3e3'
        stroke='#191919'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M5.782 11.479v7.346h-2.87v-7.346zm7.653 0v7.346h-2.87v-7.346z'
        strokeWidth={1}
      ></path>
      <path
        stroke='#191919'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17.26 18.825h4.783m-4.783-7.346h4.783'
        strokeWidth={1}
      ></path>
      <path
        fill='#e3e3e3'
        stroke='#191919'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M21.087 11.479v7.346h-2.87v-7.346z'
        strokeWidth={1}
      ></path>
      <path
        stroke='#191919'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M2.096 8.82a.45.45 0 0 0 .019.739c.08.055.177.084.275.083h19.226a.48.48 0 0 0 .453-.309a.45.45 0 0 0-.158-.511l-9.587-7.223a.5.5 0 0 0-.59 0z'
        strokeWidth={1}
      ></path>
    </g>
  </svg>
)

export const LoginFoot = ({
  Icon,
  label,
}: {
  Icon: ReactNode
  label: string
}) => (
  <div className='flex flex-col gap-2 justify-center items-center w-fit'>
    {Icon}
    <p className='text-muted-foreground uppercase text-xs'>{label}</p>
  </div>
)
