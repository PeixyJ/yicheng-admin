import { useState, useEffect } from 'react'
import { Check, Copy, RefreshCw, XCircle } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getPaymentOrderDetail } from '@/services/payment-order'
import type { AdminPaymentOrderDetailVO, OrderStatus } from '@/types/payment-order'

function CopyableField({ label, value }: { label: string; value: string | number | null }) {
  const [copied, setCopied] = useState(false)

  if (!value) return null

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

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: '待支付', variant: 'secondary' },
  PAID: { label: '已支付', variant: 'default' },
  FAILED: { label: '支付失败', variant: 'destructive' },
  CANCELLED: { label: '已取消', variant: 'outline' },
  REFUNDED: { label: '已退款', variant: 'secondary' },
  PARTIAL_REFUNDED: { label: '部分退款', variant: 'secondary' },
}

interface OrderDetailSheetProps {
  orderId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefund?: (order: AdminPaymentOrderDetailVO) => void
  onCancel?: (order: AdminPaymentOrderDetailVO) => void
}

export function OrderDetailSheet({
  orderId,
  open,
  onOpenChange,
  onRefund,
  onCancel,
}: OrderDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<AdminPaymentOrderDetailVO | null>(null)

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetail()
    }
  }, [open, orderId])

  const fetchOrderDetail = async () => {
    if (!orderId) return
    setLoading(true)
    try {
      const res = await getPaymentOrderDetail(orderId)
      if (res.code === 'success') {
        setOrder(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch order detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = order ? ORDER_STATUS_CONFIG[order.orderStatus] || { label: order.orderStatusDesc, variant: 'outline' as const } : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[560px] sm:max-w-[560px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>订单详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='mt-6 space-y-6'>
            <div className='space-y-3'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-32 w-full' />
            </div>
            <div className='space-y-3'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-32 w-full' />
            </div>
          </div>
        ) : order ? (
          <div className='mt-6 space-y-6'>
            {/* 基本信息 */}
            <div>
              <h3 className='text-sm font-semibold mb-2'>基本信息</h3>
              <div className='rounded-lg border p-4'>
                <CopyableField label='订单号' value={order.orderNo} />
                <Separator />
                <CopyableField label='团队ID' value={order.teamId} />
                <Separator />
                <CopyableField label='用户ID' value={order.userId} />
                <Separator />
                <InfoRow label='订单类型'>
                  <Badge variant='outline'>{order.orderTypeDesc}</Badge>
                </InfoRow>
                <Separator />
                <InfoRow label='订单状态'>
                  <Badge variant={statusConfig?.variant}>{statusConfig?.label}</Badge>
                </InfoRow>
                <Separator />
                <InfoRow label='创建时间'>
                  {dayjs(order.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </InfoRow>
                <Separator />
                <InfoRow label='更新时间'>
                  {dayjs(order.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                </InfoRow>
              </div>
            </div>

            {/* 金额信息 */}
            <div>
              <h3 className='text-sm font-semibold mb-2'>金额信息</h3>
              <div className='rounded-lg border p-4'>
                <InfoRow label='订单金额'>
                  <span className='text-lg font-bold'>{order.amountFormatted}</span>
                </InfoRow>
                <Separator />
                <InfoRow label='实付金额'>
                  <span className='text-green-600 font-semibold'>{order.amountPaidFormatted}</span>
                </InfoRow>
                <Separator />
                <InfoRow label='已退款金额'>
                  <span className={order.amountRefunded > 0 ? 'text-red-600' : 'text-muted-foreground'}>
                    {order.amountRefundedFormatted}
                  </span>
                </InfoRow>
                {order.canRefund && (
                  <>
                    <Separator />
                    <InfoRow label='可退金额'>
                      <span className='font-medium'>
                        {order.currencySymbol}{(order.refundableAmount / 100).toFixed(2)}
                      </span>
                    </InfoRow>
                  </>
                )}
              </div>
            </div>

            {/* 支付信息 */}
            <div>
              <h3 className='text-sm font-semibold mb-2'>支付信息</h3>
              <div className='rounded-lg border p-4'>
                <InfoRow label='支付渠道'>{order.paymentChannelDesc}</InfoRow>
                {order.paymentMethodDesc && (
                  <>
                    <Separator />
                    <InfoRow label='支付方式'>{order.paymentMethodDesc}</InfoRow>
                  </>
                )}
                {order.cardBrand && order.cardLast4 && (
                  <>
                    <Separator />
                    <InfoRow label='银行卡'>
                      {order.cardBrand} **** {order.cardLast4}
                    </InfoRow>
                  </>
                )}
                {order.paidTime && (
                  <>
                    <Separator />
                    <InfoRow label='支付时间'>
                      {dayjs(order.paidTime).format('YYYY-MM-DD HH:mm:ss')}
                    </InfoRow>
                  </>
                )}
                {order.expireTime && (
                  <>
                    <Separator />
                    <InfoRow label='过期时间'>
                      {dayjs(order.expireTime).format('YYYY-MM-DD HH:mm:ss')}
                    </InfoRow>
                  </>
                )}
              </div>
            </div>

            {/* 产品信息 */}
            <div>
              <h3 className='text-sm font-semibold mb-2'>产品信息</h3>
              <div className='rounded-lg border p-4'>
                <InfoRow label='产品类型'>{order.productTypeDesc}</InfoRow>
                {order.productId && (
                  <>
                    <Separator />
                    <CopyableField label='产品ID' value={order.productId} />
                  </>
                )}
                {order.planCode && (
                  <>
                    <Separator />
                    <CopyableField label='计划编码' value={order.planCode} />
                  </>
                )}
                <Separator />
                <InfoRow label='购买数量'>{order.quantity}</InfoRow>
              </div>
            </div>

            {/* 渠道信息（Stripe） */}
            {(order.channelOrderNo || order.channelCustomerId || order.stripeCustomerId) && (
              <div>
                <h3 className='text-sm font-semibold mb-2'>渠道信息</h3>
                <div className='rounded-lg border p-4'>
                  {order.channelOrderNo && (
                    <>
                      <CopyableField label='渠道订单号' value={order.channelOrderNo} />
                      <Separator />
                    </>
                  )}
                  {order.channelCustomerId && (
                    <>
                      <CopyableField label='渠道客户ID' value={order.channelCustomerId} />
                      <Separator />
                    </>
                  )}
                  {order.stripeCustomerId && (
                    <>
                      <CopyableField label='Stripe客户ID' value={order.stripeCustomerId} />
                      <Separator />
                    </>
                  )}
                  {order.stripePaymentIntentId && (
                    <>
                      <CopyableField label='Payment Intent ID' value={order.stripePaymentIntentId} />
                      <Separator />
                    </>
                  )}
                  {order.stripeChargeId && (
                    <>
                      <CopyableField label='Charge ID' value={order.stripeChargeId} />
                      <Separator />
                    </>
                  )}
                  {order.stripeInvoiceId && (
                    <>
                      <CopyableField label='Invoice ID' value={order.stripeInvoiceId} />
                      <Separator />
                    </>
                  )}
                  {order.stripeSubscriptionId && (
                    <>
                      <CopyableField label='Subscription ID' value={order.stripeSubscriptionId} />
                      <Separator />
                    </>
                  )}
                  {order.stripeSessionId && (
                    <CopyableField label='Session ID' value={order.stripeSessionId} />
                  )}
                </div>
              </div>
            )}

            {/* 失败原因 */}
            {order.failureReason && (
              <div>
                <h3 className='text-sm font-semibold mb-2'>失败原因</h3>
                <div className='rounded-lg border border-destructive/50 bg-destructive/5 p-4'>
                  <p className='text-sm text-destructive'>{order.failureReason}</p>
                </div>
              </div>
            )}

            {/* 扩展数据 */}
            {order.metadata && (
              <div>
                <h3 className='text-sm font-semibold mb-2'>扩展数据</h3>
                <div className='rounded-lg border p-4'>
                  <pre className='text-xs overflow-x-auto'>{order.metadata}</pre>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            {(order.canRefund || order.canCancel) && (
              <div className='flex items-center gap-3 pt-4'>
                {order.canRefund && (
                  <Button
                    variant='destructive'
                    onClick={() => onRefund?.(order)}
                    className='flex-1'
                  >
                    <RefreshCw className='mr-2 size-4' />
                    退款
                  </Button>
                )}
                {order.canCancel && (
                  <Button
                    variant='outline'
                    onClick={() => onCancel?.(order)}
                    className='flex-1'
                  >
                    <XCircle className='mr-2 size-4' />
                    取消订单
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className='mt-6 flex items-center justify-center h-32 text-muted-foreground'>
            订单信息加载失败
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
