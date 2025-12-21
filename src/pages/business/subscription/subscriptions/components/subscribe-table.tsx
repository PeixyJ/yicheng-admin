import { useState } from 'react'
import { ArrowUpCircle, Check, Copy, XCircle, MessageSquareText } from 'lucide-react'

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { AdminSubscribeVO, SubscribeStatus, SubscribeSource } from '@/types/subscribe'

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

interface SubscribeTableProps {
  subscribes: AdminSubscribeVO[]
  loading: boolean
  onUpgrade?: (subscribe: AdminSubscribeVO) => void
  onCancel?: (subscribe: AdminSubscribeVO) => void
}

function getStatusBadge(status: SubscribeStatus) {
  switch (status) {
    case 'PENDING':
      return <Badge variant='secondary'>待生效</Badge>
    case 'ACTIVE':
      return <Badge variant='default'>生效中</Badge>
    case 'EXPIRED':
      return <Badge variant='outline'>已过期</Badge>
    case 'CANCELLED':
      return <Badge variant='destructive'>已取消</Badge>
    case 'UPGRADED':
      return <Badge variant='secondary'>已升级</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

function getSourceBadge(source: SubscribeSource) {
  switch (source) {
    case 'PURCHASE':
      return <Badge variant='outline'>购买</Badge>
    case 'GRANT':
      return <Badge variant='secondary'>赠送</Badge>
    case 'SYSTEM':
      return <Badge variant='default'>系统</Badge>
    default:
      return <Badge variant='secondary'>{source}</Badge>
  }
}

export function SubscribeTable({
  subscribes,
  loading,
  onUpgrade,
  onCancel,
}: SubscribeTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>团队</TableHead>
            <TableHead>订阅计划</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>来源</TableHead>
            <TableHead>席位</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
            <TableHead>订单ID</TableHead>
            <TableHead>赠送信息</TableHead>
            <TableHead className='w-16'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                <TableCell><Skeleton className='h-4 w-12' /></TableCell>
                <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                <TableCell><Skeleton className='h-5 w-14' /></TableCell>
                <TableCell><Skeleton className='h-5 w-12' /></TableCell>
                <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-4 w-12' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-8 w-8' /></TableCell>
              </TableRow>
            ))
          ) : subscribes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            subscribes.map((subscribe) => (
              <TableRow key={subscribe.id}>
                <TableCell className='font-medium'>
                  <div className='group flex items-center gap-1'>
                    <span>{subscribe.id}</span>
                    <CopyButton text={String(subscribe.id)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='space-y-0.5'>
                    <div className='group flex items-center gap-1'>
                      <span className='font-medium'>{subscribe.teamName || '-'}</span>
                      {subscribe.teamName && <CopyButton text={subscribe.teamName} />}
                    </div>
                    <div className='group flex items-center gap-1'>
                      <span className='text-xs text-muted-foreground'>ID: {subscribe.teamId}</span>
                      <CopyButton text={String(subscribe.teamId)} />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {subscribe.planId ? (
                    <div className='space-y-0.5'>
                      <div className='group flex items-center gap-1'>
                        <span className='font-medium'>{subscribe.planName || '-'}</span>
                        {subscribe.planName && <CopyButton text={subscribe.planName} />}
                      </div>
                      <div className='group flex items-center gap-1'>
                        <span className='text-xs text-muted-foreground'>ID: {subscribe.planId}</span>
                        <CopyButton text={String(subscribe.planId)} />
                      </div>
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(subscribe.status)}</TableCell>
                <TableCell>{getSourceBadge(subscribe.source)}</TableCell>
                <TableCell>{subscribe.seats}</TableCell>
                <TableCell>{subscribe.startTime}</TableCell>
                <TableCell>
                  {subscribe.endTime || <span className='text-muted-foreground'>永久</span>}
                </TableCell>
                <TableCell>
                  {subscribe.orderId ? (
                    <div className='group flex items-center gap-1'>
                      <span>{subscribe.orderId}</span>
                      <CopyButton text={String(subscribe.orderId)} />
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>
                <TableCell>
                  {subscribe.source === 'GRANT' && subscribe.grantUserId ? (
                    <div className='flex items-center gap-1.5 text-sm'>
                      <div className='group flex items-center gap-1'>
                        <span>
                          {subscribe.grantUserNickname || subscribe.grantUserNo || subscribe.grantUserId}
                        </span>
                        <CopyButton text={String(subscribe.grantUserId)} />
                      </div>
                      {subscribe.grantReason && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <MessageSquareText className='size-4 text-muted-foreground cursor-help' />
                          </TooltipTrigger>
                          <TooltipContent className='max-w-64'>
                            <p>{subscribe.grantReason}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>
                <TableCell>
                  {subscribe.status === 'ACTIVE' ? (
                    <div className='flex items-center gap-1'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8'
                            onClick={() => onUpgrade?.(subscribe)}
                          >
                            <ArrowUpCircle className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>升级订阅</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8 text-destructive hover:text-destructive'
                            onClick={() => onCancel?.(subscribe)}
                          >
                            <XCircle className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>取消订阅</TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <span className='text-muted-foreground text-sm'>-</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
