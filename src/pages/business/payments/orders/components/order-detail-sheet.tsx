import { useState, useEffect } from 'react'
import { Check, Copy, RefreshCw, XCircle, CreditCard, Package, Building2, Clock } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getPaymentOrderDetail } from '@/services/payment-order'
import type { AdminPaymentOrderDetailVO, OrderStatus } from '@/types/payment-order'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type='button'
      className='p-1 rounded hover:bg-accent transition-colors'
      onClick={handleCopy}
    >
      {copied ? <Check className='size-3.5 text-green-500' /> : <Copy className='size-3.5 text-muted-foreground' />}
    </button>
  )
}

function InfoItem({ label, value, copyable = false, mono = false }: {
  label: string
  value: React.ReactNode
  copyable?: boolean
  mono?: boolean
}) {
  const isString = typeof value === 'string' || typeof value === 'number'

  return (
    <div className='flex items-center justify-between py-1.5'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='flex items-center gap-1'>
        <span className={`text-sm ${mono ? 'font-mono' : ''}`}>{value}</span>
        {copyable && isString && <CopyButton text={String(value)} />}
      </div>
    </div>
  )
}

function SectionCard({
  title,
  icon: Icon,
  children
}: {
  title: string
  icon?: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className='rounded-lg border bg-card'>
      <div className='flex items-center gap-2 px-4 py-3 border-b bg-muted/30'>
        {Icon && <Icon className='size-4 text-muted-foreground' />}
        <h3 className='text-sm font-medium'>{title}</h3>
      </div>
      <div className='px-4 py-2'>
        {children}
      </div>
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

  // 渠道信息列表
  const channelInfos = order ? [
    { label: '渠道订单号', value: order.channelOrderNo },
    { label: '渠道客户ID', value: order.channelCustomerId },
    { label: 'Stripe客户ID', value: order.stripeCustomerId },
    { label: 'Payment Intent', value: order.stripePaymentIntentId },
    { label: 'Charge ID', value: order.stripeChargeId },
    { label: 'Invoice ID', value: order.stripeInvoiceId },
    { label: 'Subscription ID', value: order.stripeSubscriptionId },
    { label: 'Session ID', value: order.stripeSessionId },
  ].filter(item => item.value) : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[520px] sm:max-w-[520px] flex flex-col p-0 h-full'>
        <SheetHeader className='px-6 py-4 border-b shrink-0'>
          <SheetTitle className='flex items-center gap-3'>
            <span>订单详情</span>
            {statusConfig && (
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto'>
          <div className='p-6'>
            {loading ? (
              <div className='space-y-4'>
                <Skeleton className='h-32 w-full rounded-lg' />
                <Skeleton className='h-24 w-full rounded-lg' />
                <Skeleton className='h-24 w-full rounded-lg' />
              </div>
            ) : order ? (
              <div className='space-y-4'>
                {/* 订单摘要卡片 */}
                <div className='rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-4'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                      <span>订单号</span>
                      <span className='font-mono font-medium text-foreground'>{order.orderNo}</span>
                      <CopyButton text={order.orderNo} />
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-4'>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-primary'>{order.amountFormatted}</div>
                      <div className='text-xs text-muted-foreground mt-1'>订单金额</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-green-600'>{order.amountPaidFormatted}</div>
                      <div className='text-xs text-muted-foreground mt-1'>实付金额</div>
                    </div>
                    <div className='text-center'>
                      <div className={`text-2xl font-bold ${order.amountRefunded > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {order.amountRefundedFormatted}
                      </div>
                      <div className='text-xs text-muted-foreground mt-1'>已退金额</div>
                    </div>
                  </div>

                  {order.canRefund && (
                    <div className='mt-3 pt-3 border-t border-primary/10 text-center'>
                      <span className='text-sm text-muted-foreground'>可退金额：</span>
                      <span className='font-medium text-orange-500'>
                        {order.currencySymbol}{(order.refundableAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* 团队与用户 */}
                <div className='rounded-lg border p-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <div className='text-xs text-muted-foreground mb-2'>团队</div>
                      <div className='flex items-center gap-3'>
                        <Avatar className='size-10'>
                          <AvatarImage src={order.teamLogoUrl ?? undefined} />
                          <AvatarFallback>{order.teamName?.charAt(0) || 'T'}</AvatarFallback>
                        </Avatar>
                        <div className='min-w-0'>
                          <div className='text-sm font-medium truncate'>{order.teamName || '-'}</div>
                          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <span>ID: {order.teamId}</span>
                            <CopyButton text={String(order.teamId)} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className='text-xs text-muted-foreground mb-2'>用户</div>
                      <div className='flex items-center gap-3'>
                        <Avatar className='size-10'>
                          <AvatarImage src={order.userAvatarUrl ?? undefined} />
                          <AvatarFallback>{order.userNickname?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className='min-w-0'>
                          <div className='text-sm font-medium truncate'>{order.userNickname || '-'}</div>
                          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <span>ID: {order.userId}</span>
                            <CopyButton text={String(order.userId)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 订单信息 */}
                <SectionCard title='订单信息' icon={Package}>
                  <InfoItem label='订单类型' value={<Badge variant='outline'>{order.orderTypeDesc}</Badge>} />
                  <InfoItem label='产品类型' value={order.productTypeDesc} />
                  {order.productId && (
                    <InfoItem label='产品ID' value={order.productId} copyable mono />
                  )}
                  {order.planCode && (
                    <InfoItem label='计划编码' value={order.planCode} copyable mono />
                  )}
                  <InfoItem label='购买数量' value={order.quantity} />
                </SectionCard>

                {/* 支付信息 */}
                <SectionCard title='支付信息' icon={CreditCard}>
                  <InfoItem label='支付渠道' value={order.paymentChannelDesc} />
                  {order.paymentMethodDesc && (
                    <InfoItem label='支付方式' value={order.paymentMethodDesc} />
                  )}
                  {order.cardBrand && order.cardLast4 && (
                    <InfoItem label='银行卡' value={`${order.cardBrand} **** ${order.cardLast4}`} />
                  )}
                  {order.paidTime && (
                    <InfoItem label='支付时间' value={dayjs(order.paidTime).format('YYYY-MM-DD HH:mm:ss')} />
                  )}
                  {order.expireTime && (
                    <InfoItem label='过期时间' value={dayjs(order.expireTime).format('YYYY-MM-DD HH:mm:ss')} />
                  )}
                </SectionCard>

                {/* 时间信息 */}
                <SectionCard title='时间信息' icon={Clock}>
                  <InfoItem label='创建时间' value={dayjs(order.createTime).format('YYYY-MM-DD HH:mm:ss')} />
                  <InfoItem label='更新时间' value={dayjs(order.updateTime).format('YYYY-MM-DD HH:mm:ss')} />
                </SectionCard>

                {/* 渠道信息 */}
                {channelInfos.length > 0 && (
                  <SectionCard title='渠道信息' icon={Building2}>
                    {channelInfos.map((info) => (
                      <InfoItem key={info.label} label={info.label} value={info.value!} copyable mono />
                    ))}
                  </SectionCard>
                )}

                {/* 失败原因 */}
                {order.failureReason && (
                  <div className='rounded-lg border border-destructive/30 bg-destructive/5 p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <XCircle className='size-4 text-destructive' />
                      <span className='text-sm font-medium text-destructive'>失败原因</span>
                    </div>
                    <p className='text-sm text-destructive/80'>{order.failureReason}</p>
                  </div>
                )}

                {/* 扩展数据 */}
                {order.metadata && (
                  <div className='rounded-lg border p-4'>
                    <h4 className='text-sm font-medium mb-2'>扩展数据</h4>
                    <pre className='text-xs bg-muted/50 rounded p-2 overflow-x-auto'>{order.metadata}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center justify-center h-32 text-muted-foreground'>
                订单信息加载失败
              </div>
            )}
          </div>
        </div>

        {/* 固定底部操作栏 */}
        {order && (order.canRefund || order.canCancel) && (
          <SheetFooter className='px-6 py-4 border-t bg-background shrink-0'>
            <div className='flex items-center gap-3 w-full'>
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
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
