'use client'

import React, { useState } from 'react'
import {
  Receipt,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Activity,
  FileText,
  ZoomIn,
  ZoomOut,
  X,
  AlertTriangle,
  Send,
  Flag,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { transitionTransaction } from '@/models/transactions/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface PendingReceipt {
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
  recordedBy: string
  createdAt: Date
  user: {
    id: string
    name: string
    email: string
    userInfo: {
      phoneNumber: string | null
    } | null
  }
}

interface VerificationQueueClientProps {
  receipts: PendingReceipt[]
  adminId: string
}

export const VerificationQueueClient = ({ receipts: initialReceipts, adminId }: VerificationQueueClientProps) => {
  const router = useRouter()
  const [receipts, setReceipts] = useState<PendingReceipt[]>(initialReceipts)
  const [selectedReceipt, setSelectedReceipt] = useState<PendingReceipt | null>(null)
  const [search, setSearch] = useState('')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isRejectionFormOpen, setIsRejectionFormOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isDuplicateFlagged, setIsDuplicateFlagged] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Filter receipts based on search query
  const filteredReceipts = receipts.filter((rx) => {
    const query = search.toLowerCase()
    return (
      rx.user.name.toLowerCase().includes(query) ||
      rx.user.email.toLowerCase().includes(query) ||
      String(rx.amount).includes(query) ||
      rx.category.toLowerCase().includes(query)
    )
  })

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(val)
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'SAVINGS_DEPOSIT':
        return 'Savings Deposit'
      case 'LOAN_REPAYMENT':
        return 'Loan Repayment'
      case 'AJO_CONTRIBUTION':
        return 'Ajo Contribution'
      default:
        return category.replace('_', ' ')
    }
  }

  const handleVerifyConfirm = async (rxId: string) => {
    setActionLoading(true)
    const toastId = toast.loading('Confirming payment receipt...')
    try {
      const result = await transitionTransaction(
        rxId,
        'CONFIRM',
        adminId,
        undefined,
        isDuplicateFlagged ? 'Flagged as potential duplicate' : undefined
      )

      if (result.success) {
        toast.success('Payment receipt confirmed successfully!', { id: toastId })
        setSelectedReceipt(null)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to confirm receipt.', { id: toastId })
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong.', { id: toastId })
    } finally {
      setActionLoading(false)
    }
  }

  const handleVerifyReject = async (rxId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason.')
      return
    }

    setActionLoading(true)
    const toastId = toast.loading('Rejecting payment receipt...')
    try {
      const result = await transitionTransaction(
        rxId,
        'REJECT',
        adminId,
        rejectionReason
      )

      if (result.success) {
        toast.success('Payment receipt rejected.', { id: toastId })
        setSelectedReceipt(null)
        setIsRejectionFormOpen(false)
        setRejectionReason('')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to reject receipt.', { id: toastId })
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
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-primary leading-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-warning-amber" />
            <span>Verification Queue</span>
          </h2>
          <p className="text-muted-foreground text-xs mt-1">
            Review uploaded deposit receipts and verify payments to update member ledger accounts.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member, category, amount..."
            className="pl-9 text-xs py-1.5 h-9 rounded-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      {/* Receipts Table Container */}
      <Card className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-primary text-on-primary font-bold">
                <th className="p-3 font-normal opacity-90">Date Acknowledged</th>
                <th className="p-3 font-normal opacity-90">Member Details</th>
                <th className="p-3 font-normal opacity-90">Expected Amount</th>
                <th className="p-3 font-normal opacity-90">Deposit Category</th>
                <th className="p-3 font-normal opacity-90">Receipt proof</th>
                <th className="p-3 font-normal opacity-90 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-primary font-medium">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground font-medium italic">
                    {search ? 'No receipts match your search filters.' : 'All verification queue tasks are complete! KYC/Ledger is verified.'}
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((rx) => (
                  <tr key={rx.id} className="hover:bg-surface-container-low transition-colors text-primary font-medium">
                    <td className="p-3 whitespace-nowrap text-muted-foreground font-mono">
                      {new Date(rx.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-semibold text-primary">{rx.user.name}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">{rx.user.email}</div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-primary">
                      {formatCurrency(rx.amount)}
                    </td>
                    <td className="p-3">
                      <span className="bg-surface-container-low text-primary px-2 py-1 rounded border border-outline-variant/30 text-[10px]">
                        {getCategoryLabel(rx.category)}
                      </span>
                    </td>
                    <td className="p-3">
                      {rx.receiptUrl ? (
                        <button
                          onClick={() => {
                            setSelectedReceipt(rx)
                            setIsDuplicateFlagged(false)
                          }}
                          className="flex items-center gap-1.5 text-xs text-secondary hover:underline cursor-pointer font-bold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Doc</span>
                        </button>
                      ) : (
                        <span className="text-muted-foreground italic font-normal">No file uploaded</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        onClick={() => {
                          setSelectedReceipt(rx)
                          setIsDuplicateFlagged(false)
                        }}
                        className="bg-primary text-on-primary text-[10px] uppercase font-bold py-1 h-7 rounded-sm shadow-sm hover:bg-primary-container cursor-pointer"
                      >
                        Review Entry
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. SIDE-BY-SIDE VERIFICATION DETAILS MODAL OVERLAY */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col md:flex-row w-full max-w-[1100px] h-[90vh] md:h-[80vh] bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/20 relative">
            
            {/* Left Column: Receipt Document Viewer (60%) */}
            <div className="w-full md:w-[60%] flex flex-col border-b md:border-b-0 md:border-r border-outline-variant bg-surface-container-low relative">
              {/* Toolbar */}
              <div className="h-12 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4 shrink-0 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Uploaded Receipt Document</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:bg-surface-container hover:text-primary rounded-sm"
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-[10px] font-bold font-mono text-primary w-8 text-center">{zoomLevel}%</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:bg-surface-container hover:text-primary rounded-sm"
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Document Canvas (Checkerboard) */}
              <div className="flex-1 bg-surface-container-low flex items-center justify-center p-6 overflow-auto custom-scrollbar relative">
                {selectedReceipt.receiptUrl ? (
                  <div
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                    className="transition-transform duration-200 relative w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={selectedReceipt.receiptUrl}
                      alt="Payment proof receipt upload"
                      className="max-w-[90%] max-h-[90%] object-contain shadow-md border border-outline-variant/30 bg-white rounded-md"
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                    <AlertTriangle className="w-8 h-8 text-warning-amber" />
                    <p className="text-xs font-semibold">No receipt image attached to this deposit record.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Context/Details Form Pane (40%) */}
            <div className="w-full md:w-[40%] flex flex-col bg-surface-container-lowest h-full">
              {/* Header */}
              <div className="h-14 px-6 border-b border-outline-variant flex items-center justify-between shrink-0 bg-surface-container-lowest">
                <h3 className="font-bold text-sm text-primary uppercase tracking-wide">Receipt Verification</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-surface-container hover:text-primary rounded-full"
                  onClick={() => {
                    setSelectedReceipt(null)
                    setIsRejectionFormOpen(false)
                    setRejectionReason('')
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Context Area (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-surface-bright">
                
                {/* Standard Verification Notice */}
                <div className="bg-light-blue rounded-lg p-3 border border-primary-fixed-dim/35 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">Standard Verification</h4>
                    <p className="text-[10px] text-on-primary-fixed-variant leading-relaxed font-medium">
                      Cross-reference the uploaded document details against the expected transaction values below.
                    </p>
                  </div>
                </div>

                {/* Member Entity Card */}
                <Card className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-3 border-b border-outline-variant/10 pb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">Member Entity</h4>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-primary truncate leading-snug">{selectedReceipt.user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate font-normal mb-2">{selectedReceipt.user.email}</p>
                      
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[9px] font-bold text-primary border border-outline-variant/45">
                          MEMBER
                        </span>
                        {selectedReceipt.user.userInfo?.phoneNumber && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-muted-foreground font-semibold">
                            <Phone className="w-3 h-3" />
                            <span>{selectedReceipt.user.userInfo.phoneNumber}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-surface-tint text-on-primary flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      {selectedReceipt.user.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </Card>

                {/* Ledger Details Card */}
                <Card className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                  
                  <div className="flex items-center gap-1.5 mb-3 border-b border-outline-variant/10 pb-2 mt-1">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">Ledger Details</h4>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-muted-foreground font-medium">Type</span>
                      <span className="font-bold text-primary bg-surface-container px-2 py-0.5 rounded text-[10px]">
                        {getCategoryLabel(selectedReceipt.category)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-muted-foreground font-medium">Deposit Date</span>
                      <span className="font-bold text-primary">
                        {new Date(selectedReceipt.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-muted-foreground font-medium">Expected Amount</span>
                      <span className="font-mono font-bold text-primary text-sm">
                        {formatCurrency(selectedReceipt.amount)}
                      </span>
                    </div>

                    {selectedReceipt.notes && (
                      <div className="pt-2 border-t border-outline-variant/10">
                        <span className="block text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-1">User Notes / Reference</span>
                        <p className="text-[10px] text-primary bg-surface-container-low p-2 rounded leading-relaxed border border-outline-variant/20">
                          {selectedReceipt.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Duplicate Flag Card */}
                <Card className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isDuplicateFlagged}
                      onChange={(e) => setIsDuplicateFlagged(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-primary group-hover:text-secondary transition-colors block">
                        Flag as Possible Duplicate
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5 leading-relaxed">
                        Mark this transaction for administrative review if the receipt resembles a previously submitted document.
                      </span>
                    </div>
                  </label>
                </Card>

              </div>

              {/* Action Area / Footer */}
              <div className="border-t border-outline-variant bg-surface-container-lowest p-5 shrink-0 rounded-br-xl shadow-md">
                
                {/* Default buttons */}
                {!isRejectionFormOpen ? (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsRejectionFormOpen(true)}
                      disabled={actionLoading}
                      className="flex-1 border border-error text-error hover:bg-light-red font-bold text-xs uppercase tracking-wider py-2.5 h-11 rounded-sm cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Receipt</span>
                    </Button>
                    <Button
                      onClick={() => handleVerifyConfirm(selectedReceipt.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-success-green hover:brightness-95 text-on-primary font-bold text-xs uppercase tracking-wider py-2.5 h-11 rounded-sm cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Receipt</span>
                    </Button>
                  </div>
                ) : (
                  /* Rejection Form */
                  <div className="flex flex-col gap-3 bg-light-red p-3 rounded-lg border border-error-red/20 animate-in slide-in-from-bottom-2 duration-200">
                    <Label htmlFor="rej-reason" className="text-xs font-bold text-error flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Mandatory Rejection Reason</span>
                    </Label>
                    <textarea
                      id="rej-reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please specify why this receipt is rejected (e.g. illegible text, incorrect amount, duplicate submission)..."
                      rows={3}
                      className="w-full bg-surface-container-lowest border border-error rounded-sm p-2 text-xs focus:ring-1 focus:ring-error focus:border-error outline-none resize-none placeholder:text-muted-foreground/60 custom-scrollbar text-primary"
                      required
                    />
                    <div className="flex gap-2 pt-1.5">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsRejectionFormOpen(false)
                          setRejectionReason('')
                        }}
                        disabled={actionLoading}
                        className="flex-1 border border-outline-variant hover:bg-surface-container text-xs font-bold rounded-sm h-9 cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleVerifyReject(selectedReceipt.id)}
                        disabled={actionLoading || !rejectionReason.trim()}
                        className="flex-[2] bg-error hover:brightness-90 text-on-primary text-xs font-bold rounded-sm h-9 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>Submit Rejection</span>
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}
export default VerificationQueueClient
