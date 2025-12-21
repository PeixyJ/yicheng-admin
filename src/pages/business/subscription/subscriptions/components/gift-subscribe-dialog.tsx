import { useState, useEffect, useRef, useCallback } from 'react'
import { Gift, Loader2 } from 'lucide-react'
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
  DialogTrigger,
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
import { NumberInput } from '@/components/shadcn-studio/input/number-input'
import { AlertError } from '@/components/shadcn-studio/alert'
import { giftSubscribe } from '@/services/subscribe'
import { getTeamList } from '@/services/team'
import { getPlanList } from '@/services/plan'
import { BusinessError } from '@/types/api'
import type { AdminTeamVO } from '@/types/team'
import type { SubscribePlanVO } from '@/types/plan'

const formSchema = z.object({
  teamId: z.number().min(1, '请选择团队'),
  subscribePlanId: z.number().min(1, '请选择订阅计划'),
  seats: z.number().min(1, '席位数至少为1'),
  reason: z.string().min(1, '请输入赠送理由').max(500, '理由最多500个字符'),
})

type FormValues = z.infer<typeof formSchema>

interface GiftSubscribeDialogProps {
  onSuccess?: () => void
}

const PAGE_SIZE = 10

export function GiftSubscribeDialog({ onSuccess }: GiftSubscribeDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Team state
  const [teams, setTeams] = useState<AdminTeamVO[]>([])
  const [teamLoading, setTeamLoading] = useState(false)
  const [teamLoadingMore, setTeamLoadingMore] = useState(false)
  const [teamPage, setTeamPage] = useState(1)
  const [teamHasMore, setTeamHasMore] = useState(true)
  const teamLoadMoreRef = useRef<HTMLDivElement>(null)

  // Plan state
  const [plans, setPlans] = useState<SubscribePlanVO[]>([])
  const [planLoading, setPlanLoading] = useState(false)
  const [planLoadingMore, setPlanLoadingMore] = useState(false)
  const [planPage, setPlanPage] = useState(1)
  const [planHasMore, setPlanHasMore] = useState(true)
  const planLoadMoreRef = useRef<HTMLDivElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamId: undefined,
      subscribePlanId: undefined,
      seats: 1,
      reason: '',
    },
  })

  // Load teams
  const loadTeams = useCallback(async (pageNum: number, append = false) => {
    if (pageNum === 1) {
      setTeamLoading(true)
    } else {
      setTeamLoadingMore(true)
    }

    try {
      const res = await getTeamList({
        page: pageNum,
        size: PAGE_SIZE,
      })
      if (res.code === 'success') {
        const newTeams = res.data.records
        if (append) {
          setTeams((prev) => [...prev, ...newTeams])
        } else {
          setTeams(newTeams)
        }
        setTeamHasMore(pageNum < res.data.pages)
        setTeamPage(pageNum)
      }
    } catch (err) {
      console.error('Failed to load teams:', err)
    } finally {
      setTeamLoading(false)
      setTeamLoadingMore(false)
    }
  }, [])

  // Load plans
  const loadPlans = useCallback(async (pageNum: number, append = false) => {
    if (pageNum === 1) {
      setPlanLoading(true)
    } else {
      setPlanLoadingMore(true)
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
        setPlanHasMore(pageNum < res.data.pages)
        setPlanPage(pageNum)
      }
    } catch (err) {
      console.error('Failed to load plans:', err)
    } finally {
      setPlanLoading(false)
      setPlanLoadingMore(false)
    }
  }, [])

  // Load data when dialog opens
  useEffect(() => {
    if (open) {
      setTeams([])
      setTeamPage(1)
      setTeamHasMore(true)
      setPlans([])
      setPlanPage(1)
      setPlanHasMore(true)
      setError(null)
      loadTeams(1)
      loadPlans(1)
      form.reset()
    }
  }, [open, loadTeams, loadPlans, form])

  // IntersectionObserver for team infinite scroll
  useEffect(() => {
    const loadMoreElement = teamLoadMoreRef.current
    if (!loadMoreElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && teamHasMore && !teamLoadingMore) {
          loadTeams(teamPage + 1, true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreElement)
    return () => observer.disconnect()
  }, [teamHasMore, teamLoadingMore, teamPage, loadTeams])

  // IntersectionObserver for plan infinite scroll
  useEffect(() => {
    const loadMoreElement = planLoadMoreRef.current
    if (!loadMoreElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && planHasMore && !planLoadingMore) {
          loadPlans(planPage + 1, true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreElement)
    return () => observer.disconnect()
  }, [planHasMore, planLoadingMore, planPage, loadPlans])

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await giftSubscribe({
        teamId: values.teamId,
        subscribePlanId: values.subscribePlanId,
        seats: values.seats,
        reason: values.reason,
      })
      if (res.code === 'success') {
        setOpen(false)
        form.reset()
        onSuccess?.()
      }
    } catch (err) {
      console.error('Failed to gift subscribe:', err)
      if (err instanceof BusinessError) {
        setError(err.message)
      } else {
        setError('赠送失败，请稍后重试')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Gift className='mr-2 size-4' />
          赠送订阅
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>赠送订阅</DialogTitle>
          <DialogDescription>为团队赠送订阅计划</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {error && <AlertError message={error} />}
            <FormField
              control={form.control}
              name='teamId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>团队 *</FormLabel>
                  <Select
                    value={field.value?.toString() || ''}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={teamLoading ? '加载中...' : '请选择团队'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='max-h-[200px]'>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          <span className='flex items-center gap-2'>
                            <span>{team.name}</span>
                            <span className='text-muted-foreground text-xs'>
                              ({team.teamCode})
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                      {teamHasMore && (
                        <div ref={teamLoadMoreRef} className='h-1' />
                      )}
                      {teamLoadingMore && (
                        <div className='flex items-center justify-center py-2'>
                          <Loader2 className='size-4 animate-spin text-muted-foreground' />
                          <span className='ml-2 text-sm text-muted-foreground'>加载更多...</span>
                        </div>
                      )}
                      {!teamHasMore && teams.length > 0 && (
                        <div className='py-2 text-center text-xs text-muted-foreground'>
                          已加载全部
                        </div>
                      )}
                      {!teamLoading && teams.length === 0 && (
                        <div className='py-2 text-center text-sm text-muted-foreground'>
                          暂无团队
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
              name='subscribePlanId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>订阅计划 *</FormLabel>
                  <Select
                    value={field.value?.toString() || ''}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder={planLoading ? '加载中...' : '请选择订阅计划'} />
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
                      {planHasMore && (
                        <div ref={planLoadMoreRef} className='h-1' />
                      )}
                      {planLoadingMore && (
                        <div className='flex items-center justify-center py-2'>
                          <Loader2 className='size-4 animate-spin text-muted-foreground' />
                          <span className='ml-2 text-sm text-muted-foreground'>加载更多...</span>
                        </div>
                      )}
                      {!planHasMore && plans.length > 0 && (
                        <div className='py-2 text-center text-xs text-muted-foreground'>
                          已加载全部
                        </div>
                      )}
                      {!planLoading && plans.length === 0 && (
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
              name='seats'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>席位数 *</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value}
                      onChange={field.onChange}
                      minValue={1}
                      placeholder='1'
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
                  <FormLabel>赠送理由 *</FormLabel>
                  <FormControl>
                    <Textarea placeholder='请输入赠送理由...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button type='submit' disabled={submitting}>
                {submitting ? '赠送中...' : '确认赠送'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
