'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Info } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createEAjoGroupAction } from '@/models/admin/actions'

const DURATIONS = [
  { value: 'FOUR_MONTHS', label: '4 Months (4 slots)', slots: 4 },
  { value: 'SIX_MONTHS', label: '6 Months (6 slots)', slots: 6 },
  { value: 'TWELVE_MONTHS', label: '12 Months (12 slots)', slots: 12 },
]

const FREQUENCIES = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
]

export const AdminCreateEAjoGroupClient = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    contributionAmount: '',
    frequency: 'MONTHLY',
    duration: 'SIX_MONTHS',
    startDate: '',
  })

  const selectedDuration = DURATIONS.find((d) => d.value === form.duration)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(val)

  const totalPoolSize =
    parseFloat(form.contributionAmount) > 0 && selectedDuration
      ? parseFloat(form.contributionAmount) * selectedDuration.slots
      : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.title.trim()) return setError('Group title is required.')
    if (!form.contributionAmount || parseFloat(form.contributionAmount) <= 0) {
      return setError('Please enter a valid contribution amount.')
    }

    startTransition(async () => {
      const result = await createEAjoGroupAction({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        contributionAmount: parseFloat(form.contributionAmount),
        frequency: form.frequency as any,
        duration: form.duration as any,
        startDate: form.startDate || undefined,
      })

      if (result.success) {
        router.push('/admin/eajo')
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.')
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto py-8 flex flex-col gap-6">
      {/* Back */}
      <div className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors w-fit text-xs font-semibold cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        <Link href="/admin/eajo">Back to Groups</Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-heading text-primary">Create eAjo Group</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define the group parameters. Members will be able to browse and apply for available slots.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-surface-container rounded-xl p-6 flex flex-col gap-5">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Group Details</h3>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title" className="text-xs font-semibold text-primary">
              Group Title <span className="text-error">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. 6-Month Business Expansion Fund"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="h-10 text-sm rounded-lg border-outline-variant/40"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-primary">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="A brief description to help members understand the purpose of this group..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="text-sm rounded-lg border-outline-variant/40 resize-none min-h-[80px]"
            />
          </div>
        </div>

        <div className="bg-surface-container rounded-xl p-6 flex flex-col gap-5">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Savings Parameters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Contribution Amount */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount" className="text-xs font-semibold text-primary">
                Contribution Amount (₦) <span className="text-error">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                min={0}
                placeholder="e.g. 50000"
                value={form.contributionAmount}
                onChange={(e) => setForm({ ...form, contributionAmount: e.target.value })}
                className="h-10 text-sm rounded-lg border-outline-variant/40 font-mono"
              />
            </div>

            {/* Frequency */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-primary">Contribution Frequency</Label>
              <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v })}>
                <SelectTrigger className="h-10 text-sm rounded-lg border-outline-variant/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-primary">Duration & Slots</Label>
              <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                <SelectTrigger className="h-10 text-sm rounded-lg border-outline-variant/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startDate" className="text-xs font-semibold text-primary">
                Planned Start Date <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="h-10 text-sm rounded-lg border-outline-variant/40"
              />
            </div>
          </div>

          {/* Pool Summary */}
          {totalPoolSize > 0 && (
            <div className="bg-primary/5 border border-primary/15 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="text-xs text-primary">
                <p className="font-bold mb-1">Group Pool Summary</p>
                <p>
                  <span className="text-muted-foreground">Total slots:</span>{' '}
                  <strong>{selectedDuration?.slots}</strong> members
                </p>
                <p>
                  <span className="text-muted-foreground">Total pool size:</span>{' '}
                  <strong className="font-mono">{formatCurrency(totalPoolSize)}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Each member receives:</span>{' '}
                  <strong className="font-mono">{formatCurrency(totalPoolSize)}</strong>{' '}
                  (minus applicable fee)
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-error bg-error/5 border border-error/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" asChild className="h-10 px-6 text-sm rounded-lg cursor-pointer">
            <Link href="/admin/eajo">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary text-on-primary hover:bg-primary/90 h-10 px-8 text-sm font-bold rounded-lg cursor-pointer"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
            ) : (
              'Create Group'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
