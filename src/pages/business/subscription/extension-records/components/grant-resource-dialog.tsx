import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Gift, HelpCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { NumberInput } from '@/components/shadcn-studio/input/number-input'
import { grantResourceExtension } from '@/services/resource-pack'
import type { ResourceType } from '@/types/resource-pack'

const formSchema = z.object({
  teamId: z.number().min(1, '请输入团队ID'),
  resourceType: z.enum(['PROJECT', 'MEMBER', 'STORAGE'] as const),
  amount: z.number().min(1, '资源数量必须大于0'),
  durationDays: z.number().min(0, '有效天数不能小于0').optional(),
  packId: z.number().optional(),
  grantReason: z.string().min(1, '请输入赠送原因'),
})

type FormValues = z.infer<typeof formSchema>

interface GrantResourceDialogProps {
  onSuccess?: () => void
}

export function GrantResourceDialog({ onSuccess }: GrantResourceDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamId: undefined,
      resourceType: undefined,
      amount: 1,
      durationDays: undefined,
      packId: undefined,
      grantReason: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const res = await grantResourceExtension({
        teamId: values.teamId,
        resourceType: values.resourceType as ResourceType,
        amount: values.amount,
        durationDays: values.durationDays,
        packId: values.packId,
        grantReason: values.grantReason,
      })
      if (res.code === 'success') {
        setOpen(false)
        form.reset()
        onSuccess?.()
      }
    } catch (error) {
      console.error('Failed to grant resource:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Gift className='mr-2 size-4' />
          赠送资源
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-lg' onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>赠送资源</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* 团队ID */}
            <FormField
              control={form.control}
              name='teamId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>团队ID</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      minValue={1}
                      step={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              {/* 资源类型 */}
              <FormField
                control={form.control}
                name='resourceType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>资源类型</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='选择资源类型' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='PROJECT'>项目数</SelectItem>
                        <SelectItem value='MEMBER'>成员数</SelectItem>
                        <SelectItem value='STORAGE'>存储空间</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 资源数量 */}
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>资源数量</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                        minValue={1}
                        step={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {/* 有效天数 */}
              <FormField
                control={form.control}
                name='durationDays'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-1'>
                      有效天数
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className='size-3.5 text-muted-foreground cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent>留空或为0表示永久有效</TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value ?? 0}
                        onChange={(v) => field.onChange(v || undefined)}
                        minValue={0}
                        step={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 关联资源包ID */}
              <FormField
                control={form.control}
                name='packId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-1'>
                      关联资源包ID
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className='size-3.5 text-muted-foreground cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent>可选，关联已有的资源包</TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value ?? 0}
                        onChange={(v) => field.onChange(v || undefined)}
                        minValue={0}
                        step={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 赠送原因 */}
            <FormField
              control={form.control}
              name='grantReason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>赠送原因</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='请输入赠送原因...'
                      className='resize-none'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-3 pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                取消
              </Button>
              <Button type='submit' disabled={submitting}>
                {submitting ? '赠送中...' : '确认赠送'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
