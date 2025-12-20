import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { upgradeSubscribe } from '@/services/subscribe'
import type { AdminSubscribeVO } from '@/types/subscribe'

const formSchema = z.object({
  newSubscribePlanId: z.number().min(1, '请输入新订阅计划ID'),
  reason: z.string().min(1, '请输入升级理由').max(500, '理由最多500个字符'),
})

type FormValues = z.infer<typeof formSchema>

interface UpgradeSubscribeDialogProps {
  subscribe: AdminSubscribeVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UpgradeSubscribeDialog({
  subscribe,
  open,
  onOpenChange,
  onSuccess,
}: UpgradeSubscribeDialogProps) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newSubscribePlanId: undefined,
      reason: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    if (!subscribe) return

    setSubmitting(true)
    try {
      const res = await upgradeSubscribe({
        subscribeId: subscribe.id,
        newSubscribePlanId: values.newSubscribePlanId,
        reason: values.reason,
      })
      if (res.code === 'success') {
        onOpenChange(false)
        form.reset()
        onSuccess?.()
      }
    } catch (error) {
      console.error('Failed to upgrade subscribe:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>升级订阅</DialogTitle>
          <DialogDescription>
            将订阅 #{subscribe?.id} 升级到新的计划
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='rounded-lg border bg-muted/50 p-3 text-sm'>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <span className='text-muted-foreground'>当前计划：</span>
                  <span className='font-medium'>{subscribe?.planCode || '-'}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>团队ID：</span>
                  <span className='font-medium'>{subscribe?.teamId}</span>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name='newSubscribePlanId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新订阅计划ID *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='输入新订阅计划ID'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>升级理由 *</FormLabel>
                  <FormControl>
                    <Textarea placeholder='请输入升级理由...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type='submit' disabled={submitting}>
                {submitting ? '升级中...' : '确认升级'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
