import { useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch.tsx'
import { toggleCouponTemplateStatus } from '@/services/coupon-template.ts'
import type { CouponTemplateVO, DiscountType } from '@/types/coupon-template.ts'

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

interface TemplateTableProps {
  templates: CouponTemplateVO[]
  loading: boolean
  onViewDetail?: (template: CouponTemplateVO) => void
  onEdit?: (template: CouponTemplateVO) => void
  onDelete?: (template: CouponTemplateVO) => void
  onStatusChange?: () => void
}

export function TemplateTable({
  templates,
  loading,
  onViewDetail,
  onEdit,
  onDelete,
  onStatusChange,
}: TemplateTableProps) {
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set())

  const handleStatusToggle = async (template: CouponTemplateVO) => {
    setTogglingIds((prev) => new Set(prev).add(template.id))
    try {
      const res = await toggleCouponTemplateStatus(template.id, !template.status)
      if (res.code === 'success') {
        onStatusChange?.()
      }
    } catch (error) {
      console.error('Failed to toggle status:', error)
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(template.id)
        return next
      })
    }
  }

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead className='w-40'>名称</TableHead>
            <TableHead className='w-24'>折扣类型</TableHead>
            <TableHead className='w-28'>折扣值</TableHead>
            <TableHead className='w-20'>有效天数</TableHead>
            <TableHead className='w-28'>发放量</TableHead>
            <TableHead className='w-20'>状态</TableHead>
            <TableHead className='w-40'>创建时间</TableHead>
            <TableHead className='w-28'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-10' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-12' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-5 w-10' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-8 w-24' /></TableCell>
              </TableRow>
            ))
          ) : templates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            templates.map((template) => {
              const discountConfig = DISCOUNT_TYPE_CONFIG[template.discountType] || { label: template.discountTypeDesc, variant: 'outline' as const }
              const isToggling = togglingIds.has(template.id)
              return (
                <TableRow key={template.id}>
                  <TableCell>
                    <span className='font-medium'>{template.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className='truncate max-w-36' title={template.name}>{template.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={discountConfig.variant}>{discountConfig.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className='font-medium'>
                      {formatDiscountValue(template.discountType, template.discountValue, template.currency)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span>{template.validDays}天</span>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm'>
                      {template.issuedQuantity}
                      {template.totalQuantity !== null && ` / ${template.totalQuantity}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={template.status}
                      onCheckedChange={() => handleStatusToggle(template)}
                      disabled={isToggling}
                    />
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground text-sm'>
                      {dayjs(template.createTime).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8'
                        onClick={() => onViewDetail?.(template)}
                        title='查看详情'
                      >
                        <Eye className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8'
                        onClick={() => onEdit?.(template)}
                        title='编辑'
                      >
                        <Pencil className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8 text-destructive hover:text-destructive'
                        onClick={() => onDelete?.(template)}
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
