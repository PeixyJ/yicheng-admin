import { useState } from 'react'
import { Check, Copy, Eye } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { AdminPaymentOrderVO, OrderStatus } from '@/types/payment-order'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-6 opacity-0 group-hover:opacity-100 transition-opacity'
      onClick={handleCopy}
    >
      {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
    </Button>
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

interface OrderTableProps {
  orders: AdminPaymentOrderVO[]
  loading: boolean
  onViewDetail?: (order: AdminPaymentOrderVO) => void
}

export function OrderTable({
  orders,
  loading,
  onViewDetail,
}: OrderTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-44'>订单号</TableHead>
            <TableHead className='w-20'>团队ID</TableHead>
            <TableHead className='w-20'>用户ID</TableHead>
            <TableHead className='w-24'>订单类型</TableHead>
            <TableHead className='w-24'>订单状态</TableHead>
            <TableHead className='w-24'>支付渠道</TableHead>
            <TableHead className='w-28'>订单金额</TableHead>
            <TableHead className='w-40'>支付时间</TableHead>
            <TableHead className='w-40'>创建时间</TableHead>
            <TableHead className='w-20'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-36' /></TableCell>
                <TableCell><Skeleton className='h-4 w-14' /></TableCell>
                <TableCell><Skeleton className='h-4 w-14' /></TableCell>
                <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-8 w-14' /></TableCell>
              </TableRow>
            ))
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const statusConfig = ORDER_STATUS_CONFIG[order.orderStatus] || { label: order.orderStatusDesc, variant: 'outline' as const }

              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className='group flex items-center gap-1'>
                      <span className='font-mono text-sm'>{order.orderNo}</span>
                      <CopyButton text={order.orderNo} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='group flex items-center gap-1'>
                      <span>{order.teamId}</span>
                      <CopyButton text={String(order.teamId)} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='group flex items-center gap-1'>
                      <span>{order.userId}</span>
                      <CopyButton text={String(order.userId)} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{order.orderTypeDesc}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground'>{order.paymentChannelDesc}</span>
                  </TableCell>
                  <TableCell>
                    <span className='font-medium'>{order.amountFormatted}</span>
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground'>
                      {order.paidTime ? dayjs(order.paidTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground'>
                      {dayjs(order.createTime).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onViewDetail?.(order)}
                    >
                      <Eye className='mr-1 size-3.5' />
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
