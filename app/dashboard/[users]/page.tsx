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

  const savings = (await getSavingsRecords(userId)).data
  const eAjoCount = (await getEAjoRecordsCount(userId)).data
  const overdueLoans = (
    await getLoanRecords(userId, { status: LoanStatus.OVERDUE })
  ).data

  const savingsAmount = savings.reduce((acc, curr) => {
    acc += Number(curr.totalDeposited)

    return acc
  }, 0)

  const overDueLoansSum = overdueLoans.reduce((acc, curr) => {
    acc += Number(curr.approvedAmount)

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
