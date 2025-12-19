import { useState } from 'react'
import { CircleHelp, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { createPlan } from '@/services/plan'
import type { PlanType } from '@/types/plan'

const formSchema = z.object({
  planCode: z
    .string()
    .min(1, '请输入计划编码')
    .max(50, '计划编码最多50个字符')
    .regex(/^[A-Z][A-Z0-9_]*$/, '计划编码必须以大写字母开头，只能包含大写字母、数字和下划线'),
  planName: z.string().min(1, '请输入计划名称').max(100, '计划名称最多100个字符'),
  planLevel: z.number().min(0, '计划等级不能小于0'),
  planType: z.enum(['FREE', 'TRIAL', 'PAID'] as const),
  description: z.string().max(500, '描述最多500个字符').optional(),
  price: z.number().min(0, '价格不能小于0'),
  originalPrice: z.number().min(0, '原价不能小于0').optional(),
  currency: z.enum(['CNY', 'USD'] as const),
  durationDays: z.number().min(1, '有效期至少1天').optional(),
  dailyQuota: z.number().min(0, '每日配额不能小于0').optional(),
  monthlyQuota: z.number().min(0, '每月配额不能小于0').optional(),
  sortOrder: z.number().min(0, '排序序号不能小于0').optional(),
  isTrial: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  status: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreatePlanDialogProps {
  onSuccess?: () => void
}

export function CreatePlanDialog({ onSuccess }: CreatePlanDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planCode: '',
      planName: '',
      planLevel: 0,
      planType: 'PAID',
      description: '',
      price: 0,
      originalPrice: undefined,
      currency: 'CNY',
      durationDays: undefined,
      dailyQuota: undefined,
      monthlyQuota: undefined,
      sortOrder: 0,
      isTrial: false,
      isVisible: true,
      status: true,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const res = await createPlan({
        planCode: values.planCode,
        planName: values.planName,
        planLevel: values.planLevel,
        planType: values.planType as PlanType,
        description: values.description || undefined,
        price: values.price,
        originalPrice: values.originalPrice,
        currency: values.currency,
        durationDays: values.durationDays,
        dailyQuota: values.dailyQuota,
        monthlyQuota: values.monthlyQuota,
        sortOrder: values.sortOrder,
        isTrial: values.isTrial,
        isVisible: values.isVisible,
        status: values.status,
      })
      if (res.code === 'success') {
        setOpen(false)
        form.reset()
        onSuccess?.()
      }
    } catch (error) {
      console.error('Failed to create plan:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 size-4' />
          新建计划
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>新建订阅计划</DialogTitle>
          <DialogDescription>创建一个新的订阅计划</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* 基本信息 */}
            <div className='space-y-4'>
              <h4 className='text-sm font-medium'>基本信息</h4>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='planCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        计划编码 *
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CircleHelp className='size-3.5 text-muted-foreground cursor-help' />
                          </TooltipTrigger>
                          <TooltipContent>
                            大写字母开头，只能包含大写字母、数字和下划线
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='如：BASIC_MONTHLY' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='planName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>计划名称 *</FormLabel>
                      <FormControl>
                        <Input placeholder='如：基础月付版' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='planType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>计划类型 *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='选择类型' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='FREE'>免费版</SelectItem>
                          <SelectItem value='TRIAL'>试用版</SelectItem>
                          <SelectItem value='PAID'>付费版</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='planLevel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        计划等级 *
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CircleHelp className='size-3.5 text-muted-foreground cursor-help' />
                          </TooltipTrigger>
                          <TooltipContent>数值越大等级越高</TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          minValue={0}
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>计划描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder='计划详细描述...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 价格信息 */}
            <div className='space-y-4'>
              <h4 className='text-sm font-medium'>价格信息</h4>
              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>销售价格 *</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          minValue={0}
                          step={0.1}
                          placeholder='0.00'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='originalPrice'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        原价
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CircleHelp className='size-3.5 text-muted-foreground cursor-help' />
                          </TooltipTrigger>
                          <TooltipContent>用于展示划线价</TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          minValue={0}
                          step={0.1}
                          placeholder='0.00'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='currency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>货币类型 *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='选择货币' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='CNY'>人民币 (CNY)</SelectItem>
                          <SelectItem value='USD'>美元 (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 订阅配置 */}
            <div className='space-y-4'>
              <h4 className='text-sm font-medium'>订阅配置</h4>
              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='durationDays'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        有效天数
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CircleHelp className='size-3.5 text-muted-foreground cursor-help' />
                          </TooltipTrigger>
                          <TooltipContent>空表示永久</TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          minValue={0}
                          placeholder='不限制'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='dailyQuota'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>每日配额</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          minValue={0}
                          placeholder='不限制'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='monthlyQuota'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>每月配额</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          minValue={0}
                          placeholder='不限制'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 显示设置 */}
            <div className='space-y-4'>
              <h4 className='text-sm font-medium'>显示设置</h4>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='sortOrder'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        排序序号
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CircleHelp className='size-3.5 text-muted-foreground cursor-help' />
                          </TooltipTrigger>
                          <TooltipContent>数值越小越靠前</TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          minValue={0}
                          placeholder='0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex flex-wrap gap-6'>
                <FormField
                  control={form.control}
                  name='isTrial'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className='!mt-0'>试用计划</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='isVisible'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className='!mt-0'>定价页可见</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className='!mt-0'>启用状态</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button type='submit' disabled={submitting}>
                {submitting ? '创建中...' : '创建'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
