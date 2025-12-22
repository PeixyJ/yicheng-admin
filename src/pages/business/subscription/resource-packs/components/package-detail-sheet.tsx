import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, Copy, HelpCircle } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { NumberInput } from '@/components/shadcn-studio/input/number-input'
import { getResourcePackageDetail, updateResourcePackage } from '@/services/resource-pack'
import type { SubscribeResourcePackageVO, ResourceType } from '@/types/resource-pack'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-6 text-muted-foreground hover:text-foreground'
      onClick={handleCopy}
    >
      {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
    </Button>
  )
}

const formSchema = z.object({
  packName: z.string().min(1, '请输入资源包名称'),
  resourceType: z.enum(['PROJECT', 'MEMBER', 'STORAGE'] as const),
  resourceAmount: z.number().min(1, '资源数量必须大于0'),
  price: z.number().min(0, '价格不能小于0'),
  originalPrice: z.number().min(0, '原价不能小于0').optional(),
  currency: z.string().min(1, '请选择货币类型'),
  durationDays: z.number().min(0, '有效天数不能小于0').optional(),
  description: z.string().optional(),
  isVisible: z.boolean(),
  sortOrder: z.number().min(0, '排序序号不能小于0').optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PackageDetailSheetProps {
  packageId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PackageDetailSheet({
  packageId,
  open,
  onOpenChange,
  onSuccess,
}: PackageDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [pkg, setPkg] = useState<SubscribeResourcePackageVO | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packName: '',
      resourceType: undefined,
      resourceAmount: 1,
      price: 0,
      originalPrice: undefined,
      currency: 'CNY',
      durationDays: undefined,
      description: '',
      isVisible: true,
      sortOrder: 0,
    },
  })

  useEffect(() => {
    if (open && packageId) {
      loadPackageDetail()
    }
  }, [open, packageId])

  const loadPackageDetail = async () => {
    if (!packageId) return
    setLoading(true)
    try {
      const response = await getResourcePackageDetail(packageId)
      if (response.code === 'success') {
        setPkg(response.data)
        form.reset({
          packName: response.data.packName,
          resourceType: response.data.resourceType,
          resourceAmount: response.data.resourceAmount,
          price: response.data.price,
          originalPrice: response.data.originalPrice ?? undefined,
          currency: response.data.currency,
          durationDays: response.data.durationDays ?? undefined,
          description: response.data.description ?? '',
          isVisible: response.data.isVisible,
          sortOrder: response.data.sortOrder,
        })
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: FormValues) => {
    if (!packageId || !pkg) return
    setSubmitting(true)
    try {
      const res = await updateResourcePackage(packageId, {
        packName: values.packName,
        resourceType: values.resourceType as ResourceType,
        resourceAmount: values.resourceAmount,
        price: values.price,
        originalPrice: values.originalPrice,
        currency: values.currency,
        durationDays: values.durationDays,
        description: values.description,
        isVisible: values.isVisible,
        sortOrder: values.sortOrder,
        dataVersion: pkg.dataVersion,
      })
      if (res.code === 'success') {
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      console.error('Failed to update resource package:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full max-w-2xl overflow-y-auto p-0 sm:max-w-2xl'>
        <SheetHeader className='border-b px-6 py-4'>
          <SheetTitle>资源包详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='p-6 space-y-6'>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-4 w-48' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='space-y-2'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-10 w-full' />
                </div>
              ))}
            </div>
          </div>
        ) : pkg ? (
          <>
            {/* Package Header */}
            <div className='border-b bg-muted/30 px-6 py-6'>
              <div className='flex items-start justify-between'>
                <div>
                  <div className='flex items-center gap-3'>
                    <h3 className='text-xl font-semibold tracking-tight'>{pkg.packName}</h3>
                    {pkg.status ? (
                      <Badge variant='default'>已上架</Badge>
                    ) : (
                      <Badge variant='secondary'>已下架</Badge>
                    )}
                    {pkg.isVisible ? (
                      <Badge variant='outline'>可见</Badge>
                    ) : (
                      <Badge variant='outline' className='text-muted-foreground'>隐藏</Badge>
                    )}
                  </div>
                  <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                    <span>ID: {pkg.id}</span>
                    <CopyButton text={String(pkg.id)} />
                    <span>·</span>
                    <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>{pkg.packCode}</code>
                    <CopyButton text={pkg.packCode} />
                  </div>
                </div>
              </div>
              <div className='mt-4 flex gap-4 text-sm text-muted-foreground'>
                <span>创建时间: {pkg.createTime}</span>
                <span>更新时间: {pkg.updateTime}</span>
              </div>
            </div>

            {/* Edit Form */}
            <div className='p-6'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='grid grid-cols-2 gap-4'>
                    {/* 资源包名称 */}
                    <FormField
                      control={form.control}
                      name='packName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>资源包名称</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* 资源类型 */}
                    <FormField
                      control={form.control}
                      name='resourceType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>资源类型</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue />
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
                      name='resourceAmount'
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

                    {/* 货币类型 */}
                    <FormField
                      control={form.control}
                      name='currency'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>货币类型</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue />
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

                    {/* 销售价格 */}
                    <FormField
                      control={form.control}
                      name='price'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>销售价格</FormLabel>
                          <FormControl>
                            <NumberInput
                              value={field.value}
                              onChange={field.onChange}
                              minValue={0}
                              step={0.1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* 原价 */}
                    <FormField
                      control={form.control}
                      name='originalPrice'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            原价/划线价
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className='size-3.5 text-muted-foreground cursor-help' />
                              </TooltipTrigger>
                              <TooltipContent>用于展示折扣效果的原价</TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <NumberInput
                              value={field.value ?? 0}
                              onChange={(v) => field.onChange(v || undefined)}
                              minValue={0}
                              step={0.1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

                    {/* 排序序号 */}
                    <FormField
                      control={form.control}
                      name='sortOrder'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-1'>
                            排序序号
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className='size-3.5 text-muted-foreground cursor-help' />
                              </TooltipTrigger>
                              <TooltipContent>数字越小排序越靠前</TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <NumberInput
                              value={field.value ?? 0}
                              onChange={field.onChange}
                              minValue={0}
                              step={1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* 是否可见 */}
                    <FormField
                      control={form.control}
                      name='isVisible'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                          <div className='space-y-0.5'>
                            <FormLabel>商城可见</FormLabel>
                            <p className='text-sm text-muted-foreground'>
                              是否在商城展示此资源包
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 描述 */}
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>描述</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='资源包详细描述...'
                            className='resize-none'
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='flex justify-end gap-3'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => onOpenChange(false)}
                      disabled={submitting}
                    >
                      取消
                    </Button>
                    <Button type='submit' disabled={submitting}>
                      {submitting ? '保存中...' : '保存修改'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
