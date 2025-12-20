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
import { deleteNotification } from '@/services/notification'
import type { NotificationVO } from '@/types/notification'

interface DeleteNotificationDialogProps {
  notification: NotificationVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteNotificationDialog({
  notification,
  open,
  onOpenChange,
  onSuccess,
}: DeleteNotificationDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!notification) return

    setLoading(true)
    try {
      const res = await deleteNotification(notification.id)
      if (res.code === 'success') {
        onOpenChange(false)
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除通知「{notification?.title}」吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {loading ? '删除中...' : '删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
