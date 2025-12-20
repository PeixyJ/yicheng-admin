import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { AdminFeedbackVO, FeedbackStatus, FeedbackType, FeedbackPriority } from '@/types/feedback'

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

interface FeedbackTableProps {
  feedbacks: AdminFeedbackVO[]
  loading: boolean
  onFeedbackClick?: (feedbackId: number) => void
}

function getStatusBadge(status: FeedbackStatus) {
  switch (status) {
    case 'PENDING':
      return <Badge variant='secondary'>待处理</Badge>
    case 'PROCESSING':
      return <Badge variant='default'>处理中</Badge>
    case 'RESOLVED':
      return <Badge className='bg-green-500 hover:bg-green-600'>已解决</Badge>
    case 'CLOSED':
      return <Badge variant='outline'>已关闭</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

function getFeedbackTypeBadge(type: FeedbackType) {
  switch (type) {
    case 'BUG':
      return <Badge variant='destructive'>Bug</Badge>
    case 'FEATURE':
      return <Badge className='bg-blue-500 hover:bg-blue-600'>功能建议</Badge>
    case 'COMPLAINT':
      return <Badge className='bg-orange-500 hover:bg-orange-600'>投诉</Badge>
    case 'QUESTION':
      return <Badge variant='secondary'>咨询</Badge>
    case 'OTHER':
      return <Badge variant='outline'>其他</Badge>
    default:
      return <Badge variant='outline'>{type}</Badge>
  }
}

function getPriorityBadge(priority: FeedbackPriority) {
  switch (priority) {
    case 'LOW':
      return <Badge variant='outline'>低</Badge>
    case 'NORMAL':
      return <Badge variant='secondary'>普通</Badge>
    case 'HIGH':
      return <Badge className='bg-orange-500 hover:bg-orange-600'>高</Badge>
    case 'URGENT':
      return <Badge variant='destructive'>紧急</Badge>
    default:
      return <Badge variant='outline'>{priority}</Badge>
  }
}

export function FeedbackTable({ feedbacks, loading, onFeedbackClick }: FeedbackTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>标题</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>优先级</TableHead>
            <TableHead>用户</TableHead>
            <TableHead>处理人</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>处理时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className='h-4 w-8' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-48' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-14' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
              </TableRow>
            ))
          ) : feedbacks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            feedbacks.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell className='font-medium'>
                  <div className='group flex items-center gap-1'>
                    <span>{feedback.id}</span>
                    <CopyButton text={String(feedback.id)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className='max-w-[200px] truncate cursor-pointer hover:text-primary transition-colors'
                    onClick={() => onFeedbackClick?.(feedback.id)}
                    title={feedback.title}
                  >
                    {feedback.title}
                  </div>
                </TableCell>
                <TableCell>{getFeedbackTypeBadge(feedback.feedbackType)}</TableCell>
                <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                <TableCell>{getPriorityBadge(feedback.priority)}</TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <span className='text-sm'>{feedback.userNickname}</span>
                    <CopyButton text={String(feedback.userId)} />
                  </div>
                </TableCell>
                <TableCell>
                  {feedback.handlerNickname ? (
                    <div className='group flex items-center gap-1'>
                      <span className='text-sm'>{feedback.handlerNickname}</span>
                      <CopyButton text={String(feedback.handlerId)} />
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {feedback.createTime}
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {feedback.handleTime || '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
