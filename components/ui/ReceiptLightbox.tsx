'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { ExternalLink, FileText, X } from 'lucide-react'

interface ReceiptLightboxProps {
  url: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ReceiptLightbox = ({
  url,
  open,
  onOpenChange,
}: ReceiptLightboxProps) => {
  if (!url) return null

  const isPdf = url.toLowerCase().endsWith('.pdf')

  const handleDownload = () => {
    window.open(url, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl bg-black/85 border-0 text-white backdrop-blur-md rounded-md p-6 flex flex-col items-center justify-center'>
        <DialogHeader className='w-full flex flex-row items-center justify-between border-b border-white/10 pb-3'>
          <DialogTitle className='text-white font-semibold text-sm'>
            Receipt Attachment Preview
          </DialogTitle>
          <div className='flex gap-2'>
            <Button
              size='icon'
              variant='ghost'
              onClick={handleDownload}
              title='Download or Open in New Tab'
              className='text-white/80 hover:text-white hover:bg-white/10 cursor-pointer w-8 h-8 rounded-sm'
            >
              <ExternalLink className='w-4 h-4' />
            </Button>
          </div>
        </DialogHeader>

        <div className='w-full flex-1 flex items-center justify-center min-h-[350px] max-h-[70vh] py-4 overflow-auto'>
          {isPdf ? (
            <div className='flex flex-col items-center gap-3'>
              <FileText className='w-16 h-16 text-secondary' />
              <span className='text-sm font-medium'>PDF Document Receipt</span>
              <Button
                asChild
                variant='secondary'
                size='sm'
                className='cursor-pointer rounded-sm mt-2'
              >
                <a href={url} target='_blank' rel='noopener noreferrer'>
                  Open PDF in New Window
                </a>
              </Button>
            </div>
          ) : (
            <img
              src={url}
              alt='Receipt Attachment'
              className='max-w-full max-h-[60vh] object-contain rounded-md transition-transform duration-300 hover:scale-105'
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
