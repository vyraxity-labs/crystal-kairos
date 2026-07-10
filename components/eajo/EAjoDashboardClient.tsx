'use client'

import React, { useState } from 'react'
import {
  Users,
  Calendar,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Clock,
  ArrowLeft,
  Upload,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { UploadAjoReceiptDialog } from './UploadAjoReceiptDialog'

interface AjoRecord {
  id: string
  contributionAmount: number
  totalParticipants: number
  duration: string
  frequency: string
  payoutPosition: number
  netPayoutAmount: number
  currentBalance: number
  totalContributed: number
  status: string
  createdAt: any
}

interface EAjoDashboardClientProps {
  userId: string
  ajoRecords: AjoRecord[]
}

const offerings = [
  {
    title: '4-Month Retailers Fund',
    duration: 'FOUR_MONTHS',
    frequency: 'WEEKLY',
    contribution: 10000,
    participants: 4,
    description:
      'Short-term cycle designed for retail traders to pool weekly cash flows and get quick liquidity rotation.',
  },
  {
    title: '6-Month Business Expansion Fund',
    duration: 'SIX_MONTHS',
    frequency: 'MONTHLY',
    contribution: 50000,
    participants: 6,
    description:
      'Mid-term rotating savings suited for small businesses seeking capital to invest in inventory or equipment.',
  },
  {
    title: '12-Month Capital Multiplier',
    duration: 'TWELVE_MONTHS',
    frequency: 'MONTHLY',
    contribution: 100000,
    participants: 12,
    description:
      'Long-term wealth-building circle for cooperative members focusing on significant project investments.',
  },
]

export const EAjoDashboardClient = ({
  userId,
  ajoRecords,
}: EAjoDashboardClientProps) => {
  const [activeAjoId, setActiveAjoId] = useState<string | null>(null)
  const [activeAjoAmount, setActiveAjoAmount] = useState(0)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(val)
  }

  const formatFrequency = (freq: string) => freq.toLowerCase()

  return (
    <div className='flex flex-col gap-6 w-full max-w-5xl mx-auto py-6'>
      {/* Back button */}
      <div className='flex items-center gap-1.5 text-muted-foreground hover:text-primary cursor-pointer transition-colors w-fit text-xs font-semibold'>
        <ArrowLeft className='w-4 h-4' />
        <Link href={`/dashboard/${userId}`}>Back to Dashboard</Link>
      </div>

      <header className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold font-heading text-primary leading-tight'>
            Digital Ajo Cycles
          </h2>
          <p className='text-muted-foreground text-sm mt-1'>
            Participate in risk-adjusted rotating group savings pools.
          </p>
        </div>
      </header>

      {/* 1. Active cycles list */}
      <section className='flex flex-col gap-3'>
        <h3 className='font-bold text-sm text-primary uppercase tracking-wide'>
          My Active Cycles
        </h3>
        {ajoRecords.length === 0 ? (
          <div className='border border-dashed border-outline-variant/30 rounded-lg py-12 text-center text-xs text-muted-foreground font-medium bg-surface-container-lowest'>
            No active Ajo group cycles joined yet. Select an offering below to
            begin!
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {ajoRecords.map((ajo) => {
              const progress = Math.min(
                100,
                (ajo.totalContributed /
                  (ajo.contributionAmount * ajo.totalParticipants)) *
                  100,
              )
              return (
                <Card
                  key={ajo.id}
                  className='border-0 bg-surface-container rounded-md shadow-none hover:ring-1 hover:ring-primary/20 transition-all duration-200'
                >
                  <CardContent className='p-5 flex flex-col justify-between min-h-[180px]'>
                    <div className='flex justify-between items-start mb-3'>
                      <div>
                        <h4 className='font-bold text-primary text-sm'>
                          Ajo Cycle Group
                        </h4>
                        <p className='text-[10px] text-muted-foreground mt-0.5'>
                          ID: #{ajo.id.substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <span className='bg-light-green text-success-green px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-success-green/20'>
                        <CheckCircle2 className='w-3 h-3 text-success-green' />
                        <span>{ajo.status}</span>
                      </span>
                    </div>

                    <div className='grid grid-cols-3 gap-2 py-2 border-y border-outline-variant/20 mb-3 text-xs'>
                      <div>
                        <span className='text-[9px] text-muted-foreground uppercase tracking-wider block'>
                          Contribution
                        </span>
                        <span className='font-bold text-primary font-mono'>
                          {formatCurrency(ajo.contributionAmount)}/
                          {formatFrequency(ajo.frequency)}
                        </span>
                      </div>
                      <div>
                        <span className='text-[9px] text-muted-foreground uppercase tracking-wider block'>
                          Position
                        </span>
                        <span className='font-bold text-primary font-mono'>
                          Slot {ajo.payoutPosition}
                        </span>
                      </div>
                      <div>
                        <span className='text-[9px] text-muted-foreground uppercase tracking-wider block'>
                          Net Payout
                        </span>
                        <span className='font-bold text-success-green font-mono'>
                          {formatCurrency(ajo.netPayoutAmount)}
                        </span>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                      <div>
                        <div className='flex justify-between text-[10px] text-muted-foreground mb-1 font-mono'>
                          <span>
                            Contributed: {formatCurrency(ajo.totalContributed)}
                          </span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <div className='w-full bg-outline-variant/35 rounded-full h-1.5'>
                          <div
                            className='bg-success-green h-1.5 rounded-full transition-all duration-300'
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <Button
                        size='sm'
                        onClick={() => {
                          setActiveAjoId(ajo.id)
                          setActiveAjoAmount(ajo.contributionAmount)
                          setUploadDialogOpen(true)
                        }}
                        className='cursor-pointer rounded-sm bg-secondary text-white hover:bg-secondary/90 flex items-center gap-1.5 text-[11px] h-8 px-4 border-0 mt-2 self-start font-semibold'
                      >
                        <Upload className='w-3.5 h-3.5' />
                        <span>Upload Contribution Receipt</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* 2. Group Offerings grid */}
      <section className='flex flex-col gap-4 mt-4'>
        <h3 className='font-bold text-sm text-primary uppercase tracking-wide'>
          Available Group Offerings
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {offerings.map((offering, index) => (
            <Card
              key={index}
              className='bg-surface-container-lowest rounded-md shadow-none flex flex-col justify-between p-6 border border-outline-variant/15 hover:shadow-md transition-all duration-300'
            >
              <div className='flex flex-col gap-2'>
                <div className='w-9 h-9 rounded-sm bg-primary/10 text-primary flex items-center justify-center mb-1'>
                  <Users className='w-5 h-5' />
                </div>
                <h4 className='font-bold text-primary text-base leading-snug'>
                  {offering.title}
                </h4>
                <p className='text-muted-foreground text-xs leading-relaxed mt-1'>
                  {offering.description}
                </p>

                <div className='flex flex-col gap-1.5 mt-4 pt-3 border-t border-outline-variant/20'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground'>
                      Contribution size:
                    </span>
                    <span className='font-bold text-primary font-mono'>
                      {formatCurrency(offering.contribution)}
                    </span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground'>Frequency:</span>
                    <span className='font-semibold text-primary capitalize'>
                      {formatFrequency(offering.frequency)}
                    </span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground'>
                      Slots / Duration:
                    </span>
                    <span className='font-semibold text-primary'>
                      {offering.participants} Positions ({offering.participants}{' '}
                      Months)
                    </span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground font-bold'>
                      Total Pool Size:
                    </span>
                    <span className='font-extrabold text-success-green font-mono'>
                      {formatCurrency(
                        offering.contribution * offering.participants,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className='cursor-pointer rounded-sm bg-primary hover:bg-primary/95 text-on-primary font-semibold flex items-center justify-center gap-1.5 w-full mt-6 h-10'
              >
                <Link
                  href={`/dashboard/${userId}/eajo/new?duration=${offering.duration}&amount=${offering.contribution}&slots=${offering.participants}`}
                >
                  <span>Join Pool Cycle</span>
                  <ArrowRight className='w-4 h-4' />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Upload Receipt Modal Dialog */}
      {activeAjoId && (
        <UploadAjoReceiptDialog
          userId={userId}
          eAjoId={activeAjoId}
          contributionAmount={activeAjoAmount}
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
        />
      )}
    </div>
  )
}
