import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
            <TableHead>团队</TableHead>
            <TableHead>用户</TableHead>
            <TableHead className='w-24'>订单类型</TableHead>
            <TableHead className='w-24'>订单状态</TableHead>
            <TableHead className='w-24'>支付渠道</TableHead>
            <TableHead className='w-28'>订单金额</TableHead>
            <TableHead className='w-40'>支付时间</TableHead>
            <TableHead className='w-40'>创建时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-36' /></TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='size-8 rounded-full' />
                    <div className='space-y-1'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-3 w-14' />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='size-8 rounded-full' />
                    <div className='space-y-1'>
                      <Skeleton className='h-4 w-16' />
                      <Skeleton className='h-3 w-14' />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
              </TableRow>
            ))
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className='h-24 text-center text-muted-foreground'>
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
                      <button
                        type='button'
                        className='font-mono text-sm text-primary hover:underline cursor-pointer'
                        onClick={() => onViewDetail?.(order)}
                      >
                        {order.orderNo}
                      </button>
                      <CopyButton text={order.orderNo} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-8'>
                        <AvatarImage src={order.teamLogoUrl ?? undefined} />
                        <AvatarFallback className='text-xs'>
                          {order.teamName?.charAt(0) || 'T'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='space-y-0.5'>
                        <div className='group flex items-center gap-1'>
                          <span className='font-medium text-sm'>{order.teamName || '-'}</span>
                          {order.teamName && <CopyButton text={order.teamName} />}
                        </div>
                        <div className='group flex items-center gap-1'>
                          <span className='text-xs text-muted-foreground'>ID: {order.teamId}</span>
                          <CopyButton text={String(order.teamId)} />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-8'>
                        <AvatarImage src={order.userAvatarUrl ?? undefined} />
                        <AvatarFallback className='text-xs'>
                          {order.userNickname?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='space-y-0.5'>
                        <div className='group flex items-center gap-1'>
                          <span className='font-medium text-sm'>{order.userNickname || '-'}</span>
                          {order.userNickname && <CopyButton text={order.userNickname} />}
                        </div>
                        <div className='group flex items-center gap-1'>
                          <span className='text-xs text-muted-foreground'>ID: {order.userId}</span>
                          <CopyButton text={String(order.userId)} />
                        </div>
                      </div>
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
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
