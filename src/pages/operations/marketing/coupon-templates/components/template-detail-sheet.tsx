import { useState, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { getCouponTemplateDetail } from '@/services/coupon-template.ts'
import type { CouponTemplateDetailVO, DiscountType } from '@/types/coupon-template.ts'

function CopyableField({ label, value }: { label: string; value: string | number | null }) {
  const [copied, setCopied] = useState(false)

  if (value === null || value === undefined) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(value))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className='group flex items-center justify-between py-2'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='flex items-center gap-2'>
        <span className='font-medium font-mono text-sm'>{value}</span>
        <Button
          variant='ghost'
          size='icon'
          className='size-6 opacity-0 group-hover:opacity-100 transition-opacity'
          onClick={handleCopy}
        >
          {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
        </Button>
      </div>
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex items-center justify-between py-2'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='font-medium'>{children}</div>
    </div>
  )
}

const DISCOUNT_TYPE_CONFIG: Record<DiscountType, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  FIXED_AMOUNT: { label: '固定金额', variant: 'default' },
  PERCENT: { label: '百分比', variant: 'secondary' },
  FREE_TRIAL: { label: '免费试用', variant: 'outline' },
}

function formatDiscountValue(type: DiscountType, value: number, currency: string | null): string {
  switch (type) {
    case 'FIXED_AMOUNT':
      return `${currency?.toUpperCase() || 'USD'} ${value}`
    case 'PERCENT':
      return `${value}%`
    case 'FREE_TRIAL':
      return `${value}天`
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[600px] sm:max-w-[600px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>模板详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='mt-6 space-y-6'>
            <div className='space-y-3'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-32 w-full' />
            </div>
          </div>
        ) : template ? (
          <div className='mt-6 space-y-6'>
            {/* 基本信息 */}
            <div>
              <h3 className='text-sm font-semibold mb-2'>基本信息</h3>
              <div className='rounded-lg border p-4'>
                <CopyableField label='ID' value={template.id} />
                <Separator />
                <InfoRow label='名称'>{template.name}</InfoRow>
                {template.description && (
                  <>
                    <Separator />
                    <InfoRow label='描述'>{template.description}</InfoRow>
                  </>
                )}
              </div>
            </div>

            {/* 折扣信息 */}
            <div>
              <h3 className='text-sm font-semibold mb-2'>折扣信息</h3>
              <div className='rounded-lg border p-4'>
                <InfoRow label='折扣类型'>
                  <Badge variant={DISCOUNT_TYPE_CONFIG[template.discountType]?.variant || 'outline'}>
                    {DISCOUNT_TYPE_CONFIG[template.discountType]?.label || template.discountTypeDesc}
                  </Badge>
                </InfoRow>
                <Separator />
                <InfoRow label='折扣值'>
                  {formatDiscountValue(template.discountType, template.discountValue, template.currency)}
                </InfoRow>
                {template.maxDiscountAmount !== null && (
                  <>
                    <Separator />
                    <InfoRow label='最大折扣金额'>{template.maxDiscountAmount}</InfoRow>
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
              <h3 className='text-sm font-semibold mb-2'>适用范围</h3>
              <div className='rounded-lg border p-4'>
                <InfoRow label='适用产品类型'>
                  <Badge variant='outline'>{template.applicableProductTypeDesc}</Badge>
                </InfoRow>
                {template.applicableProductIds && template.applicableProductIds.length > 0 && (
                  <>
                    <Separator />
                    <InfoRow label='适用产品ID'>
                      {template.applicableProductIds.join(', ')}
                    </InfoRow>
                  </>
                )}
              </div>
            </div>

            {/* 有效期与数量 */}
            <div>
              <h3 className='text-sm font-semibold mb-2'>有效期与数量</h3>
              <div className='rounded-lg border p-4'>
                <InfoRow label='有效天数'>{template.validDays}天</InfoRow>
                <Separator />
                <InfoRow label='已发放数量'>{template.issuedQuantity}</InfoRow>
                <Separator />
                <InfoRow label='总发放限制'>
                  {template.totalQuantity !== null ? template.totalQuantity : '不限'}
                </InfoRow>
                <Separator />
                <InfoRow label='每用户限制'>
                  {template.perUserLimit !== null ? template.perUserLimit : '不限'}
                </InfoRow>
                <Separator />
                <InfoRow label='每团队限制'>
                  {template.perTeamLimit !== null ? template.perTeamLimit : '不限'}
                </InfoRow>
              </div>
            </div>

            {/* 状态 */}
            <div>
              <h3 className='text-sm font-semibold mb-2'>状态</h3>
              <div className='rounded-lg border p-4'>
                <InfoRow label='启用状态'>
                  <Badge variant={template.status ? 'default' : 'secondary'}>
                    {template.status ? '已启用' : '已禁用'}
                  </Badge>
                </InfoRow>
              </div>
            </div>

            {/* 时间信息 */}
            <div>
              <h3 className='text-sm font-semibold mb-2'>时间信息</h3>
              <div className='rounded-lg border p-4'>
                <InfoRow label='创建时间'>
                  {dayjs(template.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </InfoRow>
                <Separator />
                <InfoRow label='更新时间'>
                  {dayjs(template.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                </InfoRow>
              </div>
            </div>

            {/* 元数据 */}
            {template.metadata && (
              <div>
                <h3 className='text-sm font-semibold mb-2'>扩展数据</h3>
                <div className='rounded-lg border p-4'>
                  <pre className='text-xs overflow-x-auto whitespace-pre-wrap'>
                    {template.metadata}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='mt-6 flex items-center justify-center h-32 text-muted-foreground'>
            模板信息加载失败
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
