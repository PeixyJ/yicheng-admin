import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

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
import { retryPaymentEvent } from '@/services/payment-event'

interface RetryDialogProps {
  eventId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function RetryDialog({
  eventId,
  open,
  onOpenChange,
  onSuccess,
}: RetryDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleRetry = async () => {
    if (!eventId) return

    setLoading(true)
    try {
      const res = await retryPaymentEvent(eventId)
      if (res.code === 'success') {
        onOpenChange(false)
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to retry event:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认重试</AlertDialogTitle>
          <AlertDialogDescription>
            确定要重试处理此事件吗？系统将尝试重新处理该Webhook事件。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleRetry} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className='mr-2 size-4 animate-spin' />
                重试中...
              </>
            ) : (
              '确认重试'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
