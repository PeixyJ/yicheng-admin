import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import {
  getCouponTemplateDetail,
  createCouponTemplate,
  updateCouponTemplate,
} from '@/services/coupon-template.ts'

const formSchema = z.object({
  name: z.string().min(1, '请输入模板名称'),
  description: z.string().max(500, '描述最多500个字符').optional(),
  discountType: z.enum(['FIXED_AMOUNT', 'PERCENT', 'FREE_TRIAL'] as const),
  discountValue: z.number().min(0, '折扣值不能为负'),
  currency: z.string().optional(),
  maxDiscountAmount: z.number().optional(),
  minOrderAmount: z.number().optional(),
  applicableProductType: z.enum(['ALL', 'SUBSCRIPTION', 'POINT'] as const),
  validDays: z.number().min(1, '有效天数至少为1天'),
  totalQuantity: z.number().optional(),
  perTeamLimit: z.number().optional(),
  perUserLimit: z.number().optional(),
  metadata: z.string().max(2000, '扩展数据最多2000个字符').optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TemplateFormDialogProps {
  mode: 'create' | 'edit'
  templateId?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const DISCOUNT_TYPE_OPTIONS = [
  { value: 'FIXED_AMOUNT', label: '固定金额' },
  { value: 'PERCENT', label: '百分比' },
  { value: 'FREE_TRIAL', label: '免费试用' },
]

const APPLICABLE_PRODUCT_TYPE_OPTIONS = [
  { value: 'ALL', label: '全部产品' },
  { value: 'SUBSCRIPTION', label: '订阅' },
  { value: 'POINT', label: '点数' },
]

export function TemplateFormDialog({
  mode,
  templateId,
  open,
  onOpenChange,
  onSuccess,
}: TemplateFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      discountType: 'FIXED_AMOUNT',
      discountValue: 0,
      currency: 'usd',
      maxDiscountAmount: undefined,
      minOrderAmount: undefined,
      applicableProductType: 'ALL',
      validDays: 30,
      totalQuantity: undefined,
      perTeamLimit: undefined,
      perUserLimit: undefined,
      metadata: '',
    },
  })

  const discountType = form.watch('discountType')

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && templateId) {
        fetchTemplateDetail()
      } else {
        form.reset({
          name: '',
          description: '',
          discountType: 'FIXED_AMOUNT',
          discountValue: 0,
          currency: 'usd',
          maxDiscountAmount: undefined,
          minOrderAmount: undefined,
          applicableProductType: 'ALL',
          validDays: 30,
          totalQuantity: undefined,
          perTeamLimit: undefined,
          perUserLimit: undefined,
          metadata: '',
        })
      }
    }
  }, [open, mode, templateId])

  const fetchTemplateDetail = async () => {
    if (!templateId) return
    setLoading(true)
    try {
      const res = await getCouponTemplateDetail(templateId)
      if (res.code === 'success') {
        const template = res.data
        form.reset({
          name: template.name,
          description: template.description || '',
          discountType: template.discountType,
          discountValue: template.discountValue,
          currency: template.currency || 'usd',
          maxDiscountAmount: template.maxDiscountAmount ?? undefined,
          minOrderAmount: template.minOrderAmount ? template.minOrderAmount / 100 : undefined,
          applicableProductType: template.applicableProductType,
          validDays: template.validDays,
          totalQuantity: template.totalQuantity ?? undefined,
          perTeamLimit: template.perTeamLimit ?? undefined,
          perUserLimit: template.perUserLimit ?? undefined,
          metadata: template.metadata || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch template detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const data = {
        name: values.name,
        description: values.description || undefined,
        discountType: values.discountType,
        discountValue: values.discountValue,
        applicableProductType: values.applicableProductType,
        validDays: values.validDays,
        currency: values.discountType === 'FIXED_AMOUNT' && values.currency ? values.currency : undefined,
        maxDiscountAmount: values.discountType === 'PERCENT' && values.maxDiscountAmount ? values.maxDiscountAmount : undefined,
        minOrderAmount: values.minOrderAmount ? Math.round(values.minOrderAmount * 100) : undefined,
        totalQuantity: values.totalQuantity || undefined,
        perTeamLimit: values.perTeamLimit || undefined,
        perUserLimit: values.perUserLimit || undefined,
        metadata: values.metadata || undefined,
      }

      if (mode === 'create') {
        const res = await createCouponTemplate(data)
        if (res.code === 'success') {
          onOpenChange(false)
          onSuccess()
        }
      } else if (templateId) {
        const res = await updateCouponTemplate(templateId, data)
        if (res.code === 'success') {
          onOpenChange(false)
          onSuccess()
        }
      }
    } catch (error) {
      console.error('Failed to save template:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? '编辑优惠券模板' : '创建优惠券模板'}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className='space-y-4 py-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
        ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>模板名称</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入模板名称（内部管理用）' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>优惠描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder='请输入优惠描述（用户可见）' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='discountType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>折扣类型</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='请选择折扣类型' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DISCOUNT_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
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
                    <FormLabel>折扣值</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder={
                          discountType === 'PERCENT'
                            ? '百分比（1-100）'
                            : discountType === 'FREE_TRIAL'
                            ? '试用天数'
                            : '金额'
                        }
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      {discountType === 'PERCENT' && '输入百分比，如：10 表示 10% 折扣'}
                      {discountType === 'FREE_TRIAL' && '输入免费试用天数'}
                      {discountType === 'FIXED_AMOUNT' && '输入折扣金额'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {discountType === 'FIXED_AMOUNT' && (
              <FormField
                control={form.control}
                name='currency'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>货币类型</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='请选择货币类型' />
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
                        placeholder='请输入最大折扣金额（可选）'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>限制百分比折扣的最大金额</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name='minOrderAmount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>最低订单金额（元）</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='请输入最低订单金额（可选）'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>订单金额需达到此值才能使用优惠券</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='applicableProductType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>适用产品类型</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='请选择适用产品类型' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APPLICABLE_PRODUCT_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='validDays'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>有效天数</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='请输入有效天数'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>优惠券发放后的有效期</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='totalQuantity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>总发放限制</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='不限'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                      <Input
                        type='number'
                        placeholder='不限'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                      <Input
                        type='number'
                        placeholder='不限'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='metadata'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>扩展数据（JSON）</FormLabel>
                  <FormControl>
                    <Textarea placeholder='请输入JSON格式的扩展数据（可选）' {...field} />
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
                {submitting && <Loader2 className='mr-2 size-4 animate-spin' />}
                {mode === 'edit' ? '保存' : '创建'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
