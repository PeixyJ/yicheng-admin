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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { AdminPaymentEventVO, EventProcessStatus } from '@/types/payment-event'

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

const STATUS_CONFIG: Record<EventProcessStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: '待处理', variant: 'secondary' },
  PROCESSING: { label: '处理中', variant: 'default' },
  SUCCESS: { label: '成功', variant: 'default' },
  FAILED: { label: '失败', variant: 'destructive' },
  SKIPPED: { label: '已跳过', variant: 'outline' },
  PERMANENTLY_FAILED: { label: '永久失败', variant: 'destructive' },
}

interface EventTableProps {
  events: AdminPaymentEventVO[]
  loading: boolean
  onViewDetail?: (event: AdminPaymentEventVO) => void
}

export function EventTable({
  events,
  loading,
  onViewDetail,
}: EventTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead className='w-52'>Stripe事件ID</TableHead>
            <TableHead className='w-48'>事件类型</TableHead>
            <TableHead className='w-24'>状态</TableHead>
            <TableHead className='w-20'>重试次数</TableHead>
            <TableHead className='w-40'>处理时间</TableHead>
            <TableHead className='w-40'>创建时间</TableHead>
            <TableHead className='w-20'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-10' /></TableCell>
                <TableCell><Skeleton className='h-4 w-44' /></TableCell>
                <TableCell><Skeleton className='h-4 w-36' /></TableCell>
                <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-8 w-14' /></TableCell>
              </TableRow>
            ))
          ) : events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => {
              const statusConfig = STATUS_CONFIG[event.processStatus] || { label: event.processStatusDesc, variant: 'outline' as const }
              return (
                <TableRow key={event.id}>
                  <TableCell>
                    <span className='font-medium'>{event.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className='group flex items-center gap-1'>
                      <span className='font-mono text-sm truncate max-w-40'>{event.stripeEventId}</span>
                      <CopyButton text={event.stripeEventId} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='font-mono text-sm'>{event.eventType}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className='font-medium'>{event.retryCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground text-sm'>
                      {event.processTime ? dayjs(event.processTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground text-sm'>
                      {dayjs(event.createTime).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onViewDetail?.(event)}
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
