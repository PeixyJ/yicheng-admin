import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { DateTimePicker } from '@/components/shadcn-studio/date-picker/date-time-picker'
import { SwitchIconIndicator } from '@/components/shadcn-studio/switch/switch-icon-indicator'
import { NumberInput } from '@/components/shadcn-studio/input/number-input'
import { createPromoCode, updatePromoCode, getPromoCodeDetail } from '@/services/promo-code.ts'

const formSchema = z.object({
  code: z.string().min(1, '请输入优惠码').max(32, '优惠码最多32个字符').regex(/^[A-Z0-9]+$/, '优惠码只能包含大写字母和数字'),
  name: z.string().min(1, '请输入优惠码名称').max(100, '名称最多100个字符'),
  description: z.string().max(500, '描述最多500个字符').optional(),
  discountType: z.enum(['FIXED_AMOUNT', 'PERCENT', 'FREE_TRIAL'] as const),
  discountValue: z.number().min(0.01, '折扣值必须大于0'),
  currency: z.string().optional(),
  maxDiscountAmount: z.number().optional(),
  minOrderAmount: z.number().optional(),
  applicableProductType: z.enum(['ALL', 'SUBSCRIPTION', 'POINT'] as const),
  totalLimit: z.number().optional(),
  perUserLimit: z.number().optional(),
  perTeamLimit: z.number().optional(),
  startTime: z.string().min(1, '请选择开始时间'),
  endTime: z.string().min(1, '请选择结束时间'),
  isFirstOrderOnly: z.boolean().optional(),
  isNewUserOnly: z.boolean().optional(),
  metadata: z.string().max(2000, '扩展数据最多2000个字符').optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PromoCodeFormDialogProps {
  mode: 'create' | 'edit'
  promoCodeId?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PromoCodeFormDialog({
  mode,
  promoCodeId,
  open,
  onOpenChange,
  onSuccess,
}: PromoCodeFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      discountType: 'PERCENT',
      discountValue: 0,
      currency: 'usd',
      applicableProductType: 'ALL',
      startTime: '',
      endTime: '',
      isFirstOrderOnly: false,
      isNewUserOnly: false,
      metadata: '',
    },
  })

  const discountType = form.watch('discountType')

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && promoCodeId) {
        fetchPromoCodeDetail()
      } else {
        form.reset({
          code: '',
          name: '',
          description: '',
          discountType: 'PERCENT',
          discountValue: 0,
          currency: 'usd',
          applicableProductType: 'ALL',
          startTime: '',
          endTime: '',
          isFirstOrderOnly: false,
          isNewUserOnly: false,
          metadata: '',
        })
      }
    }
  }, [open, mode, promoCodeId])

  const fetchPromoCodeDetail = async () => {
    if (!promoCodeId) return
    setLoading(true)
    try {
      const res = await getPromoCodeDetail(promoCodeId)
      if (res.code === 'success') {
        const data = res.data
        form.reset({
          code: data.code,
          name: data.name,
          description: data.description || '',
          discountType: data.discountType,
          discountValue: data.discountValue,
          currency: data.currency || 'usd',
          maxDiscountAmount: data.maxDiscountAmount || undefined,
          minOrderAmount: data.minOrderAmount ? data.minOrderAmount / 100 : undefined,
          applicableProductType: data.applicableProductType,
          totalLimit: data.totalLimit || undefined,
          perUserLimit: data.perUserLimit || undefined,
          perTeamLimit: data.perTeamLimit || undefined,
          startTime: data.startTime || '',
          endTime: data.endTime || '',
          isFirstOrderOnly: data.isFirstOrderOnly,
          isNewUserOnly: data.isNewUserOnly,
          metadata: data.metadata || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch promo code detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const data = {
        ...values,
        description: values.description || undefined,
        currency: values.discountType === 'FIXED_AMOUNT' ? values.currency : undefined,
        maxDiscountAmount: values.discountType === 'PERCENT' ? values.maxDiscountAmount : undefined,
        minOrderAmount: values.minOrderAmount ? Math.round(values.minOrderAmount * 100) : undefined,
        totalLimit: values.totalLimit || undefined,
        perUserLimit: values.perUserLimit || undefined,
        perTeamLimit: values.perTeamLimit || undefined,
        metadata: values.metadata || undefined,
      }

      if (mode === 'create') {
        const res = await createPromoCode(data)
        if (res.code === 'success') {
          onOpenChange(false)
          onSuccess()
        }
      } else if (promoCodeId) {
        const { code: _code, ...updateData } = data
        const res = await updatePromoCode(promoCodeId, updateData)
        if (res.code === 'success') {
          onOpenChange(false)
          onSuccess()
        }
      }
    } catch (error) {
      console.error('Failed to save promo code:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '创建优惠码' : '编辑优惠码'}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className='space-y-4 py-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-4'>
              <div className='grid grid-cols-2 gap-4 items-start'>
                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>优惠码 *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='例如: SUMMER2024'
                          disabled={mode === 'edit'}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormDescription>大写字母和数字组合</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>名称 *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='内部管理用名称' />
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
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder='用户可见的优惠描述' rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-3 gap-4 items-start'>
                <FormField
                  control={form.control}
                  name='discountType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>折扣类型 *</FormLabel>
                      <Select onValueChange={field.onChange as (value: string) => void} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='选择折扣类型' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='FIXED_AMOUNT'>固定金额</SelectItem>
                          <SelectItem value='PERCENT'>百分比</SelectItem>
                          <SelectItem value='FREE_TRIAL'>免费试用</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='discountValue'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>折扣值 *</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.01'
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder={discountType === 'PERCENT' ? '百分比' : discountType === 'FREE_TRIAL' ? '天数' : '金额'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {discountType === 'FIXED_AMOUNT' && (
                  <FormField
                    control={form.control}
                    name='currency'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>货币</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='选择货币' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='usd'>USD</SelectItem>
                            <SelectItem value='cny'>CNY</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {discountType === 'PERCENT' && (
                  <FormField
                    control={form.control}
                    name='maxDiscountAmount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>最大折扣金额</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            placeholder='可选'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='applicableProductType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>适用产品类型 *</FormLabel>
                      <Select onValueChange={field.onChange as (value: string) => void} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='选择适用类型' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='ALL'>全部</SelectItem>
                          <SelectItem value='SUBSCRIPTION'>订阅</SelectItem>
                          <SelectItem value='POINT'>积分</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='minOrderAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>最低订单金额（元）</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder='可选'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='totalLimit'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>总使用限制</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          minValue={0}
                          placeholder='不限'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='perUserLimit'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>每用户限制</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          minValue={0}
                          placeholder='不限'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='perTeamLimit'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>每团队限制</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          minValue={0}
                          placeholder='不限'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='startTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>开始时间 *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='选择开始日期'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='endTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>结束时间 *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='选择结束日期'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='isFirstOrderOnly'
                  render={({ field }) => (
                    <FormItem className='flex items-center justify-between rounded-lg border p-3'>
                      <FormLabel className='font-normal'>仅限首单</FormLabel>
                      <FormControl>
                        <SwitchIconIndicator
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label='仅限首单'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='isNewUserOnly'
                  render={({ field }) => (
                    <FormItem className='flex items-center justify-between rounded-lg border p-3'>
                      <FormLabel className='font-normal'>仅限新用户</FormLabel>
                      <FormControl>
                        <SwitchIconIndicator
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label='仅限新用户'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='metadata'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>扩展数据</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder='JSON格式的扩展数据' rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-3 pt-4'>
                <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                  取消
                </Button>
                <Button type='submit' disabled={submitting}>
                  {submitting ? '保存中...' : '保存'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
