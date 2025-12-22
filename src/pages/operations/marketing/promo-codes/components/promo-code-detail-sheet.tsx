import { useState, useEffect } from 'react'
import { Check, Copy, Users } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/pagination'
import { getPromoCodeDetail, getPromoCodeUsages } from '@/services/promo-code'
import type { PromoCodeDetailVO, PromoCodeUsageVO, DiscountType } from '@/types/promo-code'

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
  copyable = false,
}: {
  label: string
  value: string | number | null | undefined
  copyable?: boolean
}) {
  return (
    <div className='rounded-lg border bg-card p-4'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <div className='mt-1 flex items-center gap-1'>
        <p className='text-sm font-medium'>{value ?? '-'}</p>
        {copyable && value && <CopyButton text={String(value)} />}
      </div>
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
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
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
      return `${value} 天`
    default:
      return String(value)
  }
}

interface PromoCodeDetailSheetProps {
  promoCodeId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PromoCodeDetailSheet({
  promoCodeId,
  open,
  onOpenChange,
}: PromoCodeDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [promoCode, setPromoCode] = useState<PromoCodeDetailVO | null>(null)

  // 使用记录状态
  const [usagesLoading, setUsagesLoading] = useState(false)
  const [usages, setUsages] = useState<PromoCodeUsageVO[]>([])
  const [usagesTotal, setUsagesTotal] = useState(0)
  const [usagesPage, setUsagesPage] = useState(1)
  const [usagesPageSize, setUsagesPageSize] = useState(10)

  useEffect(() => {
    if (open && promoCodeId) {
      fetchPromoCodeDetail()
      setUsagesPage(1)
    }
  }, [open, promoCodeId])

  useEffect(() => {
    if (open && promoCodeId) {
      fetchUsages()
    }
  }, [open, promoCodeId, usagesPage, usagesPageSize])

  const fetchPromoCodeDetail = async () => {
    if (!promoCodeId) return
    setLoading(true)
    try {
      const res = await getPromoCodeDetail(promoCodeId)
      if (res.code === 'success') {
        setPromoCode(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch promo code detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsages = async () => {
    if (!promoCodeId) return
    setUsagesLoading(true)
    try {
      const res = await getPromoCodeUsages(promoCodeId, {
        page: usagesPage,
        size: usagesPageSize,
      })
      if (res.code === 'success') {
        setUsages(res.data.records)
        setUsagesTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch usages:', error)
    } finally {
      setUsagesLoading(false)
    }
  }

  const handleUsagesPageChange = (newPage: number, newPageSize: number) => {
    setUsagesPage(newPage)
    setUsagesPageSize(newPageSize)
  }

  // 计算使用进度
  const getUsageProgress = () => {
    if (!promoCode || promoCode.totalLimit === null) return null
    return Math.min((promoCode.usedCount / promoCode.totalLimit) * 100, 100)
  }

  const usageProgress = promoCode ? getUsageProgress() : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full max-w-xl overflow-y-auto p-0 sm:max-w-2xl'>
        <SheetHeader className='border-b px-6 py-4'>
          <SheetTitle>优惠码详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='p-6 space-y-6'>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-48' />
              <Skeleton className='h-4 w-32' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className='h-20 w-full' />
              ))}
            </div>
          </div>
        ) : promoCode ? (
          <>
            {/* Header */}
            <div className='border-b bg-muted/30 px-6 py-6'>
              <div className='flex items-start justify-between'>
                <div>
                  <div className='flex items-center gap-3'>
                    <code className='rounded bg-background px-2 py-1 text-lg font-semibold'>
                      {promoCode.code}
                    </code>
                    <CopyButton text={promoCode.code} />
                  </div>
                  <p className='mt-2 text-sm text-muted-foreground'>{promoCode.name}</p>
                  <div className='mt-2 flex items-center gap-2'>
                    <Badge variant={promoCode.status ? 'default' : 'secondary'}>
                      {promoCode.status ? '已启用' : '已禁用'}
                    </Badge>
                    <Badge variant={promoCode.isActive ? 'outline' : 'destructive'}>
                      {promoCode.isActive ? '有效期内' : '已过期'}
                    </Badge>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-xs text-muted-foreground'>折扣</p>
                  <p className='text-2xl font-bold'>
                    {formatDiscountValue(
                      promoCode.discountType,
                      promoCode.discountValue,
                      promoCode.currency
                    )}
                  </p>
                </div>
              </div>

              {/* 使用进度 */}
              {promoCode.totalLimit !== null && (
                <div className='mt-5'>
                  <div className='flex items-center justify-between text-sm mb-2'>
                    <span className='text-muted-foreground'>使用进度</span>
                    <span className='font-medium'>
                      {promoCode.usedCount} / {promoCode.totalLimit}
                    </span>
                  </div>
                  <Progress value={usageProgress ?? 0} className='h-2' />
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue='info' className='w-full'>
              <TabsList className='w-full justify-start rounded-none border-b bg-transparent px-6'>
                <TabsTrigger
                  value='info'
                  className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'
                >
                  详细信息
                </TabsTrigger>
                <TabsTrigger
                  value='usages'
                  className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'
                >
                  使用记录
                  {usagesTotal > 0 && (
                    <Badge variant='secondary' className='ml-2 h-5 px-1.5'>
                      {usagesTotal}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value='info' className='mt-0 p-6 space-y-6'>
                {/* 基本信息 */}
                <div>
                  <h4 className='text-sm font-semibold mb-4'>基本信息</h4>
                  <div className='rounded-lg border p-4'>
                    <InfoRow label='ID'>
                      <div className='flex items-center gap-1'>
                        <span className='font-mono'>{promoCode.id}</span>
                        <CopyButton text={String(promoCode.id)} />
                      </div>
                    </InfoRow>
                    <Separator />
                    <InfoRow label='名称'>{promoCode.name}</InfoRow>
                    {promoCode.description && (
                      <>
                        <Separator />
                        <InfoRow label='描述'>{promoCode.description}</InfoRow>
                      </>
                    )}
                  </div>
                </div>

                {/* 折扣信息 */}
                <div>
                  <h4 className='text-sm font-semibold mb-4'>折扣信息</h4>
                  <div className='rounded-lg border p-4'>
                    <InfoRow label='折扣类型'>
                      <Badge variant={DISCOUNT_TYPE_CONFIG[promoCode.discountType]?.variant || 'outline'}>
                        {DISCOUNT_TYPE_CONFIG[promoCode.discountType]?.label || promoCode.discountTypeDesc}
                      </Badge>
                    </InfoRow>
                    <Separator />
                    <InfoRow label='折扣值'>
                      {formatDiscountValue(promoCode.discountType, promoCode.discountValue, promoCode.currency)}
                    </InfoRow>
                    {promoCode.maxDiscountAmount !== null && (
                      <>
                        <Separator />
                        <InfoRow label='最大折扣金额'>{promoCode.maxDiscountAmount} 元</InfoRow>
                      </>
                    )}
                    {promoCode.minOrderAmount !== null && (
                      <>
                        <Separator />
                        <InfoRow label='最低订单金额'>{promoCode.minOrderAmount / 100} 元</InfoRow>
                      </>
                    )}
                  </div>
                </div>

                {/* 适用范围 */}
                <div>
                  <h4 className='text-sm font-semibold mb-4'>适用范围</h4>
                  <div className='rounded-lg border p-4'>
                    <InfoRow label='适用产品类型'>
                      <Badge variant='outline'>{promoCode.applicableProductTypeDesc}</Badge>
                    </InfoRow>
                    {promoCode.applicableProductIds && promoCode.applicableProductIds.length > 0 && (
                      <>
                        <Separator />
                        <InfoRow label='适用产品ID'>
                          <span className='font-mono text-sm'>
                            {promoCode.applicableProductIds.join(', ')}
                          </span>
                        </InfoRow>
                      </>
                    )}
                  </div>
                </div>

                {/* 使用限制 */}
                <div>
                  <h4 className='text-sm font-semibold mb-4'>使用限制</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <InfoCard
                      label='总使用限制'
                      value={promoCode.totalLimit !== null ? promoCode.totalLimit : '不限'}
                    />
                    <InfoCard
                      label='每用户限制'
                      value={promoCode.perUserLimit !== null ? promoCode.perUserLimit : '不限'}
                    />
                    <InfoCard
                      label='每团队限制'
                      value={promoCode.perTeamLimit !== null ? promoCode.perTeamLimit : '不限'}
                    />
                    <InfoCard label='已使用次数' value={promoCode.usedCount} />
                  </div>
                  <div className='mt-4 rounded-lg border p-4'>
                    <InfoRow label='仅限首单'>
                      <Badge variant={promoCode.isFirstOrderOnly ? 'default' : 'secondary'}>
                        {promoCode.isFirstOrderOnly ? '是' : '否'}
                      </Badge>
                    </InfoRow>
                    <Separator />
                    <InfoRow label='仅限新用户'>
                      <Badge variant={promoCode.isNewUserOnly ? 'default' : 'secondary'}>
                        {promoCode.isNewUserOnly ? '是' : '否'}
                      </Badge>
                    </InfoRow>
                  </div>
                </div>

                {/* 有效期 */}
                <div>
                  <h4 className='text-sm font-semibold mb-4'>有效期</h4>
                  <div className='rounded-lg border p-4'>
                    <InfoRow label='开始时间'>
                      {dayjs(promoCode.startTime).format('YYYY-MM-DD HH:mm:ss')}
                    </InfoRow>
                    <Separator />
                    <InfoRow label='结束时间'>
                      {dayjs(promoCode.endTime).format('YYYY-MM-DD HH:mm:ss')}
                    </InfoRow>
                  </div>
                </div>

                {/* 时间信息 */}
                <div>
                  <h4 className='text-sm font-semibold mb-4'>时间信息</h4>
                  <div className='rounded-lg border p-4'>
                    <InfoRow label='创建时间'>
                      {dayjs(promoCode.createTime).format('YYYY-MM-DD HH:mm:ss')}
                    </InfoRow>
                    <Separator />
                    <InfoRow label='更新时间'>
                      {dayjs(promoCode.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                    </InfoRow>
                  </div>
                </div>

                {/* 扩展数据 */}
                {promoCode.metadata && (
                  <div>
                    <h4 className='text-sm font-semibold mb-4'>扩展数据</h4>
                    <div className='rounded-lg border bg-muted/50 p-4'>
                      <pre className='text-xs text-muted-foreground whitespace-pre-wrap break-all'>
                        {promoCode.metadata}
                      </pre>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='usages' className='mt-0 p-6 space-y-4'>
                <div className='rounded-lg border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-20'>团队ID</TableHead>
                        <TableHead className='w-20'>用户ID</TableHead>
                        <TableHead className='w-24'>订单ID</TableHead>
                        <TableHead className='w-28'>折扣金额</TableHead>
                        <TableHead className='w-40'>使用时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usagesLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className='h-4 w-14' />
                            </TableCell>
                            <TableCell>
                              <Skeleton className='h-4 w-14' />
                            </TableCell>
                            <TableCell>
                              <Skeleton className='h-4 w-18' />
                            </TableCell>
                            <TableCell>
                              <Skeleton className='h-4 w-20' />
                            </TableCell>
                            <TableCell>
                              <Skeleton className='h-4 w-32' />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : usages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className='h-24 text-center'>
                            <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                              <Users className='size-8 opacity-50' />
                              <span>暂无使用记录</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        usages.map((usage) => (
                          <TableRow key={usage.id}>
                            <TableCell>
                              <span className='font-mono text-sm'>{usage.teamId}</span>
                            </TableCell>
                            <TableCell>
                              <span className='font-mono text-sm'>{usage.userId}</span>
                            </TableCell>
                            <TableCell>
                              <span className='font-mono text-sm'>{usage.orderId}</span>
                            </TableCell>
                            <TableCell>
                              <span className='font-medium'>
                                {(usage.discountAmount / 100).toFixed(2)} 元
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className='text-muted-foreground text-sm'>
                                {dayjs(usage.usedTime).format('YYYY-MM-DD HH:mm')}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {usagesTotal > 0 && (
                  <Pagination
                    current={usagesPage}
                    total={usagesTotal}
                    pageSize={usagesPageSize}
                    onChange={handleUsagesPageChange}
                  />
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className='flex items-center justify-center h-32 text-muted-foreground'>
            优惠码信息加载失败
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
