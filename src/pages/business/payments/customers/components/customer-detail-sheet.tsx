import { useState, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/pagination'
import { getPaymentCustomerDetail, getCustomerOrders } from '@/services/payment-customer'
import type { AdminPaymentCustomerVO } from '@/types/payment-customer'
import type { AdminPaymentOrderVO, OrderStatus } from '@/types/payment-order'

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

interface CustomerDetailSheetProps {
  customerId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailSheet({
  customerId,
  open,
  onOpenChange,
}: CustomerDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState<AdminPaymentCustomerVO | null>(null)

  // 订单列表状态
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orders, setOrders] = useState<AdminPaymentOrderVO[]>([])
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [ordersPage, setOrdersPage] = useState(1)
  const [ordersPageSize, setOrdersPageSize] = useState(10)

  useEffect(() => {
    if (open && customerId) {
      fetchCustomerDetail()
      setOrdersPage(1)
    }
  }, [open, customerId])

  useEffect(() => {
    if (open && customerId) {
      fetchOrders()
    }
  }, [open, customerId, ordersPage, ordersPageSize])

  const fetchCustomerDetail = async () => {
    if (!customerId) return
    setLoading(true)
    try {
      const res = await getPaymentCustomerDetail(customerId)
      if (res.code === 'success') {
        setCustomer(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch customer detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    if (!customerId) return
    setOrdersLoading(true)
    try {
      const res = await getCustomerOrders(customerId, {
        page: ordersPage,
        size: ordersPageSize,
      })
      if (res.code === 'success') {
        setOrders(res.data.records)
        setOrdersTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch customer orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleOrdersPageChange = (newPage: number, newPageSize: number) => {
    setOrdersPage(newPage)
    setOrdersPageSize(newPageSize)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[640px] sm:max-w-[640px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>客户详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='mt-6 space-y-6'>
            <div className='space-y-3'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-32 w-full' />
            </div>
          </div>
        ) : customer ? (
          <Tabs defaultValue='info' className='mt-6'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='info'>基本信息</TabsTrigger>
              <TabsTrigger value='orders'>订单记录</TabsTrigger>
            </TabsList>

            <TabsContent value='info' className='mt-4 space-y-6'>
              {/* 基本信息 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>基本信息</h3>
                <div className='rounded-lg border p-4'>
                  <CopyableField label='ID' value={customer.id} />
                  <Separator />
                  <CopyableField label='团队ID' value={customer.teamId} />
                  <Separator />
                  <CopyableField label='用户ID' value={customer.userId} />
                  <Separator />
                  <CopyableField label='Stripe客户ID' value={customer.stripeCustomerId} />
                </div>
              </div>

              {/* 联系信息 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>联系信息</h3>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='邮箱'>
                    {customer.email || <span className='text-muted-foreground'>-</span>}
                  </InfoRow>
                  <Separator />
                  <InfoRow label='名称'>
                    {customer.name || <span className='text-muted-foreground'>-</span>}
                  </InfoRow>
                </div>
              </div>

              {/* 支付信息 */}
              {customer.defaultPaymentMethod && (
                <div>
                  <h3 className='text-sm font-semibold mb-2'>支付信息</h3>
                  <div className='rounded-lg border p-4'>
                    <CopyableField label='默认支付方式ID' value={customer.defaultPaymentMethod} />
                  </div>
                </div>
              )}

              {/* 时间信息 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>时间信息</h3>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='创建时间'>
                    {dayjs(customer.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </InfoRow>
                  <Separator />
                  <InfoRow label='更新时间'>
                    {dayjs(customer.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                  </InfoRow>
                </div>
              </div>

              {/* 元数据 */}
              {customer.metadata && (
                <div>
                  <h3 className='text-sm font-semibold mb-2'>元数据</h3>
                  <div className='rounded-lg border p-4'>
                    <pre className='text-xs overflow-x-auto whitespace-pre-wrap'>
                      {customer.metadata}
                    </pre>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value='orders' className='mt-4 space-y-4'>
              <div className='rounded-lg border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-36'>订单号</TableHead>
                      <TableHead className='w-24'>订单类型</TableHead>
                      <TableHead className='w-24'>状态</TableHead>
                      <TableHead className='w-28'>金额</TableHead>
                      <TableHead className='w-40'>支付时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersLoading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className='h-4 w-28' /></TableCell>
                          <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                          <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                          <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                          <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                        </TableRow>
                      ))
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
                          暂无订单记录
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => {
                        const statusConfig = ORDER_STATUS_CONFIG[order.orderStatus] || { label: order.orderStatusDesc, variant: 'outline' as const }
                        return (
                          <TableRow key={order.id}>
                            <TableCell>
                              <span className='font-mono text-sm'>{order.orderNo}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant='outline'>{order.orderTypeDesc}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className='font-medium'>{order.amountFormatted}</span>
                            </TableCell>
                            <TableCell>
                              <span className='text-muted-foreground text-sm'>
                                {order.paidTime ? dayjs(order.paidTime).format('YYYY-MM-DD HH:mm') : '-'}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {ordersTotal > 0 && (
                <Pagination
                  current={ordersPage}
                  total={ordersTotal}
                  pageSize={ordersPageSize}
                  onChange={handleOrdersPageChange}
                />
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className='mt-6 flex items-center justify-center h-32 text-muted-foreground'>
            客户信息加载失败
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
