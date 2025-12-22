import { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Gift,
  Minus,
  RefreshCw,
  Settings2,
  ShoppingCart,
  Zap,
} from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { PointTransactionRecordVO, TransactionType } from '@/types/point'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(text))
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

function InfoCard({ label, value, className }: { label: string; value: string | number | null | undefined; className?: string }) {
  return (
    <div className={`rounded-lg border bg-card p-4 ${className ?? ''}`}>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className='mt-1 text-sm font-medium'>{value ?? '-'}</p>
    </div>
  )
}

function CopyableField({ label, value }: { label: string; value: string | number | null }) {
  if (!value) return null

  return (
    <div className='group flex items-center justify-between py-2'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='flex items-center gap-2'>
        <span className='font-medium font-mono text-sm'>{value}</span>
        <Button
          variant='ghost'
          size='icon'
          className='size-6 opacity-0 group-hover:opacity-100 transition-opacity'
          onClick={async () => {
            await navigator.clipboard.writeText(String(value))
          }}
        >
          <Copy className='size-3.5' />
        </Button>
      </div>
    </div>
  )
}
const TRANSACTION_TYPE_CONFIG: Record<TransactionType, {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: React.ElementType
  iconBg: string
  iconColor: string
}> = {
  PURCHASE: {
    label: '购买',
    variant: 'default',
    icon: ShoppingCart,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  CONSUME: {
    label: '消费',
    variant: 'secondary',
    icon: Zap,
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
  GRANT: {
    label: '赠送',
    variant: 'default',
    icon: Gift,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-500',
  },
  ADJUST: {
    label: '调整',
    variant: 'outline',
    icon: Settings2,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  EXPIRE: {
    label: '过期',
    variant: 'destructive',
    icon: Clock,
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
  },
  REFUND: {
    label: '退款',
    variant: 'secondary',
    icon: RefreshCw,
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
}

interface TransactionDetailSheetProps {
  transaction: PointTransactionRecordVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetailSheet({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailSheetProps) {
  if (!transaction) return null

  const typeConfig = TRANSACTION_TYPE_CONFIG[transaction.type]
  const points = transaction.points
  const isPositive = points > 0
  const isNegative = points < 0
  const balanceBefore = transaction.balanceAfter - points
  const IconComponent = typeConfig.icon

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[520px] sm:max-w-[520px] overflow-y-auto p-0'>
        <SheetHeader className='border-b px-6 py-4'>
          <SheetTitle>交易详情</SheetTitle>
        </SheetHeader>

        {/* Hero Section */}
        <div className='border-b bg-muted/30 px-6 py-6'>
          <div className='flex items-start gap-4'>
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${typeConfig.iconBg}`}>
              <IconComponent className={`h-7 w-7 ${typeConfig.iconColor}`} />
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <span className='font-mono text-sm text-muted-foreground'>{transaction.transactionNo}</span>
                <CopyButton text={transaction.transactionNo} />
              </div>
              <div className='mt-1 flex items-center gap-2'>
                <Badge variant={typeConfig.variant} className='text-sm'>
                  {typeConfig.label}
                </Badge>
                <span className='text-xs text-muted-foreground'>
                  {dayjs(transaction.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
            </div>
          </div>

          {/* Points Summary Cards */}
          <div className='mt-5 grid grid-cols-2 gap-4'>
            <div className='rounded-xl border bg-card p-4'>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                {isPositive ? (
                  <ArrowDownLeft className='size-3.5 text-green-500' />
                ) : isNegative ? (
                  <ArrowUpRight className='size-3.5 text-red-500' />
                ) : (
                  <Minus className='size-3.5' />
                )}
                变动点数
              </div>
              <p className={`mt-2 text-2xl font-bold tabular-nums ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : ''}`}>
                {isPositive ? '+' : ''}{points.toLocaleString()}
              </p>
            </div>
            <div className='rounded-xl border bg-card p-4'>
              <p className='text-xs text-muted-foreground'>变动后余额</p>
              <p className='mt-2 text-2xl font-bold tabular-nums'>
                {transaction.balanceAfter.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-6 p-6'>
          {/* Team Info Section */}
          <div>
            <h4 className='mb-3 text-sm font-semibold'>团队信息</h4>
            <div className='flex items-center gap-4 rounded-lg border bg-card p-4'>
              <Avatar className='size-12'>
                <AvatarImage src={transaction.teamLogoUrl ?? undefined} />
                <AvatarFallback className='text-sm'>
                  {transaction.teamName?.charAt(0) ?? 'T'}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <p className='font-medium'>{transaction.teamName ?? '-'}</p>
                <div className='mt-0.5 flex items-center gap-2 text-sm text-muted-foreground'>
                  <span>{transaction.teamTypeDesc ?? '-'}</span>
                  <span>·</span>
                  <span>ID: {transaction.teamId}</span>
                  <CopyButton text={String(transaction.teamId)} />
                </div>
              </div>
            </div>
          </div>

          {/* Points Change Section */}
          <div>
            <h4 className='mb-3 text-sm font-semibold'>点数变动详情</h4>
            <div className='grid grid-cols-2 gap-3'>
              <InfoCard label='变动前点数' value={balanceBefore.toLocaleString()} />
              <InfoCard label='变动后点数' value={transaction.balanceAfter.toLocaleString()} />
            </div>
          </div>

          {/* Related Info Section */}
          {(transaction.orderId || transaction.batchId || transaction.bizId || transaction.featureCode || transaction.remark) && (
            <div>
              <h4 className='mb-3 text-sm font-semibold'>关联信息</h4>
              <div className='rounded-lg border p-4'>
                {transaction.orderId && (
                  <>
                    <CopyableField label='关联订单ID' value={transaction.orderId} />
                    {(transaction.batchId || transaction.bizId || transaction.featureCode || transaction.remark) && <Separator />}
                  </>
                )}
                {transaction.batchId && (
                  <>
                    <CopyableField label='关联批次ID' value={transaction.batchId} />
                    {(transaction.bizId || transaction.featureCode || transaction.remark) && <Separator />}
                  </>
                )}
                {transaction.bizId && (
                  <>
                    <CopyableField label='业务幂等ID' value={transaction.bizId} />
                    {(transaction.featureCode || transaction.remark) && <Separator />}
                  </>
                )}
                {transaction.featureCode && (
                  <>
                    <CopyableField label='功能编码' value={transaction.featureCode} />
                    {transaction.remark && <Separator />}
                  </>
                )}
                {transaction.remark && (
                  <div className='py-2'>
                    <span className='text-sm text-muted-foreground'>备注</span>
                    <p className='mt-1 text-sm bg-muted/50 rounded-md p-3'>{transaction.remark}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Operator Info Section */}
          {transaction.operatorId && (
            <div>
              <h4 className='mb-3 text-sm font-semibold'>操作信息</h4>
              <div className='rounded-lg border p-4'>
                <CopyableField label='操作人ID' value={transaction.operatorName} />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
