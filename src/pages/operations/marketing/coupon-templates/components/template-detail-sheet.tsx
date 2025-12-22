import { useState, useEffect } from 'react'
import { Check, Copy, Gift, Percent, Calendar, Tag, Clock } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { getCouponTemplateDetail } from '@/services/coupon-template'
import type { CouponTemplateDetailVO, DiscountType } from '@/types/coupon-template'

// 复制按钮组件
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

// 信息卡片组件
function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number | null | undefined
  icon?: React.ElementType
}) {
  return (
    <div className='rounded-lg border bg-card p-4'>
      <div className='flex items-center gap-2'>
        {Icon && <Icon className='size-3.5 text-muted-foreground' />}
        <p className='text-xs text-muted-foreground'>{label}</p>
      </div>
      <p className='mt-1 text-sm font-medium'>{value ?? '-'}</p>
    </div>
  )
}

// 信息行组件
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex items-center justify-between py-2'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='font-medium'>{children}</div>
    </div>
  )
}

// 折扣类型配置
const DISCOUNT_TYPE_CONFIG: Record<
  DiscountType,
  { label: string; variant: 'default' | 'secondary' | 'outline'; icon: React.ElementType }
> = {
  FIXED_AMOUNT: { label: '固定金额', variant: 'default', icon: Tag },
  PERCENT: { label: '百分比', variant: 'secondary', icon: Percent },
  FREE_TRIAL: { label: '免费试用', variant: 'outline', icon: Gift },
}

function formatDiscountValue(type: DiscountType, value: number, currency: string | null): string {
  switch (type) {
    case 'FIXED_AMOUNT':
      return `${currency?.toUpperCase() || 'USD'} ${value}`
    case 'PERCENT':
      return `${value}%`
    case 'FREE_TRIAL':
      return `${value} 天`
    default:
      return String(value)
  }
}

interface TemplateDetailSheetProps {
  templateId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplateDetailSheet({
  templateId,
  open,
  onOpenChange,
}: TemplateDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState<CouponTemplateDetailVO | null>(null)

  useEffect(() => {
    if (open && templateId) {
      fetchTemplateDetail()
    }
  }, [open, templateId])

  const fetchTemplateDetail = async () => {
    if (!templateId) return
    setLoading(true)
    try {
      const res = await getCouponTemplateDetail(templateId)
      if (res.code === 'success') {
        setTemplate(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch template detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const discountConfig = template ? DISCOUNT_TYPE_CONFIG[template.discountType] : null
  const DiscountIcon = discountConfig?.icon || Gift

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full max-w-xl overflow-y-auto p-0 sm:max-w-2xl'>
        <SheetHeader className='border-b px-6 py-4'>
          <SheetTitle>模板详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='p-6 space-y-6'>
            <div className='flex items-start gap-5'>
              <Skeleton className='h-16 w-16 rounded-xl' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-6 w-48' />
                <Skeleton className='h-4 w-32' />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className='h-20 w-full' />
              ))}
            </div>
          </div>
        ) : template ? (
          <>
            {/* Header */}
            <div className='border-b bg-muted/30 px-6 py-6'>
              <div className='flex items-start gap-5'>
                <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10'>
                  <DiscountIcon className='h-8 w-8 text-primary' />
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-3'>
                    <h3 className='text-xl font-semibold tracking-tight'>{template.name}</h3>
                    <Badge variant={template.status ? 'default' : 'secondary'}>
                      {template.status ? '已启用' : '已禁用'}
                    </Badge>
                  </div>
                  <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                    <span>ID: {template.id}</span>
                    <CopyButton text={String(template.id)} />
                  </div>
                  {template.description && (
                    <p className='mt-2 text-sm text-muted-foreground'>{template.description}</p>
                  )}
                </div>
              </div>

              {/* 折扣展示 */}
              <div className='mt-5 flex items-baseline gap-2'>
                <span className='text-3xl font-bold'>
                  {formatDiscountValue(template.discountType, template.discountValue, template.currency)}
                </span>
                <Badge variant={discountConfig?.variant || 'outline'}>
                  {discountConfig?.label || template.discountTypeDesc}
                </Badge>
              </div>
            </div>

            {/* 内容区域 */}
            <div className='p-6 space-y-6'>
              {/* 数量统计 */}
              <div>
                <h4 className='text-sm font-semibold mb-4'>数量统计</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <InfoCard label='已发放数量' value={template.issuedQuantity} />
                  <InfoCard
                    label='总发放限制'
                    value={template.totalQuantity !== null ? template.totalQuantity : '不限'}
                  />
                  <InfoCard
                    label='有效天数'
                    value={`${template.validDays} 天`}
                    icon={Calendar}
                  />
                </div>
              </div>

              {/* 使用限制 */}
              <div>
                <h4 className='text-sm font-semibold mb-4'>使用限制</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <InfoCard
                    label='每用户限制'
                    value={template.perUserLimit !== null ? template.perUserLimit : '不限'}
                  />
                  <InfoCard
                    label='每团队限制'
                    value={template.perTeamLimit !== null ? template.perTeamLimit : '不限'}
                  />
                </div>
              </div>

              {/* 折扣详情 */}
              <div>
                <h4 className='text-sm font-semibold mb-4'>折扣详情</h4>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='折扣类型'>
                    <Badge variant={discountConfig?.variant || 'outline'}>
                      {discountConfig?.label || template.discountTypeDesc}
                    </Badge>
                  </InfoRow>
                  <Separator />
                  <InfoRow label='折扣值'>
                    {formatDiscountValue(template.discountType, template.discountValue, template.currency)}
                  </InfoRow>
                  {template.maxDiscountAmount !== null && (
                    <>
                      <Separator />
                      <InfoRow label='最大折扣金额'>{template.maxDiscountAmount} 元</InfoRow>
                    </>
                  )}
                  {template.minOrderAmount !== null && (
                    <>
                      <Separator />
                      <InfoRow label='最低订单金额'>{template.minOrderAmount / 100} 元</InfoRow>
                    </>
                  )}
                </div>
              </div>

              {/* 适用范围 */}
              <div>
                <h4 className='text-sm font-semibold mb-4'>适用范围</h4>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='适用产品类型'>
                    <Badge variant='outline'>{template.applicableProductTypeDesc}</Badge>
                  </InfoRow>
                  {template.applicableProductIds && template.applicableProductIds.length > 0 && (
                    <>
                      <Separator />
                      <InfoRow label='适用产品ID'>
                        <span className='font-mono text-sm'>
                          {template.applicableProductIds.join(', ')}
                        </span>
                      </InfoRow>
                    </>
                  )}
                </div>
              </div>

              {/* 时间信息 */}
              <div>
                <h4 className='text-sm font-semibold mb-4'>时间信息</h4>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='创建时间'>
                    <div className='flex items-center gap-1.5'>
                      <Clock className='size-3.5 text-muted-foreground' />
                      {dayjs(template.createTime).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </InfoRow>
                  <Separator />
                  <InfoRow label='更新时间'>
                    <div className='flex items-center gap-1.5'>
                      <Clock className='size-3.5 text-muted-foreground' />
                      {dayjs(template.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </InfoRow>
                </div>
              </div>

              {/* 扩展数据 */}
              {template.metadata && (
                <div>
                  <h4 className='text-sm font-semibold mb-4'>扩展数据</h4>
                  <div className='rounded-lg border bg-muted/50 p-4'>
                    <pre className='text-xs text-muted-foreground whitespace-pre-wrap break-all'>
                      {template.metadata}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='flex items-center justify-center h-32 text-muted-foreground'>
            模板信息加载失败
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
