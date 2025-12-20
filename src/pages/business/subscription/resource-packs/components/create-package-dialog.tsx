import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, HelpCircle } from 'lucide-react'

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
import { Input } from '@/components/ui/input'
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
import { createResourcePackage } from '@/services/resource-pack'
import type { ResourceType } from '@/types/resource-pack'

const formSchema = z.object({
  packCode: z.string().min(1, '请输入资源包编码'),
  packName: z.string().min(1, '请输入资源包名称'),
  resourceType: z.enum(['PROJECT', 'MEMBER', 'STORAGE'] as const),
  resourceAmount: z.number().min(1, '资源数量必须大于0'),
  price: z.number().min(0, '价格不能小于0'),
  originalPrice: z.number().min(0, '原价不能小于0').optional(),
  currency: z.string().min(1, '请选择货币类型'),
  durationDays: z.number().min(0, '有效天数不能小于0').optional(),
  description: z.string().optional(),
  sortOrder: z.number().min(0, '排序序号不能小于0').optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreatePackageDialogProps {
  onSuccess?: () => void
}

export function CreatePackageDialog({ onSuccess }: CreatePackageDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packCode: '',
      packName: '',
      resourceType: undefined,
      resourceAmount: 1,
      price: 0,
      originalPrice: undefined,
      currency: 'CNY',
      durationDays: undefined,
      description: '',
      sortOrder: 0,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const res = await createResourcePackage({
        packCode: values.packCode,
        packName: values.packName,
        resourceType: values.resourceType as ResourceType,
        resourceAmount: values.resourceAmount,
        price: values.price,
        originalPrice: values.originalPrice,
        currency: values.currency,
        durationDays: values.durationDays,
        description: values.description,
        sortOrder: values.sortOrder,
      })
      if (res.code === 'success') {
        setOpen(false)
        form.reset()
        onSuccess?.()
      }
    } catch (error) {
      console.error('Failed to create resource package:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 size-4' />
          创建资源包
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl' onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>创建资源包</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              {/* 资源包编码 */}
              <FormField
                control={form.control}
                name='packCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-1'>
                      资源包编码
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className='size-3.5 text-muted-foreground cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent>唯一标识符，创建后不可修改</TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='如: PACK_PROJECT_10' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 资源包名称 */}
              <FormField
                control={form.control}
                name='packName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>资源包名称</FormLabel>
                    <FormControl>
                      <Input placeholder='如: 项目扩展包(10个)' {...field} />
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
                name='resourceAmount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-1'>
                      资源数量
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className='size-3.5 text-muted-foreground cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent>此资源包提供的资源额度</TooltipContent>
                      </Tooltip>
                    </FormLabel>
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
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                取消
              </Button>
              <Button type='submit' disabled={submitting}>
                {submitting ? '创建中...' : '创建'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
