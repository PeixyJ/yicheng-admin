import { useState } from 'react'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteTemplate } from '@/services/notification-template'
import type { NotificationTemplateVO } from '@/types/notification-template'

interface DeleteTemplateDialogProps {
  template: NotificationTemplateVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteTemplateDialog({
  template,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTemplateDialogProps) {
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    if (!template) return

    setSubmitting(true)
    try {
      const response = await deleteTemplate(template.id)
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
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10'>
              <Trash2 className='h-5 w-5 text-destructive' />
            </div>
            删除模板
          </DialogTitle>
          <DialogDescription>
            确定要删除模板{' '}
            <code className='rounded bg-muted px-1 py-0.5'>{template?.code}</code>
            {' '}（{template?.name}）吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? '删除中...' : '确认删除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
