'use client'

import React, { useState, useTransition } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { applyToEAjoGroupAction } from '@/models/eajo/actions'
import { useRouter } from 'next/navigation'

interface FeeConfig {
  pickPosition: number
  feePercentage: number
}

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountName: string
  isPrimary: boolean
}

interface EAjoGroup {
  id: string
  title: string
  description: string | null
  contributionAmount: number
  frequency: string
  duration: string
  totalSlots: number
  filledSlots: number
  status: string
  startDate: Date | null
  members: { payoutPosition: number; status: string }[]
}

interface NewAjoClientProps {
  userId: string
  group: EAjoGroup
  feeConfigs: FeeConfig[]
  bankAccounts: BankAccount[]
}

export const NewAjoClient = ({ userId, group, feeConfigs, bankAccounts }: NewAjoClientProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)

  // Guarantor state
  const [guarantorName, setGuarantorName] = useState('')
  const [guarantorPhone, setGuarantorPhone] = useState('')

  // Bank state
  const [selectedBankAccountId, setSelectedBankAccountId] = useState(
    bankAccounts.find((a) => a.isPrimary)?.id || bankAccounts[0]?.id || ''
  )
  const [customBankName, setCustomBankName] = useState('')
  const [customAccountNumber, setCustomAccountNumber] = useState('')
  const [customAccountName, setCustomAccountName] = useState('')
  const [useCustomBank, setUseCustomBank] = useState(bankAccounts.length === 0)

  const [acknowledged, setAcknowledged] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Build taken slot set from real DB data
  const takenPositions = new Set(
    group.members
      .filter((m) => m.status !== 'REJECTED' && m.status !== 'CANCELLED')
      .map((m) => m.payoutPosition)
  )

  const grossPayout = group.contributionAmount * group.totalSlots

  const getPositionDetails = (pos: number) => {
    const config = feeConfigs.find((c) => c.pickPosition === pos)
    const pct = config ? Number(config.feePercentage) : 0
    const fee = (grossPayout * pct) / 100
    const net = grossPayout - fee
    return { pct, fee, net }
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(val)

  const formatShortCurrency = (val: number) => {
    if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `₦${(val / 1000).toFixed(0)}k`
    return `₦${val}`
  }

  const formatFrequency = (freq: string) => freq.charAt(0) + freq.slice(1).toLowerCase()

  const handleBankSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val === 'custom') {
      setUseCustomBank(true)
      setSelectedBankAccountId('')
    } else {
      setUseCustomBank(false)
      setSelectedBankAccountId(val)
    }
  }

  const handleApply = () => {
    if (selectedPosition === null) return setError('Please select an available position slot.')
    if (!guarantorName.trim() || !guarantorPhone.trim()) return setError('Guarantor name and phone number are required.')

    let bankName = ''
    let accountNumber = ''
    let accountName = ''

    if (useCustomBank) {
      if (!customBankName.trim() || !customAccountNumber.trim() || !customAccountName.trim()) {
        return setError('Please complete the custom bank account fields.')
      }
      bankName = customBankName
      accountNumber = customAccountNumber
      accountName = customAccountName
    } else {
      const selectedAcct = bankAccounts.find((a) => a.id === selectedBankAccountId)
      if (!selectedAcct) return setError('Selected bank account details not found.')
      bankName = selectedAcct.bankName
      accountNumber = selectedAcct.accountNumber
      accountName = selectedAcct.accountName
    }

    if (!acknowledged) return setError('You must acknowledge the fee deduction term to submit your application.')

    setError(null)

    startTransition(async () => {
      const result = await applyToEAjoGroupAction(userId, group.id, {
        payoutPosition: selectedPosition,
        guarantorName,
        guarantorPhoneNumber: guarantorPhone,
        bankName,
        accountNumber,
        accountName,
      })

      if (result.success) {
        router.push(`/dashboard/${userId}/eajo`)
      } else {
        setError(result.error || 'An error occurred while submitting your application.')
      }
    })
  }

  const selectedDetails = selectedPosition !== null ? getPositionDetails(selectedPosition) : null
  const availableCount = group.totalSlots - takenPositions.size

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-6">
      {/* Back */}
      <div className="flex items-center gap-1.5 text-muted-foreground hover:text-primary cursor-pointer transition-colors w-fit text-xs font-semibold">
        <ArrowLeft className="w-4 h-4" />
        <Link href={`/dashboard/${userId}/eajo`}>Back to Offerings</Link>
      </div>

      {/* Group Header */}
      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2">
              <span className="px-3 py-1 bg-light-blue text-primary rounded-full text-[10px] font-bold tracking-wider uppercase">
                Open Ajo Group
              </span>
              {group.startDate && (
                <span className="flex items-center gap-1 text-muted-foreground text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Starts {new Date(group.startDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-primary font-heading leading-tight">{group.title}</h1>
            {group.description && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{group.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
              <span>{group.totalSlots} Members</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span>{formatFrequency(group.frequency)} Contributions</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="text-success-green font-semibold">{availableCount} Slot{availableCount !== 1 ? 's' : ''} Available</span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end bg-surface-bright p-4 rounded-lg border border-outline-variant/10 min-w-[240px]">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Total Pool Size</span>
            <div className="text-3xl font-extrabold text-success-green flex items-baseline gap-0.5">
              <span className="text-lg">₦</span>
              <span className="font-mono">{grossPayout.toLocaleString('en-NG')}</span>
            </div>
            <div className="mt-2 flex justify-between w-full border-t border-outline-variant/20 pt-2 text-xs">
              <span className="text-muted-foreground">Your Contribution</span>
              <span className="font-bold text-primary font-mono">
                {formatCurrency(group.contributionAmount)} / {formatFrequency(group.frequency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* Step 1: Select Slot */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-primary">Select Your Position Slot</h2>
              <span className="text-xs text-muted-foreground">{availableCount} of {group.totalSlots} Available</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: group.totalSlots }).map((_, i) => {
                const pos = i + 1
                const taken = takenPositions.has(pos)
                const active = selectedPosition === pos
                const details = getPositionDetails(pos)

                if (taken) {
                  return (
                    <div
                      key={pos}
                      className="bg-surface-container-low border border-outline-variant/10 rounded-lg p-4 opacity-70 cursor-not-allowed min-h-[120px] flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-lg font-bold text-outline font-mono">{pos.toString().padStart(2, '0')}</span>
                        <span className="px-2 py-0.5 bg-surface-variant text-on-surface-variant rounded-full text-[9px] font-bold uppercase">Taken</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium mt-auto">Reserved</span>
                    </div>
                  )
                }

                return (
                  <div
                    key={pos}
                    onClick={() => setSelectedPosition(pos)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 min-h-[120px] flex flex-col justify-between select-none
                      ${active ? 'ring-2 ring-primary bg-light-blue border-primary' : 'border-outline-variant/20 hover:border-primary hover:bg-light-blue/20 bg-surface-container-lowest'}`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="text-lg font-bold font-mono text-primary">{pos.toString().padStart(2, '0')}</span>
                      <span className="px-2 py-0.5 bg-light-green text-success-green rounded-full text-[9px] font-bold uppercase border border-success-green/20">Available</span>
                    </div>
                    <div className="mt-auto flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-semibold">Net Payout</span>
                      <span className="font-mono font-bold text-primary text-sm">{formatShortCurrency(details.net)}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {selectedPosition !== null && selectedDetails && (
              <div className="mt-6 bg-surface-container rounded-lg p-5 border border-outline-variant/20 animate-in fade-in duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Selected Slot</p>
                    <span className="inline-flex items-center gap-1 bg-light-blue px-3 py-1 rounded-full text-xs font-bold text-primary mt-1">
                      Slot {selectedPosition.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/10 text-xs">
                  <h3 className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-3">Financial Breakdown</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Payout</span>
                      <span className="font-semibold text-primary font-mono">{formatCurrency(grossPayout)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Premium Risk Fee</span>
                      <span className={`font-semibold font-mono ${selectedDetails.pct > 0 ? 'text-error' : selectedDetails.pct < 0 ? 'text-success-green' : 'text-muted-foreground'}`}>
                        {selectedDetails.pct > 0 ? `-${selectedDetails.pct}%` : selectedDetails.pct < 0 ? `+${Math.abs(selectedDetails.pct)}% Bonus` : '0%'}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-outline-variant/30 pt-2 font-bold text-sm">
                      <span className="text-primary uppercase text-[10px]">Net Payout Amount</span>
                      <span className="text-success-green font-mono">{formatCurrency(selectedDetails.net)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedPosition === null && (
              <div className="bg-surface-container-low border border-outline-variant/20 border-dashed rounded-lg p-5 flex items-center justify-center mt-6 text-xs text-muted-foreground select-none">
                Please select an available position slot from the grid above.
              </div>
            )}
          </div>

          {/* Step 2: Guarantor */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 flex flex-col gap-4">
            <h2 className="text-base font-bold text-primary">Nominate Group Guarantor</h2>
            <p className="text-xs text-muted-foreground leading-relaxed -mt-2">
              Every Ajo group member must nominate a guarantor to guarantee payment cycle stability.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="guarantorName" className="text-xs font-semibold text-muted-foreground">Guarantor Name</Label>
                <Input
                  id="guarantorName"
                  placeholder="e.g. John Doe"
                  value={guarantorName}
                  onChange={(e) => setGuarantorName(e.target.value)}
                  className="rounded-sm h-10 border-outline-variant/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="guarantorPhone" className="text-xs font-semibold text-muted-foreground">Guarantor Phone Number</Label>
                <Input
                  id="guarantorPhone"
                  placeholder="e.g. 08012345678"
                  value={guarantorPhone}
                  onChange={(e) => setGuarantorPhone(e.target.value)}
                  className="rounded-sm h-10 border-outline-variant/30"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payout Bank */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 flex flex-col gap-4">
            <h2 className="text-base font-bold text-primary">Payout Bank Account</h2>
            <p className="text-xs text-muted-foreground leading-relaxed -mt-2">
              Specify which account should receive your payout when your slot matures.
            </p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bankSelect" className="text-xs font-semibold text-muted-foreground">Select Saved Bank Account</Label>
              <select
                id="bankSelect"
                value={useCustomBank ? 'custom' : selectedBankAccountId}
                onChange={handleBankSelectChange}
                className="w-full bg-surface border border-outline-variant/35 rounded-sm p-2 text-sm h-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {bankAccounts.map((acct) => (
                  <option key={acct.id} value={acct.id}>
                    {acct.bankName} - {acct.accountNumber} ({acct.accountName}){acct.isPrimary ? ' [Primary]' : ''}
                  </option>
                ))}
                <option value="custom">-- Add Custom Bank Account --</option>
              </select>
            </div>

            {useCustomBank && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-outline-variant/20 pt-4 animate-in fade-in duration-200">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="customBank" className="text-xs font-semibold text-muted-foreground">Bank Name</Label>
                  <Input id="customBank" placeholder="e.g. GTBank" value={customBankName} onChange={(e) => setCustomBankName(e.target.value)} className="rounded-sm h-10 border-outline-variant/30" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="customAcctNo" className="text-xs font-semibold text-muted-foreground">Account Number</Label>
                  <Input id="customAcctNo" placeholder="10 digits" value={customAccountNumber} onChange={(e) => setCustomAccountNumber(e.target.value)} className="rounded-sm h-10 border-outline-variant/30" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="customAcctName" className="text-xs font-semibold text-muted-foreground">Account Name</Label>
                  <Input id="customAcctName" placeholder="Receiving name" value={customAccountName} onChange={(e) => setCustomAccountName(e.target.value)} className="rounded-sm h-10 border-outline-variant/30" />
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error-container/10 border border-error-container/30 text-error p-4 rounded-lg flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 4: Acknowledge + Submit */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 flex flex-col gap-4">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-4 h-4 text-primary border-outline-variant/30 rounded-sm mt-0.5 focus:ring-primary focus:outline-none cursor-pointer"
              />
              <span className="text-xs text-muted-foreground leading-snug">
                I acknowledge the platform risk-adjusted fee schedule and agree to participate in this rotating group savings cycle. My application is subject to admin approval.
              </span>
            </label>

            <Button
              onClick={handleApply}
              disabled={isPending || selectedPosition === null}
              className="cursor-pointer rounded-sm bg-primary text-on-primary hover:bg-primary/95 flex items-center justify-center gap-1.5 w-full h-11 text-sm font-semibold mt-2 shadow-sm"
            >
              {isPending ? 'Submitting Application...' : 'Submit Application'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-outline-variant/20">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-primary uppercase tracking-wide">Risk-Adjusted Fees</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              To balance liquidity access and cooperative risk, early collectors pay a premium fee, mid-cycle collections are standard, and late collectors receive a savings bonus.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Early collector fee', value: '1.0% - 10.0%', color: 'text-error' },
                { label: 'Mid-collector fee', value: '0.0%', color: 'text-outline' },
                { label: 'Late-collector bonus', value: '+Bonus', color: 'text-success-green' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center p-2.5 bg-surface-bright rounded-md text-xs border border-outline-variant/15">
                  <span className="text-muted-foreground font-semibold">{label}</span>
                  <span className={`font-bold font-mono ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-success-green/10 border border-success-green/20 rounded-xl p-4 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-success-green shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-primary">Crystal Kairos Protected</h4>
              <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                Contributions are backed by cooperative assets to safeguard payment cycles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
