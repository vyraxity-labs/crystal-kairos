import Image from 'next/image'
import logo from '@/public/crv-logo.png'

export const AuthShowcase = () => {
  return (
    <div className='hidden md:flex relative flex-col justify-between overflow-hidden bg-primary px-10 py-12'>
      {/* Dynamic Gradient Background */}
      <div className='absolute inset-0 bg-linear-to-br from-primary via-primary-container to-slate-900 z-0' />

      {/* Decorative SVG Pattern */}
      <div className='absolute inset-0 opacity-10 pointer-events-none z-0'>
        <svg
          className='w-full h-full'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
        >
          <defs>
            <pattern
              id='grid-pattern'
              width='40'
              height='40'
              patternUnits='userSpaceOnUse'
            >
              <path
                d='M 40 0 L 0 0 0 40'
                fill='none'
                stroke='currentColor'
                strokeWidth='1'
                strokeDasharray='4 4'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid-pattern)' />

          <circle
            cx='80%'
            cy='20%'
            r='200'
            fill='currentColor'
            className='opacity-20 blur-3xl'
          />
          <circle
            cx='20%'
            cy='80%'
            r='300'
            fill='currentColor'
            className='opacity-10 blur-3xl'
          />
        </svg>
      </div>

      {/* Top Section - Logo */}
      <div className='relative z-10 flex items-center gap-3'>
        <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-2'>
          <Image
            src={logo}
            alt='Crystal Kairos Logo'
            width={32}
            height={32}
            className='object-contain'
            priority
          />
        </div>
        <span className='text-white font-heading font-bold text-2xl tracking-tight'>
          Crystal Kairos
        </span>
      </div>

      {/* Bottom Section - Glassmorphism Card */}
      <div className='relative z-10 w-full max-w-lg mb-10'>
        <div className='bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl'>
          <h2 className='text-white font-heading text-3xl md:text-4xl font-bold leading-tight mb-4'>
            Empowering Your Financial Future
          </h2>
          <p className='text-blue-100 text-lg leading-relaxed'>
            Join our cooperative platform to access seamless savings, structured
            eAjo pools, and reliable loan facilities designed for your growth.
          </p>

          <div className='flex items-center gap-4 mt-8'>
            <div className='flex -space-x-3'>
              <div className='w-10 h-10 rounded-full border-2 border-primary-container bg-blue-400 flex items-center justify-center text-xs font-bold text-white'>
                JD
              </div>
              <div className='w-10 h-10 rounded-full border-2 border-primary-container bg-emerald-400 flex items-center justify-center text-xs font-bold text-white'>
                SM
              </div>
              <div className='w-10 h-10 rounded-full border-2 border-primary-container bg-orange-400 flex items-center justify-center text-xs font-bold text-white'>
                OA
              </div>
            </div>
            <p className='text-sm text-blue-200 font-medium'>
              Join <span className='text-white font-bold'>2,500+</span> active
              members
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
