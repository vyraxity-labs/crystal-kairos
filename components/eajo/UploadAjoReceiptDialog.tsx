'use client'

import React, { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { ReceiptDropzone } from '../ui/ReceiptDropzone'
import { uploadReceiptAction, submitEAjoContributionAction } from '@/models/eajo/actions'
import { AlertCircle, CheckCircle2, DollarSign } from 'lucide-react'

interface UploadAjoReceiptDialogProps {
  userId: string
  eAjoMemberId: string
  contributionAmount: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UploadAjoReceiptDialog = ({
  userId,
  eAjoMemberId,
  contributionAmount,
  open,
  onOpenChange,
}: UploadAjoReceiptDialogProps) => {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(val)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select or upload a payment receipt file.')
      return
    }

    setError(null)
    setSuccess(false)

    startTransition(async () => {
      // 1. Upload receipt file to Cloudinary/Disk via action
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const uploadResult = await uploadReceiptAction(uploadFormData)
      if (!uploadResult.success || !uploadResult.url) {
        setError(uploadResult.error || 'Failed to upload receipt file.')
        return
      }

      // 2. Submit contribution transaction record
      const result = await submitEAjoContributionAction(
        userId,
        eAjoMemberId,
        contributionAmount,
        uploadResult.url,
        referenceNumber.trim() || undefined,
        notes.trim() || undefined
      )

      if (result.success) {
        setSuccess(true)
        setFile(null)
        setReferenceNumber('')
        setNotes('')
        setTimeout(() => {
          setSuccess(false)
          onOpenChange(false)
        }, 1500)
      } else {
        setError(result.error || 'Failed to submit Ajo contribution receipt.')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-surface rounded-md p-6 border-0 shadow-lg">
        <DialogHeader className="pb-3 border-b border-outline-variant/20 mb-4">
          <DialogTitle className="text-primary font-bold text-base flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-secondary" />
            <span>Upload Ajo Contribution Receipt</span>
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-12 h-12 text-success-green" />
            <h3 className="font-bold text-sm text-primary">Receipt Submitted Successfully</h3>
            <p className="text-muted-foreground text-xs">
              Your proof of payment is pending administrative review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="bg-surface-container-low rounded-lg p-4 flex flex-col gap-1 border border-outline-variant/10 text-xs">
              <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[9px]">Contribution Amount Due</span>
              <span className="font-mono font-extrabold text-primary text-lg">{formatCurrency(contributionAmount)}</span>
            </div>

            {/* Receipt dropzone file uploader */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Upload Proof of Payment (Image/PDF)</Label>
              <ReceiptDropzone
                onFileSelected={setFile}
                value={file}
                maxSizeMb={5}
                error={error || undefined}
              />
            </div>

            {/* Reference & Notes fields */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="refNo" className="text-xs font-semibold text-muted-foreground">Reference Number (Optional)</Label>
              <Input
                id="refNo"
                placeholder="e.g. Bank transfer transaction ID"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="rounded-sm h-10 border-outline-variant/30 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes" className="text-xs font-semibold text-muted-foreground">Notes / Comments (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any extra details regarding this payment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="rounded-sm border-outline-variant/30 text-xs"
              />
            </div>

            {error && (
              <div className="bg-error-container/10 border border-error-container/30 text-error p-3 rounded-lg flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 justify-end mt-2 pt-3 border-t border-outline-variant/20">
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                className="cursor-pointer text-muted-foreground hover:bg-surface-container text-xs h-9 rounded-sm px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !file}
                className="cursor-pointer rounded-sm bg-primary text-on-primary hover:bg-primary/95 text-xs h-9 px-5 shadow-sm font-semibold"
              >
                {isPending ? 'Submitting...' : 'Submit Receipt'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
export default UploadAjoReceiptDialog
