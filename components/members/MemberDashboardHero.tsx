'use client'

import { CircleDollarSign, Wallet } from 'lucide-react'
import DashboardCTALink from './DashboardCTALink'
import MemberInfoCard from './MemberInfoCard'

const MemberDashboardHero = ({ userId }: { userId: string }) => {
  return (
    <div className='flex flex-col gap-4 lg:grid lg:grid-cols-[2fr_1fr]'>
      <MemberInfoCard userId={userId} />
      <div className='flex flex-col sm:flex-row lg:grid lg:grid-rows-2 gap-4'>
        <DashboardCTALink
          Icon={Wallet}
          label='main_card.links.savings.title'
          description='main_card.links.savings.description'
          href={`/dashboard/${userId}/savings/new`}
          variant='blue'
        />
        <DashboardCTALink
          Icon={CircleDollarSign}
          label='main_card.links.loans.title'
          description='main_card.links.loans.description'
          href={`/dashboard/${userId}/loans/new`}
        />
      </div>
    </div>
  )
}

export default MemberDashboardHero
