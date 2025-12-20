import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cancelSubscribe } from '@/services/subscribe'
import type { AdminSubscribeVO } from '@/types/subscribe'

interface CancelSubscribeDialogProps {
  subscribe: AdminSubscribeVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CancelSubscribeDialog({
  subscribe,
  open,
  onOpenChange,
  onSuccess,
}: CancelSubscribeDialogProps) {
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!subscribe) return

    setSubmitting(true)
    try {
      const res = await cancelSubscribe({
        subscribeId: subscribe.id,
      })
      if (res.code === 'success') {
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      console.error('Failed to cancel subscribe:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认取消订阅</AlertDialogTitle>
          <AlertDialogDescription>
            确定要取消订阅 #{subscribe?.id} 吗？此操作无法撤销。
            <div className='mt-2 rounded-lg border bg-muted/50 p-3 text-sm'>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <span className='text-muted-foreground'>计划：</span>
                  <span className='font-medium'>{subscribe?.planCode || '-'}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>团队ID：</span>
                  <span className='font-medium'>{subscribe?.teamId}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>席位：</span>
                  <span className='font-medium'>{subscribe?.seats}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>结束时间：</span>
                  <span className='font-medium'>{subscribe?.endTime || '永久'}</span>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={submitting}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {submitting ? '取消中...' : '确认取消'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
