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
import type { PointTransactionRecordVO, TransactionType } from '@/types/point'

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

const TRANSACTION_TYPE_CONFIG: Record<TransactionType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PURCHASE: { label: '购买', variant: 'default' },
  CONSUME: { label: '消费', variant: 'secondary' },
  GRANT: { label: '赠送', variant: 'default' },
  ADJUST: { label: '调整', variant: 'outline' },
  EXPIRE: { label: '过期', variant: 'destructive' },
  REFUND: { label: '退款', variant: 'secondary' },
}

interface TransactionTableProps {
  transactions: PointTransactionRecordVO[]
  loading: boolean
  onViewDetail?: (transaction: PointTransactionRecordVO) => void
}

export function TransactionTable({
  transactions,
  loading,
  onViewDetail,
}: TransactionTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-44'>交易单号</TableHead>
            <TableHead className='w-48'>团队信息</TableHead>
            <TableHead className='w-24'>交易类型</TableHead>
            <TableHead className='w-28'>变动点数</TableHead>
            <TableHead className='w-28'>变动前点数</TableHead>
            <TableHead className='w-28'>变动后点数</TableHead>
            <TableHead className='w-40'>交易时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='size-8 rounded-full' />
                    <div className='space-y-1'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-3 w-12' />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className='h-5 w-14' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
              </TableRow>
            ))
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => {
              const typeConfig = TRANSACTION_TYPE_CONFIG[transaction.type]
              const points = transaction.points
              const isPositive = points > 0
              const isNegative = points < 0
              const balanceBefore = transaction.balanceAfter - points

              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className='group flex items-center gap-1'>
                      <button
                        type='button'
                        className='font-mono text-sm text-primary hover:underline cursor-pointer'
                        onClick={() => onViewDetail?.(transaction)}
                      >
                        {transaction.transactionNo}
                      </button>
                      <CopyButton text={transaction.transactionNo} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-8'>
                        <AvatarImage src={transaction.teamLogoUrl ?? undefined} />
                        <AvatarFallback className='text-xs'>
                          {transaction.teamName?.charAt(0) ?? 'T'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>{transaction.teamName ?? '-'}</span>
                        <span className='text-xs text-muted-foreground'>{transaction.teamTypeDesc ?? '-'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={typeConfig.variant}>
                      {typeConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : ''}`}>
                      {isPositive ? '+' : ''}{points.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground'>{balanceBefore.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className='font-medium'>{transaction.balanceAfter.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground'>
                      {dayjs(transaction.createTime).format('YYYY-MM-DD HH:mm:ss')}
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
