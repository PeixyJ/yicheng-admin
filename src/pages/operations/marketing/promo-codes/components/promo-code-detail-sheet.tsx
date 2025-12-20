import { useState, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { Pagination } from '@/components/pagination.tsx'
import { getPromoCodeDetail, getPromoCodeUsages } from '@/services/promo-code.ts'
import type { PromoCodeDetailVO, PromoCodeUsageVO, DiscountType } from '@/types/promo-code.ts'

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[700px] sm:max-w-[700px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>优惠码详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='mt-6 space-y-6'>
            <div className='space-y-3'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-32 w-full' />
            </div>
          </div>
        ) : promoCode ? (
          <Tabs defaultValue='info' className='mt-6'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='info'>基本信息</TabsTrigger>
              <TabsTrigger value='usages'>使用记录</TabsTrigger>
            </TabsList>

            <TabsContent value='info' className='mt-4 space-y-6'>
              {/* 基本信息 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>基本信息</h3>
                <div className='rounded-lg border p-4'>
                  <CopyableField label='ID' value={promoCode.id} />
                  <Separator />
                  <CopyableField label='优惠码' value={promoCode.code} />
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
                <h3 className='text-sm font-semibold mb-2'>折扣信息</h3>
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
                      <InfoRow label='最大折扣金额'>{promoCode.maxDiscountAmount}</InfoRow>
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
                <h3 className='text-sm font-semibold mb-2'>适用范围</h3>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='适用产品类型'>
                    <Badge variant='outline'>{promoCode.applicableProductTypeDesc}</Badge>
                  </InfoRow>
                  {promoCode.applicableProductIds && promoCode.applicableProductIds.length > 0 && (
                    <>
                      <Separator />
                      <InfoRow label='适用产品ID'>
                        {promoCode.applicableProductIds.join(', ')}
                      </InfoRow>
                    </>
                  )}
                </div>
              </div>

              {/* 使用限制 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>使用限制</h3>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='已使用次数'>{promoCode.usedCount}</InfoRow>
                  <Separator />
                  <InfoRow label='总使用限制'>
                    {promoCode.totalLimit !== null ? promoCode.totalLimit : '不限'}
                  </InfoRow>
                  <Separator />
                  <InfoRow label='每用户限制'>
                    {promoCode.perUserLimit !== null ? promoCode.perUserLimit : '不限'}
                  </InfoRow>
                  <Separator />
                  <InfoRow label='每团队限制'>
                    {promoCode.perTeamLimit !== null ? promoCode.perTeamLimit : '不限'}
                  </InfoRow>
                  <Separator />
                  <InfoRow label='仅限首单'>
                    {promoCode.isFirstOrderOnly ? '是' : '否'}
                  </InfoRow>
                  <Separator />
                  <InfoRow label='仅限新用户'>
                    {promoCode.isNewUserOnly ? '是' : '否'}
                  </InfoRow>
                </div>
              </div>

              {/* 有效期 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>有效期</h3>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='开始时间'>
                    {dayjs(promoCode.startTime).format('YYYY-MM-DD HH:mm:ss')}
                  </InfoRow>
                  <Separator />
                  <InfoRow label='结束时间'>
                    {dayjs(promoCode.endTime).format('YYYY-MM-DD HH:mm:ss')}
                  </InfoRow>
                  <Separator />
                  <InfoRow label='当前状态'>
                    <Badge variant={promoCode.isActive ? 'default' : 'outline'}>
                      {promoCode.isActive ? '有效期内' : '已过期'}
                    </Badge>
                  </InfoRow>
                </div>
              </div>

              {/* 状态 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>状态</h3>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='启用状态'>
                    <Badge variant={promoCode.status ? 'default' : 'secondary'}>
                      {promoCode.status ? '已启用' : '已禁用'}
                    </Badge>
                  </InfoRow>
                </div>
              </div>

              {/* 时间信息 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>时间信息</h3>
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

              {/* 元数据 */}
              {promoCode.metadata && (
                <div>
                  <h3 className='text-sm font-semibold mb-2'>扩展数据</h3>
                  <div className='rounded-lg border p-4'>
                    <pre className='text-xs overflow-x-auto whitespace-pre-wrap'>
                      {promoCode.metadata}
                    </pre>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value='usages' className='mt-4 space-y-4'>
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
                          <TableCell><Skeleton className='h-4 w-14' /></TableCell>
                          <TableCell><Skeleton className='h-4 w-14' /></TableCell>
                          <TableCell><Skeleton className='h-4 w-18' /></TableCell>
                          <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                          <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                        </TableRow>
                      ))
                    ) : usages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
                          暂无使用记录
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
                            <span className='font-medium'>{(usage.discountAmount / 100).toFixed(2)} 元</span>
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
        ) : (
          <div className='mt-6 flex items-center justify-center h-32 text-muted-foreground'>
            优惠码信息加载失败
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
