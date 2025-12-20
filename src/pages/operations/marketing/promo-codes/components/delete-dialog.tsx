import { useState } from 'react'
import { Trash2 } from 'lucide-react'

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
import { deletePromoCode } from '@/services/promo-code.ts'

interface DeleteDialogProps {
  promoCodeId: number | null
  promoCode: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteDialog({
  promoCodeId,
  promoCode,
  open,
  onOpenChange,
  onSuccess,
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!promoCodeId) return

    setLoading(true)
    try {
      const res = await deletePromoCode(promoCodeId)
      if (res.code === 'success') {
        onOpenChange(false)
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to delete promo code:', error)
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
            确定要删除优惠码 <span className='font-mono font-medium'>{promoCode}</span> 吗？此操作不可撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {loading ? (
              '删除中...'
            ) : (
              <>
                <Trash2 className='mr-2 size-4' />
                删除
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
