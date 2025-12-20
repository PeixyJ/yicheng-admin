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
import type { CouponVO, CouponStatus, CouponSource } from '@/types/coupon'

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

interface CouponTableProps {
  coupons: CouponVO[]
  loading: boolean
  onCouponClick?: (couponId: number) => void
}

function getStatusBadge(status: CouponStatus, statusDesc: string) {
  switch (status) {
    case 'UNUSED':
      return <Badge variant='secondary'>{statusDesc}</Badge>
    case 'USED':
      return <Badge variant='default'>{statusDesc}</Badge>
    case 'EXPIRED':
      return <Badge variant='outline'>{statusDesc}</Badge>
    case 'REVOKED':
      return <Badge variant='destructive'>{statusDesc}</Badge>
    default:
      return <Badge variant='secondary'>{statusDesc}</Badge>
  }
}

function getSourceBadge(source: CouponSource, sourceDesc: string) {
  switch (source) {
    case 'PROMO_CODE':
      return <Badge variant='outline'>{sourceDesc}</Badge>
    case 'SYSTEM_GRANT':
      return <Badge variant='secondary'>{sourceDesc}</Badge>
    case 'ACTIVITY':
      return <Badge variant='default'>{sourceDesc}</Badge>
    default:
      return <Badge variant='outline'>{sourceDesc}</Badge>
  }
}

export function CouponTable({ coupons, loading, onCouponClick }: CouponTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>优惠券编号</TableHead>
            <TableHead>模板</TableHead>
            <TableHead>折扣</TableHead>
            <TableHead>团队ID</TableHead>
            <TableHead>用户ID</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>来源</TableHead>
            <TableHead>过期时间</TableHead>
            <TableHead>创建时间</TableHead>
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
                  <Skeleton className='h-4 w-32' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-24' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-14' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
              </TableRow>
            ))
          ) : coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className='font-medium'>
                  <div className='group flex items-center gap-1'>
                    <span>{coupon.id}</span>
                    <CopyButton text={String(coupon.id)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <span
                      className='cursor-pointer hover:text-primary transition-colors'
                      onClick={() => onCouponClick?.(coupon.id)}
                    >
                      <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                        {coupon.couponNo}
                      </code>
                    </span>
                    <CopyButton text={coupon.couponNo} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className='text-sm'>{coupon.templateName}</span>
                </TableCell>
                <TableCell>
                  <span className='text-sm font-medium'>
                    {coupon.discountTypeDesc} {coupon.currency === 'CNY' ? '¥' : coupon.currency}
                    {coupon.discountValue}
                  </span>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <span>{coupon.teamId}</span>
                    <CopyButton text={String(coupon.teamId)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <span>{coupon.userId}</span>
                    <CopyButton text={String(coupon.userId)} />
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(coupon.status, coupon.statusDesc)}</TableCell>
                <TableCell>{getSourceBadge(coupon.source, coupon.sourceDesc)}</TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {coupon.expireTime}
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {coupon.createTime}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
