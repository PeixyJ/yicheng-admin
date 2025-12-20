import { useState } from 'react'
import { Ban } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { revokeCoupon } from '@/services/coupon'

interface RevokeCouponDialogProps {
  couponId: number
  couponNo: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RevokeCouponDialog({
  couponId,
  couponNo,
  open,
  onOpenChange,
  onSuccess,
}: RevokeCouponDialogProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) return

    setSubmitting(true)
    try {
      const response = await revokeCoupon(couponId, reason.trim())
      if (response.code === 'success') {
        onOpenChange(false)
        setReason('')
        onSuccess?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setReason('')
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10'>
              <Ban className='h-5 w-5 text-destructive' />
            </div>
            撤销优惠券
          </DialogTitle>
          <DialogDescription>
            确定要撤销优惠券 <code className='rounded bg-muted px-1 py-0.5'>{couponNo}</code> 吗？撤销后将无法恢复。
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <Label>
              撤销原因 <span className='text-destructive'>*</span>
            </Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入撤销原因...'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => handleOpenChange(false)}>
            取消
          </Button>
          <Button
            variant='destructive'
            onClick={handleSubmit}
            disabled={!reason.trim() || submitting}
          >
            {submitting ? '撤销中...' : '确认撤销'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
