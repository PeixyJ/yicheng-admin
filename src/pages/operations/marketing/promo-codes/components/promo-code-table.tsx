import { useState } from 'react'
import { Check, Copy, Eye, Pencil, Trash2 } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import type { PromoCodeVO, DiscountType } from '@/types/promo-code.ts'

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

const DISCOUNT_TYPE_CONFIG: Record<DiscountType, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  FIXED_AMOUNT: { label: '固定金额', variant: 'default' },
  PERCENT: { label: '百分比', variant: 'secondary' },
  FREE_TRIAL: { label: '免费试用', variant: 'outline' },
}

function formatDiscountValue(type: DiscountType, value: number, currency: string | null): string {
  switch (type) {
    case 'FIXED_AMOUNT':
      return `${currency?.toUpperCase() || 'USD'} ${value}`
    case 'PERCENT':
      return `${value}%`
    case 'FREE_TRIAL':
      return `${value}天`
    default:
      return String(value)
  }
}

interface PromoCodeTableProps {
  promoCodes: PromoCodeVO[]
  loading: boolean
  onViewDetail?: (promoCode: PromoCodeVO) => void
  onEdit?: (promoCode: PromoCodeVO) => void
  onDelete?: (promoCode: PromoCodeVO) => void
}

export function PromoCodeTable({
  promoCodes,
  loading,
  onViewDetail,
  onEdit,
  onDelete,
}: PromoCodeTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead className='w-36'>优惠码</TableHead>
            <TableHead className='w-36'>名称</TableHead>
            <TableHead className='w-24'>折扣类型</TableHead>
            <TableHead className='w-28'>折扣值</TableHead>
            <TableHead className='w-24'>使用量</TableHead>
            <TableHead className='w-72'>有效期</TableHead>
            <TableHead className='w-20'>状态</TableHead>
            <TableHead className='w-20'>有效</TableHead>
            <TableHead className='w-28'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-10' /></TableCell>
                <TableCell><Skeleton className='h-4 w-28' /></TableCell>
                <TableCell><Skeleton className='h-4 w-28' /></TableCell>
                <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-60' /></TableCell>
                <TableCell><Skeleton className='h-5 w-14' /></TableCell>
                <TableCell><Skeleton className='h-5 w-14' /></TableCell>
                <TableCell><Skeleton className='h-8 w-24' /></TableCell>
              </TableRow>
            ))
          ) : promoCodes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            promoCodes.map((promoCode) => {
              const discountConfig = DISCOUNT_TYPE_CONFIG[promoCode.discountType] || { label: promoCode.discountTypeDesc, variant: 'outline' as const }
              return (
                <TableRow key={promoCode.id}>
                  <TableCell>
                    <span className='font-medium'>{promoCode.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className='group flex items-center gap-1'>
                      <span className='font-mono text-sm font-medium'>{promoCode.code}</span>
                      <CopyButton text={promoCode.code} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='truncate max-w-32' title={promoCode.name}>{promoCode.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={discountConfig.variant}>{discountConfig.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className='font-medium'>
                      {formatDiscountValue(promoCode.discountType, promoCode.discountValue, promoCode.currency)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm'>
                      {promoCode.usedCount}
                      {promoCode.totalLimit !== null && ` / ${promoCode.totalLimit}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground text-sm'>
                      {dayjs(promoCode.startTime).format('YYYY-MM-DD HH:mm')} ~ {dayjs(promoCode.endTime).format('YYYY-MM-DD HH:mm')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={promoCode.status ? 'default' : 'secondary'}>
                      {promoCode.status ? '已启用' : '已禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={promoCode.isActive ? 'default' : 'outline'}>
                      {promoCode.isActive ? '有效' : '过期'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8'
                        onClick={() => onViewDetail?.(promoCode)}
                        title='查看详情'
                      >
                        <Eye className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8'
                        onClick={() => onEdit?.(promoCode)}
                        title='编辑'
                      >
                        <Pencil className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8 text-destructive hover:text-destructive'
                        onClick={() => onDelete?.(promoCode)}
                        title='删除'
                      >
                        <Trash2 className='size-4' />
                      </Button>
                    </div>
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
