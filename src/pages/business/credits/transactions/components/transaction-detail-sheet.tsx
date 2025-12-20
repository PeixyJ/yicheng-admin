import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
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
import type { PointTransactionRecordVO, TransactionType } from '@/types/point'

function CopyableField({ label, value }: { label: string; value: string | number }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(value))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className='group flex items-center justify-between py-2'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='flex items-center gap-2'>
        <span className='font-medium'>{value}</span>
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

const TRANSACTION_TYPE_CONFIG: Record<TransactionType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PURCHASE: { label: '购买', variant: 'default' },
  CONSUME: { label: '消费', variant: 'secondary' },
  GRANT: { label: '赠送', variant: 'default' },
  ADJUST: { label: '调整', variant: 'outline' },
  EXPIRE: { label: '过期', variant: 'destructive' },
  REFUND: { label: '退款', variant: 'secondary' },
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[480px] sm:max-w-[480px]'>
        <SheetHeader>
          <SheetTitle>交易详情</SheetTitle>
        </SheetHeader>

        <div className='mt-6 space-y-6'>
          {/* 基本信息 */}
          <div>
            <h3 className='text-sm font-semibold mb-2'>基本信息</h3>
            <div className='rounded-lg border p-4'>
              <CopyableField label='交易单号' value={transaction.transactionNo} />
              <Separator />
              <CopyableField label='团队ID' value={transaction.teamId} />
              <Separator />
              <InfoRow label='交易类型'>
                <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
              </InfoRow>
              <Separator />
              <InfoRow label='交易时间'>
                {dayjs(transaction.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </InfoRow>
            </div>
          </div>

          {/* 点数变动 */}
          <div>
            <h3 className='text-sm font-semibold mb-2'>点数变动</h3>
            <div className='rounded-lg border p-4'>
              <InfoRow label='变动点数'>
                <span className={`text-lg font-bold ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : ''}`}>
                  {isPositive ? '+' : ''}{points.toLocaleString()}
                </span>
              </InfoRow>
              <Separator />
              <InfoRow label='变动前点数'>
                <span className='text-muted-foreground'>{balanceBefore.toLocaleString()}</span>
              </InfoRow>
              <Separator />
              <InfoRow label='变动后点数'>
                <span className='font-semibold'>{transaction.balanceAfter.toLocaleString()}</span>
              </InfoRow>
            </div>
          </div>

          {/* 关联信息 */}
          {(transaction.orderId || transaction.batchId || transaction.bizId || transaction.remark) && (
            <div>
              <h3 className='text-sm font-semibold mb-2'>关联信息</h3>
              <div className='rounded-lg border p-4'>
                {transaction.orderId && (
                  <>
                    <CopyableField label='关联订单ID' value={transaction.orderId} />
                    <Separator />
                  </>
                )}
                {transaction.batchId && (
                  <>
                    <CopyableField label='关联批次ID' value={transaction.batchId} />
                    <Separator />
                  </>
                )}
                {transaction.bizId && (
                  <>
                    <CopyableField label='业务幂等ID' value={transaction.bizId} />
                    <Separator />
                  </>
                )}
                {transaction.featureCode && (
                  <>
                    <CopyableField label='功能编码' value={transaction.featureCode} />
                    <Separator />
                  </>
                )}
                {transaction.remark && (
                  <div className='py-2'>
                    <span className='text-sm text-muted-foreground'>备注</span>
                    <p className='mt-1 text-sm'>{transaction.remark}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 操作信息 */}
          {transaction.operatorId && (
            <div>
              <h3 className='text-sm font-semibold mb-2'>操作信息</h3>
              <div className='rounded-lg border p-4'>
                <CopyableField label='操作人ID' value={transaction.operatorId} />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
