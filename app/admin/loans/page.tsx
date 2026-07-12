import { getAllLoansQuery } from '@/models/admin/query'
import { AdminLoansClient } from '@/components/admin/AdminLoansClient'

export const metadata = {
  title: 'Loan Management | Admin Dashboard',
}

export default async function AdminLoansPage() {
  const result = await getAllLoansQuery()

  if (!result.success || !result.data) {
    return (
      <div className="p-6 text-red-500">
        Failed to load loans: {result.error}
      </div>
    )
  }

  return <AdminLoansClient loans={result.data as any} />
}
