import { useState } from 'react'
import { Gift } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { NumberInput } from '@/components/shadcn-studio/input/number-input'
import { giftSubscribe } from '@/services/subscribe'

const formSchema = z.object({
  teamId: z.number().min(1, '请输入团队ID'),
  subscribePlanId: z.number().min(1, '请输入订阅计划ID'),
  seats: z.number().min(1, '席位数至少为1'),
  reason: z.string().min(1, '请输入赠送理由').max(500, '理由最多500个字符'),
})

type FormValues = z.infer<typeof formSchema>

interface GiftSubscribeDialogProps {
  onSuccess?: () => void
}

export function GiftSubscribeDialog({ onSuccess }: GiftSubscribeDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamId: undefined,
      subscribePlanId: undefined,
      seats: 1,
      reason: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
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
    } catch (error) {
      console.error('Failed to gift subscribe:', error)
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
            <FormField
              control={form.control}
              name='teamId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>团队ID *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='输入团队ID'
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
              name='subscribePlanId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>订阅计划ID *</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='输入订阅计划ID'
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
