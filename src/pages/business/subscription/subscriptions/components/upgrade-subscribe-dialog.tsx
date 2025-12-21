import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertError } from '@/components/shadcn-studio/alert'
import { upgradeSubscribe } from '@/services/subscribe'
import { getPlanList } from '@/services/plan'
import type { AdminSubscribeVO } from '@/types/subscribe'
import { BusinessError } from '@/types/api'
import type { SubscribePlanVO } from '@/types/plan'

const formSchema = z.object({
  newSubscribePlanId: z.number().min(1, '请选择新订阅计划'),
  reason: z.string().min(1, '请输入升级理由').max(500, '理由最多500个字符'),
})

type FormValues = z.infer<typeof formSchema>

interface UpgradeSubscribeDialogProps {
  subscribe: AdminSubscribeVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const PAGE_SIZE = 10

export function UpgradeSubscribeDialog({
  subscribe,
  open,
  onOpenChange,
  onSuccess,
}: UpgradeSubscribeDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [plans, setPlans] = useState<SubscribePlanVO[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newSubscribePlanId: undefined,
      reason: '',
    },
  })

  const loadPlans = useCallback(async (pageNum: number, append = false) => {
    if (pageNum === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const res = await getPlanList({
        page: pageNum,
        size: PAGE_SIZE,
        status: true,
      })
      if (res.code === 'success') {
        const newPlans = res.data.records
        if (append) {
          setPlans((prev) => [...prev, ...newPlans])
        } else {
          setPlans(newPlans)
        }
        setHasMore(pageNum < res.data.pages)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Failed to load plans:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setPlans([])
      setPage(1)
      setHasMore(true)
      loadPlans(1)
      form.reset()
    }
  }, [open, loadPlans, form])

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current
    if (!loadMoreElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !loadingMore) {
          loadPlans(page + 1, true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreElement)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, page, loadPlans])

  const onSubmit = async (values: FormValues) => {
    if (!subscribe) return

    setSubmitting(true)
    setError(null)
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
    } catch (err) {
      console.error('Failed to upgrade subscribe:', err)
      if (err instanceof BusinessError) {
        setError(err.message)
      } else {
        setError('升级失败，请稍后重试')
      }
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
            {error && <AlertError message={error} />}
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
                  <FormLabel>新订阅计划 *</FormLabel>
                  <Select
                    value={field.value?.toString() || ''}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={loading ? '加载中...' : '请选择订阅计划'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='max-h-[200px]'>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          <span className='flex items-center gap-2'>
                            <span>{plan.planName}</span>
                            <span className='text-muted-foreground text-xs'>
                              ({plan.planCode})
                            </span>
                            {plan.price > 0 && (
                              <span className='text-muted-foreground text-xs'>
                                ¥{plan.price}
                              </span>
                            )}
                          </span>
                        </SelectItem>
                      ))}
                      {/* Invisible trigger for loading more */}
                      {hasMore && (
                        <div ref={loadMoreRef} className='h-1' />
                      )}
                      {loadingMore && (
                        <div className='flex items-center justify-center py-2'>
                          <Loader2 className='size-4 animate-spin text-muted-foreground' />
                          <span className='ml-2 text-sm text-muted-foreground'>加载更多...</span>
                        </div>
                      )}
                      {!hasMore && plans.length > 0 && (
                        <div className='py-2 text-center text-xs text-muted-foreground'>
                          已加载全部
                        </div>
                      )}
                      {!loading && plans.length === 0 && (
                        <div className='py-2 text-center text-sm text-muted-foreground'>
                          暂无可用计划
                        </div>
                      )}
                    </SelectContent>
                  </Select>
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
