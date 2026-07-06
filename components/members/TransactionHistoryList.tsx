'use client'

import { useState } from 'react'
import { CompactTable } from '../ui/CompactTable'
import { StatusPill } from '../ui/StatusPill'
import { ReceiptLightbox } from '../ui/ReceiptLightbox'
import { Eye, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { TransactionType } from '@/generated/prisma/enums'

interface Transaction {
  id: string
  amount: any
  type: TransactionType
  category: string
  status: string
  receiptUrl: string | null
  createdAt: any
}

interface TransactionHistoryListProps {
  transactions: Transaction[]
}

export const TransactionHistoryList = ({
  transactions,
}: TransactionHistoryListProps) => {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const formatCurrency = (val: any) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(Number(val))
  }

  const handleViewReceipt = (url: string) => {
    setSelectedReceipt(url)
    setLightboxOpen(true)
  }

  const columns = [
    {
      header: 'Date',
      cell: (tx: Transaction) => (
        <span className='text-muted-foreground whitespace-nowrap'>
          {new Date(tx.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Category',
      cell: (tx: Transaction) => (
        <span className='font-semibold text-primary capitalize'>
          {tx.category.replace(/_/g, ' ').toLowerCase()}
        </span>
      ),
    },
    {
      header: 'Type',
      cell: (tx: Transaction) => {
        const isDeposit = tx.type === TransactionType.DEPOSIT
        return (
          <div className='flex items-center gap-1'>
            {isDeposit ? (
              <span className='flex items-center gap-1 text-[11px] font-semibold text-on-success bg-success-container/15 rounded-full px-2 py-0.5'>
                <ArrowDownLeft className='w-3.5 h-3.5 text-on-success' />
                <span>Deposit</span>
              </span>
            ) : (
              <span className='flex items-center gap-1 text-[11px] font-semibold text-on-error bg-error-container/10 rounded-full px-2 py-0.5'>
                <ArrowUpRight className='w-3.5 h-3.5 text-on-error' />
                <span>Withdrawal</span>
              </span>
            )}
          </div>
        )
      },
    },
    {
      header: 'Amount',
      cell: (tx: Transaction) => {
        const isDeposit = tx.type === TransactionType.DEPOSIT
        return (
          <span
            className={`font-mono font-bold tracking-tight whitespace-nowrap ${isDeposit ? 'text-on-success' : 'text-on-error'}`}
          >
            {isDeposit ? '+' : '-'}
            {formatCurrency(tx.amount)}
          </span>
        )
      },
    },
    {
      header: 'Status',
      cell: (tx: Transaction) => <StatusPill status={tx.status} />,
    },
    {
      header: 'Attachment',
      className: 'text-center',
      cell: (tx: Transaction) => (
        <div className='flex justify-center'>
          {tx.receiptUrl ? (
            <Button
              size='sm'
              variant='ghost'
              onClick={() => handleViewReceipt(tx.receiptUrl!)}
              className='cursor-pointer text-secondary hover:text-secondary-hover hover:bg-secondary/10 flex items-center gap-1 w-8 h-8 p-0'
              title='View upload receipt attachment'
            >
              <Eye className='w-4 h-4' />
            </Button>
          ) : (
            <span className='text-xs text-muted-foreground/40 font-medium select-none'>
              -
            </span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className='flex flex-col gap-3 w-full bg-surface-container p-5 rounded-md'>
      <div className='flex justify-between items-center pb-2 border-b border-outline-variant/30'>
        <h3 className='font-bold text-sm text-primary uppercase tracking-wide'>
          Transaction History Ledger
        </h3>
        <span className='text-xs text-muted-foreground font-mono'>
          {transactions.length} Records
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className='py-12 text-center text-xs text-muted-foreground font-medium select-none'>
          No transactions recorded to date.
        </div>
      ) : (
        <div className='overflow-x-auto w-full'>
          <CompactTable data={transactions} columns={columns} />
        </div>
      )}

      <ReceiptLightbox
        url={selectedReceipt}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  )
}
