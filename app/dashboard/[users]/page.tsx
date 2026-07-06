import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import MemberDashboardHero from '@/components/members/MemberDashboardHero'
import { WalletLedgerSummary } from '@/components/members/WalletLedgerSummary'
import { TransactionHistoryList } from '@/components/members/TransactionHistoryList'
import { getUserLedgerBalances, getUserTransactions } from '@/models/transactions/actions'
import { ShieldAlert } from 'lucide-react'

interface PageProps {
  params: Promise<{ users: string }>
}

const UserPage = async ({ params }: PageProps) => {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const profileId = (await params).users
  const isSelf = session.user.id === profileId
  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'OWNER'

  // Access Control: Only self or admin/owner can view the user dashboard
  if (!isSelf && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <ShieldAlert className="w-12 h-12 text-error" />
        <h3 className="font-bold text-lg text-primary">Access Denied</h3>
        <p className="text-muted-foreground text-sm max-w-sm text-center">
          You do not have permission to access this member dashboard.
        </p>
      </div>
    )
  }

  // Fetch ledger balance data and transaction list concurrently
  const [balancesResult, transactionsResult] = await Promise.all([
    getUserLedgerBalances(profileId),
    getUserTransactions(profileId),
  ])

  const defaultBalances = {
    generalWalletBalance: 0,
    subLedgers: {
      ajo: { totalContributed: 0 },
      savings: { totalDeposited: 0, totalWithdrawn: 0, currentSavingsBalance: 0 },
      loans: { totalBorrowed: 0, totalRepaid: 0, outstandingDebt: 0 },
    },
  }

  const balances = balancesResult.success && balancesResult.data ? balancesResult.data : defaultBalances
  const transactions = transactionsResult.success && transactionsResult.data ? transactionsResult.data : []

  return (
    <div className="w-[95%] sm:w-[90%] mx-auto py-6 flex flex-col gap-6 max-w-5xl">
      {/* 1. Header Hero Panel */}
      <MemberDashboardHero userId={profileId} />

      {/* 2. Wallet & Product Sub-Ledger Balances Summary */}
      <WalletLedgerSummary balances={balances} />

      {/* 3. Transaction History Ledger Table */}
      <TransactionHistoryList transactions={transactions} />
    </div>
  )
}

export default UserPage
