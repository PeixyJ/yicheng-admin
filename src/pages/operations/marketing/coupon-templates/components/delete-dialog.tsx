import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx'
import { deleteCouponTemplate } from '@/services/coupon-template.ts'

interface DeleteDialogProps {
  templateId: number | null
  templateName: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteDialog({
  templateId,
  templateName,
  open,
  onOpenChange,
  onSuccess,
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!templateId) return
    setLoading(true)
    try {
      const res = await deleteCouponTemplate(templateId)
      if (res.code === 'success') {
        onOpenChange(false)
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to delete template:', error)
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
            确定要删除优惠券模板「{templateName}」吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={loading}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {loading && <Loader2 className='mr-2 size-4 animate-spin' />}
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
