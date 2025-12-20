import { useState, useEffect } from 'react'
import { XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { cancelOrder } from '@/services/payment-order'
import type { AdminPaymentOrderDetailVO } from '@/types/payment-order'

interface CancelDialogProps {
  order: AdminPaymentOrderDetailVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CancelDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: CancelDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setReason('')
    }
  }, [open])

  const handleSubmit = async () => {
    if (!order) return

    setSubmitting(true)
    try {
      const response = await cancelOrder(order.id, reason.trim() || undefined)
      if (response.code === 'success') {
        onOpenChange(false)
        onSuccess?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10'>
              <XCircle className='h-5 w-5 text-amber-500' />
            </div>
            取消订单
          </DialogTitle>
          <DialogDescription>
            确定要取消此订单吗？此操作不可撤销。
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label>订单号</Label>
            <Input
              className='mt-1.5'
              value={order?.orderNo ?? ''}
              disabled
            />
          </div>
          <div>
            <Label>订单金额</Label>
            <Input
              className='mt-1.5'
              value={order?.amountFormatted ?? ''}
              disabled
            />
          </div>
          <div>
            <Label>取消原因</Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入取消原因（可选）'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            返回
          </Button>
          <Button
            variant='destructive'
            onClick={handleSubmit}
            disabled={submitting}
          >
            确认取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
