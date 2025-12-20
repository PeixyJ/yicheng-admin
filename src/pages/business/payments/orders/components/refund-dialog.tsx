import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

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

import { refundOrder } from '@/services/payment-order'
import type { AdminPaymentOrderDetailVO } from '@/types/payment-order'

interface RefundDialogProps {
  order: AdminPaymentOrderDetailVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RefundDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: RefundDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [refundAmount, setRefundAmount] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open && order) {
      // 默认设置为可退金额
      setRefundAmount((order.refundableAmount / 100).toFixed(2))
      setReason('')
    }
  }, [open, order])

  const handleSubmit = async () => {
    if (!order) return

    setSubmitting(true)
    try {
      // 转换为分
      const amountInCents = refundAmount ? Math.round(parseFloat(refundAmount) * 100) : undefined

      const response = await refundOrder({
        orderId: order.id,
        refundAmount: amountInCents,
        reason: reason.trim() || undefined,
      })
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

  const maxRefundAmount = order ? order.refundableAmount / 100 : 0
  const currentAmount = parseFloat(refundAmount) || 0
  const isValidAmount = currentAmount > 0 && currentAmount <= maxRefundAmount

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10'>
              <RefreshCw className='h-5 w-5 text-destructive' />
            </div>
            订单退款
          </DialogTitle>
          <DialogDescription>
            订单号：{order?.orderNo}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label>订单金额</Label>
            <Input
              className='mt-1.5'
              value={order?.amountFormatted ?? ''}
              disabled
            />
          </div>
          <div>
            <Label>已退金额</Label>
            <Input
              className='mt-1.5'
              value={order?.amountRefundedFormatted ?? ''}
              disabled
            />
          </div>
          <div>
            <Label>可退金额</Label>
            <Input
              className='mt-1.5'
              value={order ? `${order.currencySymbol}${maxRefundAmount.toFixed(2)}` : ''}
              disabled
            />
          </div>
          <div>
            <Label>退款金额 <span className='text-destructive'>*</span></Label>
            <div className='relative mt-1.5'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                {order?.currencySymbol}
              </span>
              <Input
                type='number'
                placeholder='留空则全额退款'
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className='pl-8'
                step='0.01'
                min='0.01'
                max={maxRefundAmount}
              />
            </div>
            {refundAmount && !isValidAmount && (
              <p className='mt-1 text-sm text-destructive'>
                退款金额需大于0且不超过可退金额
              </p>
            )}
          </div>
          <div>
            <Label>退款原因</Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入退款原因（可选）'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            variant='destructive'
            onClick={handleSubmit}
            disabled={!isValidAmount || submitting}
          >
            确认退款
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
