'use client'

import React, { useState } from 'react'
import {
  Coins,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Activity,
  Calendar,
  DollarSign,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Handshake,
  PiggyBank,
  ArrowRight,
  Send,
  Building2,
  Lock,
} from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { transitionTransaction } from '@/models/transactions/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PendingDisbursement {
  id: string
  userId: string
  amount: number
  category: string
  type: string
  status: string
  eAjoId: string | null
  savingsId: string | null
  loanId: string | null
  receiptUrl: string | null
  rejectionReason: string | null
  referenceNumber: string | null
  notes: string | null
  bankAccountId: string | null
  recordedBy: string
  createdAt: Date
  user: {
    id: string
    name: string
    email: string
    membership: {
      membershipNumber: string | null
    } | null
  }
  bankAccount: {
    bankName: string
    accountNumber: string
    accountName: string
  } | null
}

interface DisbursementsQueueClientProps {
  disbursements: PendingDisbursement[]
  adminId: string
}

export const DisbursementsQueueClient = ({
  disbursements: initialDisbursements,
  adminId,
}: DisbursementsQueueClientProps) => {
  const router = useRouter()
  const [disbursements, setDisbursements] = useState<PendingDisbursement[]>(initialDisbursements)
  const [selectedDisbursement, setSelectedDisbursement] = useState<PendingDisbursement | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Dialog confirmation states
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(val)
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'SAVINGS_WITHDRAWAL':
        return 'Savings Withdrawal'
      case 'LOAN_DISBURSEMENT':
        return 'Loan Disbursement'
      case 'AJO_PAYOUT':
        return 'Ajo Payout'
      default:
        return category.replace('_', ' ')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SAVINGS_WITHDRAWAL':
        return <PiggyBank className="w-4 h-4 text-primary" />
      case 'LOAN_DISBURSEMENT':
        return <Coins className="w-4 h-4 text-tertiary-container" />
      case 'AJO_PAYOUT':
        return <Handshake className="w-4 h-4 text-success-green" />
      default:
        return <Activity className="w-4 h-4 text-slate-grey" />
    }
  }

  // Calculate due status based on creation date
  const getDueStatus = (createdAtDate: Date) => {
    const created = new Date(createdAtDate)
    const now = new Date()
    const diffTime = now.getTime() - created.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays >= 1) {
      return {
        label: `Overdue: ${diffDays} Day${diffDays > 1 ? 's' : ''}`,
        style: 'bg-error-container text-on-error-container border-error-red/20 text-error-red',
        icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" />,
        type: 'overdue',
      }
    } else if (diffDays === 0) {
      return {
        label: 'Due Today',
        style: 'bg-light-amber text-warning-amber border-warning-amber/20',
        icon: <Calendar className="w-3.5 h-3.5 shrink-0" />,
        type: 'due_today',
      }
    } else {
      return {
        label: created.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        style: 'bg-surface-container-high text-on-surface-variant',
        icon: <Calendar className="w-3.5 h-3.5 shrink-0" />,
        type: 'upcoming',
      }
    }
  }

  // Filters logic
  const filteredDisbursements = disbursements.filter((dx) => {
    const matchesSearch =
      dx.user.name.toLowerCase().includes(search.toLowerCase()) ||
      (dx.user.membership?.membershipNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      String(dx.amount).includes(search)

    const matchesCategory =
      !categoryFilter ||
      (categoryFilter === 'ajo' && dx.category === 'AJO_PAYOUT') ||
      (categoryFilter === 'savings' && dx.category === 'SAVINGS_WITHDRAWAL') ||
      (categoryFilter === 'loan' && dx.category === 'LOAN_DISBURSEMENT')

    const dueStatus = getDueStatus(dx.createdAt)
    const matchesStatus = !statusFilter || statusFilter === dueStatus.type

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Pagination bounds
  const totalPages = Math.ceil(filteredDisbursements.length / rowsPerPage)
  const paginatedDisbursements = filteredDisbursements.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handleDisburseClick = (dx: PendingDisbursement) => {
    setSelectedDisbursement(dx)
    setReferenceNumber('')
    setIsConfirmDialogOpen(true)
  }

  const handleDisburseConfirm = async () => {
    if (!selectedDisbursement) return
    if (!referenceNumber.trim()) {
      toast.error('Please enter the bank transfer reference number.')
      return
    }

    setActionLoading(true)
    const toastId = toast.loading('Confirming bank payout disbursement...')
    try {
      const result = await transitionTransaction(
        selectedDisbursement.id,
        'DISBURSE',
        adminId,
        undefined,
        referenceNumber
      )

      if (result.success) {
        toast.success('Disbursement confirmed and logged successfully!', { id: toastId })
        setIsConfirmDialogOpen(false)
        setSelectedDisbursement(null)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to disburse.', { id: toastId })
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong.', { id: toastId })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full py-2">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
        <Link href="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary font-bold">Disbursements</span>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold font-heading text-primary leading-tight flex items-center gap-3">
          <span>Disbursement Queue</span>
          <span className="bg-surface-container text-primary text-xs font-bold rounded-full px-3 py-1 font-mono">
            {filteredDisbursements.length}
          </span>
        </h1>
        <Button variant="outline" className="flex items-center gap-1.5 bg-surface-container-lowest border border-outline-variant text-primary hover:bg-surface-container-low transition-colors px-4 py-2 h-9 rounded-sm font-bold text-xs shadow-sm">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm rounded-lg p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search Member Name or ID..."
            className="pl-9 bg-surface-container-low border-none rounded-sm py-1.5 h-9 text-xs focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground/70"
          />
        </div>
        <div className="hidden md:block h-6 w-px bg-outline-variant/30" />
        <div className="w-full md:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-surface-container-low border-none rounded-sm py-2 px-3 text-xs focus:ring-1 focus:ring-primary outline-none cursor-pointer text-primary font-medium"
          >
            <option value="">All Transaction Types</option>
            <option value="ajo">Ajo Payout</option>
            <option value="savings">Savings Withdrawal</option>
            <option value="loan">Loan Disbursement</option>
          </select>
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-surface-container-low border-none rounded-sm py-2 px-3 text-xs focus:ring-1 focus:ring-primary outline-none cursor-pointer text-primary font-medium"
          >
            <option value="">All Statuses</option>
            <option value="overdue">Overdue</option>
            <option value="due_today">Due Today</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      {/* High Priority Data Table */}
      <Card className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-primary text-on-primary font-bold">
                <th className="p-3 font-normal opacity-90">Member</th>
                <th className="p-3 font-normal opacity-90">Transaction Type</th>
                <th className="p-3 font-normal opacity-90 text-right">Amount Due (₦)</th>
                <th className="p-3 font-normal opacity-90">Selected Bank Account</th>
                <th className="p-3 font-normal opacity-90">Date Due</th>
                <th className="p-3 font-normal opacity-90 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-primary bg-surface-container-lowest divide-y divide-outline-variant/15 font-medium">
              {paginatedDisbursements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground font-medium italic">
                    All disbursements verified and paid out. Queue is clean.
                  </td>
                </tr>
              ) : (
                paginatedDisbursements.map((dx) => {
                  const due = getDueStatus(dx.createdAt)
                  return (
                    <tr key={dx.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold text-[11px] shrink-0 border border-outline-variant/20">
                            {dx.user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-primary">{dx.user.name}</div>
                            <div className="text-[9px] text-muted-foreground font-normal">
                              ID: {dx.user.membership?.membershipNumber || 'PENDING'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-primary">
                          {getCategoryIcon(dx.category)}
                          <span>{getCategoryLabel(dx.category)}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-primary">
                        {dx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3">
                        {dx.bankAccount ? (
                          <div className="flex flex-col">
                            <span className="text-primary font-bold">{dx.bankAccount.bankName}</span>
                            <span className="text-muted-foreground text-[10px] font-mono">
                              **** {dx.bankAccount.accountNumber.slice(-4)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic font-normal">No account selected</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1 border ${due.style}`}>
                          {due.icon}
                          <span>{due.label}</span>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          onClick={() => handleDisburseClick(dx)}
                          className="bg-primary text-on-primary hover:bg-primary-container px-4 py-1.5 h-8 text-[10px] uppercase font-bold rounded-sm shadow-sm active:scale-95 transition-all cursor-pointer"
                        >
                          Disburse
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-surface-container-lowest border-t border-outline-variant/10 p-3 flex items-center justify-between font-bold text-[10px] text-muted-foreground">
            <div>
              Showing {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, filteredDisbursements.length)} of{' '}
              {filteredDisbursements.length} pending disbursements
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="h-7 w-7 rounded-sm hover:bg-surface-container-high transition-colors text-primary"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-2">Page {currentPage} of {totalPages}</span>
              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="h-7 w-7 rounded-sm hover:bg-surface-container-high transition-colors text-primary"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* DISBURSEMENT CONFIRMATION DIALOG MODAL */}
      {selectedDisbursement && (
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-primary font-heading font-bold text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-secondary" />
                <span>Verify Bank Transfer Details</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Please transfer the exact amount using your banking portal before recording the reference code here.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              {/* Bank Details Display */}
              <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/20 flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-semibold">Beneficiary Bank</span>
                  <span className="font-bold text-primary">{selectedDisbursement.bankAccount?.bankName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-semibold">Account Number</span>
                  <span className="font-bold text-primary font-mono">{selectedDisbursement.bankAccount?.accountNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-semibold">Beneficiary Name</span>
                  <span className="font-bold text-primary">{selectedDisbursement.bankAccount?.accountName || 'N/A'}</span>
                </div>
                <div className="my-1 border-t border-dashed border-outline-variant/30" />
                <div className="flex justify-between items-end">
                  <span className="text-xs text-muted-foreground font-semibold">Amount to Pay</span>
                  <span className="text-lg font-bold text-secondary font-mono">
                    {formatCurrency(selectedDisbursement.amount)}
                  </span>
                </div>
              </div>

              {/* Reference Input */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ref-code" className="text-xs font-bold text-primary">
                  Bank Transfer Reference / Transaction ID
                </Label>
                <Input
                  id="ref-code"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. TXN99827392817"
                  className="text-xs focus:ring-1 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="text-[10px] text-muted-foreground leading-normal font-medium mt-0.5">
                  Input the transfer receipt ID generated by your bank to reconcile this payout on the cooperative ledger.
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmDialogOpen(false)
                  setSelectedDisbursement(null)
                }}
                disabled={actionLoading}
                className="text-xs font-bold rounded-sm h-9 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDisburseConfirm}
                disabled={actionLoading || !referenceNumber.trim()}
                className="bg-primary text-on-primary hover:bg-primary-container text-xs font-bold rounded-sm h-9 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Disbursement</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  )
}
export default DisbursementsQueueClient
