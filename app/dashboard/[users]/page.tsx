import { auth } from '@/auth'
import ActivitySummary from '@/components/members/ActivitySummary'
import DashboardCTALink from '@/components/members/DashboardCTALink'
import MemberDashboardHero from '@/components/members/MemberDashboardHero'
import MemberInfoCard from '@/components/members/MemberInfoCard'
import { LoanStatus } from '@/generated/prisma/enums'
import {
  getEAjoRecordsCount,
  getLoanRecords,
  getSavingsRecords,
} from '@/models/members/query'
import { Wallet } from 'lucide-react'

const UserPage = async () => {
  const session = await auth()

  if (!session) {
    return <div>You are not authorized</div>
  }

  const userId = session.user.id

  const [savingsResult, eAjoCountResult, overdueLoansResult] =
    await Promise.all([
      getSavingsRecords(userId),
      getEAjoRecordsCount(userId),
      getLoanRecords(userId, { status: LoanStatus.OVERDUE }),
    ])

  const savings = savingsResult.data
  const eAjoCount = eAjoCountResult.data
  const overdueLoans = overdueLoansResult.data

  const savingsAmount = savings.reduce((acc, curr) => {
    acc += Number(curr.totalDeposited ?? 0)
    return acc
  }, 0)

  const overDueLoansSum = overdueLoans.reduce((acc, curr) => {
    acc += Number(curr.approvedAmount ?? 0)
    return acc
  }, 0)

  const summaryRecord = {
    savings: savingsAmount,
    loan: overDueLoansSum,
    eAjo: eAjoCount,
  }

  return (
    <div className='flex flex-col gap-4'>
      <MemberDashboardHero userId={userId} />
      <div>
        <ActivitySummary userId={userId} summaryRecord={summaryRecord} />
      </div>
    </div>
  )
}

export default UserPage
