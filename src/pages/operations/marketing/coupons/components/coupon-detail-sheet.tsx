import { useState, useEffect } from 'react'
import { Ban, Check, Copy } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { getCouponDetail } from '@/services/coupon'
import { RevokeCouponDialog } from './revoke-coupon-dialog'
import type { CouponDetailVO, CouponStatus, CouponSource } from '@/types/coupon'

interface CouponDetailSheetProps {
  couponId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCouponUpdated?: () => void
}

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

function InfoCard({ label, value, copyable = false }: { label: string; value: string | number | null | undefined; copyable?: boolean }) {
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

function getStatusBadge(status: CouponStatus, statusDesc: string) {
  switch (status) {
    case 'UNUSED':
      return <Badge variant='secondary'>{statusDesc}</Badge>
    case 'USED':
      return <Badge variant='default'>{statusDesc}</Badge>
    case 'EXPIRED':
      return <Badge variant='outline'>{statusDesc}</Badge>
    case 'REVOKED':
      return <Badge variant='destructive'>{statusDesc}</Badge>
    default:
      return <Badge variant='secondary'>{statusDesc}</Badge>
  }
}

function getSourceBadge(source: CouponSource, sourceDesc: string) {
  switch (source) {
    case 'PROMO_CODE':
      return <Badge variant='outline'>{sourceDesc}</Badge>
    case 'SYSTEM_GRANT':
      return <Badge variant='secondary'>{sourceDesc}</Badge>
    case 'ACTIVITY':
      return <Badge variant='default'>{sourceDesc}</Badge>
    default:
      return <Badge variant='outline'>{sourceDesc}</Badge>
  }
}

export function CouponDetailSheet({ couponId, open, onOpenChange, onCouponUpdated }: CouponDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [coupon, setCoupon] = useState<CouponDetailVO | null>(null)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)

  useEffect(() => {
    if (open && couponId) {
      loadCouponDetail()
    }
  }, [open, couponId])

  const loadCouponDetail = async () => {
    if (!couponId) return
    setLoading(true)
    try {
      const response = await getCouponDetail(couponId)
      if (response.code === 'success') {
        setCoupon(response.data)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeSuccess = () => {
    loadCouponDetail()
    onCouponUpdated?.()
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='w-full max-w-2xl overflow-y-auto p-0 sm:max-w-2xl'>
          <SheetHeader className='border-b px-6 py-4'>
            <SheetTitle>优惠券详情</SheetTitle>
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
          ) : coupon ? (
            <>
              {/* Header */}
              <div className='border-b bg-muted/30 px-6 py-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='flex items-center gap-3'>
                      <code className='rounded bg-background px-2 py-1 text-lg font-semibold'>
                        {coupon.couponNo}
                      </code>
                      <CopyButton text={coupon.couponNo} />
                    </div>
                    <div className='mt-2 flex items-center gap-2'>
                      {getStatusBadge(coupon.status, coupon.statusDesc)}
                      {getSourceBadge(coupon.source, coupon.sourceDesc)}
                    </div>
                    {coupon.description && (
                      <p className='mt-2 text-sm text-muted-foreground'>{coupon.description}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {coupon.status === 'UNUSED' && (
                  <div className='mt-5'>
                    <Button
                      variant='outline'
                      className='border-destructive text-destructive hover:bg-destructive/10'
                      onClick={() => setRevokeDialogOpen(true)}
                    >
                      <Ban className='mr-2 h-4 w-4' />
                      撤销优惠券
                    </Button>
                  </div>
                )}

                {/* Revoke Reason */}
                {coupon.status === 'REVOKED' && coupon.revokeReason && (
                  <div className='mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3'>
                    <p className='text-sm font-medium text-destructive'>撤销原因</p>
                    <p className='mt-1 text-sm text-muted-foreground'>{coupon.revokeReason}</p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className='p-6 space-y-6'>
                {/* 折扣信息 */}
                <div>
                  <h4 className='mb-4 text-sm font-semibold'>折扣信息</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <InfoCard label='模板名称' value={coupon.templateName} />
                    <InfoCard label='模板ID' value={coupon.templateId} copyable />
                    <InfoCard label='折扣类型' value={coupon.discountTypeDesc} />
                    <InfoCard
                      label='折扣值'
                      value={`${coupon.currency === 'CNY' ? '¥' : coupon.currency}${coupon.discountValue}`}
                    />
                    <InfoCard
                      label='最大折扣金额'
                      value={coupon.maxDiscountAmount ? `${coupon.currency === 'CNY' ? '¥' : coupon.currency}${coupon.maxDiscountAmount}` : null}
                    />
                    <InfoCard
                      label='最低订单金额'
                      value={coupon.minOrderAmount ? `${coupon.currency === 'CNY' ? '¥' : coupon.currency}${(coupon.minOrderAmount / 100).toFixed(2)}` : null}
                    />
                  </div>
                </div>

                <Separator />

                {/* 适用范围 */}
                <div>
                  <h4 className='mb-4 text-sm font-semibold'>适用范围</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <InfoCard label='适用产品类型' value={coupon.applicableProductTypeDesc} />
                    <InfoCard
                      label='适用产品ID'
                      value={coupon.applicableProductIds?.length > 0 ? coupon.applicableProductIds.join(', ') : '全部'}
                    />
                  </div>
                </div>

                <Separator />

                {/* 归属信息 */}
                <div>
                  <h4 className='mb-4 text-sm font-semibold'>归属信息</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <InfoCard label='团队ID' value={coupon.teamId} copyable />
                    <InfoCard label='用户ID' value={coupon.userId} copyable />
                    <InfoCard label='关联优惠码ID' value={coupon.promoCodeId} copyable />
                    <InfoCard label='发放原因' value={coupon.grantReason} />
                  </div>
                </div>

                <Separator />

                {/* 时间信息 */}
                <div>
                  <h4 className='mb-4 text-sm font-semibold'>时间信息</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <InfoCard label='创建时间' value={coupon.createTime} />
                    <InfoCard label='过期时间' value={coupon.expireTime} />
                    <InfoCard label='使用时间' value={coupon.usedTime} />
                    <InfoCard label='使用的订单ID' value={coupon.usedOrderId} copyable />
                  </div>
                </div>

                {/* 扩展数据 */}
                {coupon.metadata && (
                  <>
                    <Separator />
                    <div>
                      <h4 className='mb-4 text-sm font-semibold'>扩展数据</h4>
                      <div className='rounded-lg border bg-muted/50 p-4'>
                        <pre className='text-xs text-muted-foreground whitespace-pre-wrap break-all'>
                          {coupon.metadata}
                        </pre>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {coupon && (
        <RevokeCouponDialog
          couponId={coupon.id}
          couponNo={coupon.couponNo}
          open={revokeDialogOpen}
          onOpenChange={setRevokeDialogOpen}
          onSuccess={handleRevokeSuccess}
        />
      )}
    </>
  )
}
