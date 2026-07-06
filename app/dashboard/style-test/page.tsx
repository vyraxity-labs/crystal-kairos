'use client'

import { useState } from 'react'
import { StatusPill } from '@/components/ui/StatusPill'
import { ReceiptDropzone } from '@/components/ui/ReceiptDropzone'
import { BankAccountCard } from '@/components/members/BankAccountCard'
import { NextOfKinCard } from '@/components/members/NextOfKinCard'
import { CompactTable } from '@/components/ui/CompactTable'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MockTx {
  id: string
  date: string
  category: string
  amount: string
  status: string
}

export default function StyleTestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: '1',
      bankName: 'Access Bank',
      accountNumber: '0123456789',
      accountName: 'John Doe',
      isPrimary: true,
    },
    {
      id: '2',
      bankName: 'GTBank',
      accountNumber: '9876543210',
      accountName: 'John Doe',
      isPrimary: false,
    },
  ])

  const mockTransactions: MockTx[] = [
    {
      id: '1',
      date: '2026-07-06',
      category: 'Ajo Contribution',
      amount: '₦10,000.00',
      status: 'CONFIRMED',
    },
    {
      id: '2',
      date: '2026-07-05',
      category: 'Savings Deposit',
      amount: '₦50,000.00',
      status: 'PENDING',
    },
    {
      id: '3',
      date: '2026-07-04',
      category: 'Loan Repayment',
      amount: '₦15,000.00',
      status: 'CONFIRMED',
    },
    {
      id: '4',
      date: '2026-07-02',
      category: 'Savings Withdrawal',
      amount: '₦20,000.00',
      status: 'DISBURSED',
    },
    {
      id: '5',
      date: '2026-07-01',
      category: 'Loan Disbursement',
      amount: '₦100,000.00',
      status: 'FAILED',
    },
  ]

  const handleMakePrimary = (id: string) => {
    setBankAccounts((accounts) =>
      accounts.map((acc) => ({
        ...acc,
        isPrimary: acc.id === id,
      })),
    )
  }

  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
      className: 'w-[120px]',
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Amount',
      cell: (row: MockTx) => (
        <span className='font-mono font-semibold tabular-nums'>
          {row.amount}
        </span>
      ),
      className: 'text-right w-[150px]',
    },
    {
      header: 'Status',
      cell: (row: MockTx) => <StatusPill status={row.status} />,
      className: 'w-[120px] text-center',
    },
  ]

  return (
    <div className='container mx-auto py-10 px-6 max-w-5xl flex flex-col gap-10'>
      <header className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight font-heading text-primary'>
          Design System & Style Test Guide
        </h1>
        <p className='text-muted-foreground text-sm max-w-xl'>
          Visual test harness verifying Google Stitch color tokens, typography
          sizes, and custom-designed reusable UI components for Crystal Kairos.
        </p>
      </header>

      {/* 1. Status Pills */}
      <section className='flex flex-col gap-4'>
        <h2 className='text-lg font-bold text-primary font-heading border-b border-outline-variant/20 pb-2'>
          1. Status Pills (Desaturated Tonal Pairs)
        </h2>
        <div className='bg-surface p-6 rounded-md shadow-sm border border-outline-variant/35 flex gap-3 flex-wrap'>
          <StatusPill status='PENDING' />
          <StatusPill status='APPROVED' />
          <StatusPill status='CONFIRMED' />
          <StatusPill status='ACTIVE' />
          <StatusPill status='REJECTED' />
          <StatusPill status='FAILED' />
          <StatusPill status='DISBURSED' />
          <StatusPill status='INACTIVE' />
        </div>
      </section>

      {/* 2. Bank & Next of Kin Cards */}
      <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-lg font-bold text-primary font-heading border-b border-outline-variant/20 pb-2'>
            2. Bank Account configurations
          </h2>
          <div className='flex flex-col gap-3'>
            {bankAccounts.map((acc) => (
              <BankAccountCard
                key={acc.id}
                bankName={acc.bankName}
                accountNumber={acc.accountNumber}
                accountName={acc.accountName}
                isPrimary={acc.isPrimary}
                onMakePrimary={() => handleMakePrimary(acc.id)}
                onDelete={() => console.log('Delete account:', acc.id)}
              />
            ))}
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <h2 className='text-lg font-bold text-primary font-heading border-b border-outline-variant/20 pb-2'>
            3. Next of Kin Profile Card
          </h2>
          <NextOfKinCard
            name='Jane Doe'
            phoneNumber='+234 809 876 5432'
            relationship='SPOUSE'
            occupation='Accountant'
            address='45, Admiralty Way, Lekki Phase 1, Lagos'
            bankName='Access Bank'
            accountNumber='0987654321'
            accountName='Jane Doe'
          />
        </div>
      </section>

      {/* 3. Dropzone & Table */}
      <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-lg font-bold text-primary font-heading border-b border-outline-variant/20 pb-2'>
            4. Drag & Drop Receipt Dropzone
          </h2>
          <Card className='border-0 shadow-none bg-transparent'>
            <CardContent className='p-0 flex flex-col gap-4'>
              <ReceiptDropzone
                value={selectedFile}
                onFileSelected={(file) => setSelectedFile(file)}
                error={
                  selectedFile === null
                    ? 'Proof of payment receipt is required for verification.'
                    : undefined
                }
              />
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  className='cursor-pointer'
                  onClick={() =>
                    setSelectedFile(
                      new File(['mock'], 'mock_receipt.png', {
                        type: 'image/png',
                      }),
                    )
                  }
                >
                  Mock File Load
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  className='cursor-pointer text-error hover:bg-error/10 hover:text-error'
                  onClick={() => setSelectedFile(null)}
                >
                  Clear File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex flex-col gap-4'>
          <h2 className='text-lg font-bold text-primary font-heading border-b border-outline-variant/20 pb-2'>
            5. Compact Table (Zebra Stripes & No-Borders)
          </h2>
          <CompactTable
            data={mockTransactions}
            columns={columns}
            emptyMessage='No ledger entries found.'
          />
        </div>
      </section>
    </div>
  )
}
