'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  PlayCircle,
  Users,
  Wallet,
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  Star,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

const STATS = [
  { label: 'Active Members', value: '12,400+', icon: Users },
  { label: 'Total Savings Managed', value: '₦2.8B+', icon: TrendingUp },
  { label: 'Avg. Payout per Cycle', value: '₦850K', icon: BadgeCheck },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Users,
    title: 'Join a Group',
    body: 'Select a verified Ajo circle that matches your financial capacity or start your own private group with trusted peers.',
    accent: 'bg-[#EAF1FB]',
  },
  {
    step: '02',
    icon: Wallet,
    title: 'Save Consistently',
    body: 'Make your scheduled contributions securely through our platform. Automated reminders ensure no one misses a payment.',
    accent: 'bg-[#F1F3F5]',
  },
  {
    step: '03',
    icon: BadgeCheck,
    title: 'Collect Payout',
    body: "Receive the lump sum directly into your linked bank account when it's your turn in the rotation. Guaranteed and secure.",
    accent: 'bg-[#FFF8E6]',
  },
]

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    body: 'All funds are protected with end-to-end encryption and are verified by our admin team before any ledger entry is made.',
  },
  {
    icon: BadgeCheck,
    title: 'Fully Transparent',
    body: 'Every contribution and payout is logged immutably on our ledger. Members can audit every transaction at any time.',
  },
  {
    icon: TrendingUp,
    title: 'Multiple Savings Products',
    body: 'Choose from fixed-term, regular, or staggered savings plans. Apply for personal or cooperative loans backed by your savings history.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Amaka Okafor',
    role: 'Small Business Owner, Lagos',
    body: 'Crystal Kairos transformed how I save. I received my ₦1.2M payout in record time — completely transparent and stress-free.',
    initials: 'AO',
  },
  {
    name: 'Chukwuemeka Nwosu',
    role: 'Civil Servant, Abuja',
    body: "The automated reminders and real-time tracking gave me peace of mind. I'm now in my third Ajo cycle with the same group.",
    initials: 'CN',
  },
  {
    name: 'Fatima Bello',
    role: 'Teacher, Kano',
    body: 'Applying for a cooperative loan was seamless. The guarantor process was clear and the approval came within 48 hours.',
    initials: 'FB',
  },
]

export const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='flex flex-col min-h-screen antialiased'>
      {/* ─── TOP NAV ───────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 w-full h-16 z-50 transition-all duration-300 flex items-center px-6 md:px-10 justify-between
          ${isScrolled ? 'bg-white border-b border-outline-variant shadow-sm' : 'bg-transparent'}`}
      >
        <span className='font-heading font-bold text-xl text-primary tracking-tight'>
          Crystal Kairos
        </span>
        <div className='flex items-center gap-3'>
          <Link
            href='/login'
            className='hidden md:block text-sm font-semibold text-primary hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors'
          >
            Log In
          </Link>
          <Link href='/register'>
            <Button className='bg-primary text-on-primary hover:bg-primary-container text-sm font-bold px-5 py-2 h-9 rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer'>
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* ─── HERO SECTION ──────────────────────────────── */}
      <section className='relative pt-28 pb-24 px-6 md:px-10 bg-white overflow-hidden'>
        {/* Subtle gradient backdrop */}
        <div className='absolute inset-0 bg-linear-to-br from-[#F5F7FA] to-white pointer-events-none' />
        {/* Decorative blob */}
        <div className='absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#EAF1FB] opacity-40 blur-3xl pointer-events-none' />

        <div className='relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
          {/* Left — copy */}
          <div className='flex flex-col gap-6 z-10'>
            {/* Trust badge */}
            <div className='inline-flex items-center gap-2 bg-[#EAF1FB] text-primary border border-primary/10 px-3 py-1.5 rounded-full text-xs font-bold w-fit'>
              <ShieldCheck className='w-3.5 h-3.5' />
              <span>Trusted by 12,400+ cooperative members</span>
            </div>

            <h1 className='text-4xl md:text-5xl font-bold font-heading text-primary leading-tight tracking-tight'>
              Modernize Your <br className='hidden md:block' />
              <span className='text-secondary'>Cooperative Savings.</span>{' '}
              <br className='hidden md:block' />
              Securely.
            </h1>

            <p className='text-base text-muted-foreground max-w-lg leading-relaxed'>
              Crystal Kairos brings the traditional Ajo/Esusu into the digital
              age. Transparent, auditable, and built for community trust. Join
              thousands securing their financial future together.
            </p>

            <div className='flex flex-col sm:flex-row gap-3 mt-2'>
              <Link href='/register'>
                <Button className='bg-primary text-on-primary hover:bg-primary-container text-sm font-bold px-8 py-4 h-12 rounded-lg shadow-md active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto'>
                  Start Saving Today
                  <ArrowRight className='w-4 h-4' />
                </Button>
              </Link>
              <Button
                variant='outline'
                className='border border-outline text-primary hover:bg-surface-container-low text-sm font-bold px-8 py-4 h-12 rounded-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all'
              >
                <PlayCircle className='w-4 h-4' />
                See How It Works
              </Button>
            </div>
          </div>

          {/* Right — hero image */}
          <div className='relative h-[350px] md:h-[460px] w-full rounded-2xl overflow-hidden shadow-xl z-10'>
            <Image
              src='/cooperative_hero.png'
              alt='Crystal Kairos Digital Cooperative Platform'
              fill
              className='object-cover'
              priority
            />
            {/* Floating payout card */}
            <div
              className='absolute bottom-5 left-5 bg-white rounded-xl shadow-lg border border-outline-variant/30 flex items-center gap-3 px-4 py-3'
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              <div className='w-10 h-10 rounded-full bg-[#FFF8E6] flex items-center justify-center text-[#C99A2E] shrink-0'>
                <BadgeCheck className='w-5 h-5' />
              </div>
              <div>
                <p className='text-[10px] text-muted-foreground font-semibold uppercase tracking-wider'>
                  Payout Received
                </p>
                <p className='text-base font-bold text-primary font-mono'>
                  ₦500,000.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─────────────────────────────────── */}
      <section className='bg-primary py-10 px-6 md:px-10'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8'>
          {STATS.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className='flex flex-col items-center gap-1 text-center'
            >
              <Icon className='w-6 h-6 text-on-primary opacity-60 mb-1' />
              <span className='text-3xl font-bold font-mono text-on-primary'>
                {value}
              </span>
              <span className='text-xs font-semibold text-on-primary opacity-60 uppercase tracking-wider'>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────── */}
      <section className='py-24 px-6 md:px-10 bg-[#F5F7FA]'>
        <div className='max-w-6xl mx-auto flex flex-col items-center'>
          <p className='text-xs font-bold text-secondary uppercase tracking-widest mb-3'>
            Simple Process
          </p>
          <h2 className='text-3xl md:text-4xl font-bold font-heading text-primary text-center mb-4'>
            Transparent Savings, Three Steps Away
          </h2>
          <p className='text-base text-muted-foreground text-center max-w-2xl mb-14'>
            Our platform simplifies group savings while maintaining the robust
            security of a modern financial institution.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, body, accent }) => (
              <div
                key={step}
                className='bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/20 flex flex-col items-start gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300'
              >
                {/* Accent blob */}
                <div
                  className={`absolute top-0 right-0 w-24 h-24 ${accent} rounded-bl-full -mr-4 -mt-4 opacity-60 transition-transform group-hover:scale-125 duration-300`}
                />
                {/* Step number */}
                <span className='text-[11px] font-bold text-muted-foreground font-mono z-10'>
                  {step}
                </span>
                <div className='w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary z-10'>
                  <Icon className='w-7 h-7' />
                </div>
                <h3 className='text-base font-bold text-primary font-heading z-10'>
                  {title}
                </h3>
                <p className='text-sm text-muted-foreground leading-relaxed z-10'>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────── */}
      <section className='py-24 px-6 md:px-10 bg-white'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='flex flex-col gap-5'>
              <p className='text-xs font-bold text-secondary uppercase tracking-widest'>
                Why Crystal Kairos
              </p>
              <h2 className='text-3xl md:text-4xl font-bold font-heading text-primary leading-tight'>
                Built for trust. <br />
                Designed for growth.
              </h2>
              <p className='text-base text-muted-foreground max-w-md leading-relaxed'>
                We digitize the century-old cooperative savings model with the
                transparency and security your community deserves.
              </p>
              <Link href='/register' className='mt-2 w-fit'>
                <Button className='bg-primary text-on-primary hover:bg-primary-container text-sm font-bold px-6 py-2 h-10 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer'>
                  Join the Community
                  <ArrowRight className='w-4 h-4' />
                </Button>
              </Link>
            </div>
            <div className='flex flex-col gap-4'>
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className='flex items-start gap-4 p-5 rounded-xl bg-[#F5F7FA] border border-outline-variant/15 hover:border-primary/20 transition-colors'
                >
                  <div className='w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shrink-0'>
                    <Icon className='w-5 h-5' />
                  </div>
                  <div>
                    <h4 className='text-sm font-bold text-primary mb-1'>
                      {title}
                    </h4>
                    <p className='text-xs text-muted-foreground leading-relaxed'>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────── */}
      <section className='py-24 px-6 md:px-10 bg-[#F5F7FA]'>
        <div className='max-w-6xl mx-auto flex flex-col items-center'>
          <p className='text-xs font-bold text-secondary uppercase tracking-widest mb-3'>
            Member Stories
          </p>
          <h2 className='text-3xl md:text-4xl font-bold font-heading text-primary text-center mb-4'>
            Trusted by Thousands Across Nigeria
          </h2>
          <p className='text-base text-muted-foreground text-center max-w-xl mb-14'>
            Real members, real results. See how Crystal Kairos is changing
            cooperative savings.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
            {TESTIMONIALS.map(({ name, role, body, initials }) => (
              <div
                key={name}
                className='bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-4'
              >
                <div className='flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 fill-[#C99A2E] text-[#C99A2E]'
                    />
                  ))}
                </div>
                <p className='text-sm text-muted-foreground leading-relaxed flex-1'>
                  "{body}"
                </p>
                <div className='flex items-center gap-3 pt-3 border-t border-outline-variant/15'>
                  <div className='w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold shrink-0'>
                    {initials}
                  </div>
                  <div>
                    <p className='text-xs font-bold text-primary'>{name}</p>
                    <p className='text-[10px] text-muted-foreground'>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────── */}
      <section className='py-24 px-6 md:px-10 bg-primary relative overflow-hidden'>
        {/* Decorative blobs */}
        <div className='absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white opacity-5 pointer-events-none' />
        <div className='absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white opacity-5 pointer-events-none' />

        <div className='max-w-4xl mx-auto flex flex-col items-center gap-6 text-center relative'>
          <h2 className='text-3xl md:text-4xl font-bold font-heading text-on-primary leading-tight'>
            Ready to start your cooperative journey?
          </h2>
          <p className='text-base text-on-primary/70 max-w-lg leading-relaxed'>
            Join Crystal Kairos today and experience the power of community
            savings backed by modern technology.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 mt-2'>
            <Link href='/register'>
              <Button className='bg-white text-primary hover:bg-surface-container-low text-sm font-bold px-8 py-4 h-12 rounded-lg shadow-md flex items-center gap-2 cursor-pointer active:scale-[0.98] transition-all'>
                Create Free Account
                <ArrowRight className='w-4 h-4' />
              </Button>
            </Link>
            <Link href='/login'>
              <Button
                variant='outline'
                className='border border-on-primary/30 bg-transparent text-on-primary hover:bg-white/10 text-sm font-bold px-8 py-4 h-12 rounded-lg flex items-center gap-2 cursor-pointer active:scale-[0.98] transition-all'
              >
                Sign In Instead
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────── */}
      <footer className='bg-primary text-on-primary py-14 px-6 md:px-10'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='col-span-1 md:col-span-2 flex flex-col gap-4'>
            <span className='font-heading font-bold text-xl text-on-primary tracking-tight'>
              Crystal Kairos
            </span>
            <p className='text-sm text-on-primary/70 max-w-sm leading-relaxed'>
              Empowering communities through secure, transparent, and digital
              cooperative savings. Building financial resilience together.
            </p>
          </div>
          <div className='flex flex-col gap-3'>
            <h4 className='text-sm font-bold text-on-primary'>Product</h4>
            <span className='text-sm text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer'>
              Ajo Circles
            </span>
            <span className='text-sm text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer'>
              Target Savings
            </span>
            <span className='text-sm text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer'>
              Cooperative Loans
            </span>
          </div>
          <div className='flex flex-col gap-3'>
            <h4 className='text-sm font-bold text-on-primary'>Legal</h4>
            <span className='text-sm text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer'>
              Privacy Policy
            </span>
            <span className='text-sm text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer'>
              Terms of Service
            </span>
            <span className='text-sm text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer'>
              Security
            </span>
          </div>
        </div>
        <div className='max-w-6xl mx-auto mt-12 pt-6 border-t border-on-primary/20 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-xs text-on-primary/50'>
            © {new Date().getFullYear()} Crystal Kairos. All rights reserved.
          </p>
          <div className='flex items-center gap-1.5 text-xs text-on-primary/50'>
            <ShieldCheck className='w-3.5 h-3.5' />
            <span>Secured & Encrypted</span>
          </div>
        </div>
      </footer>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
