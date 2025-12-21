import { useState } from 'react'
import { Check, Copy, Star, Trash2 } from 'lucide-react'

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
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { SubscribePlanVO, PlanType } from '@/types/plan'

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

interface PlanTableProps {
  plans: SubscribePlanVO[]
  loading: boolean
  onPlanClick?: (planId: number) => void
  onStatusChange?: (planId: number, status: boolean) => void
  onSetDefault?: (planId: number) => void
  onDelete?: (planId: number) => void
}

function getPlanTypeBadge(type: PlanType) {
  switch (type) {
    case 'FREE':
      return <Badge variant='secondary'>免费版</Badge>
    case 'TRIAL':
      return <Badge variant='outline'>试用版</Badge>
    case 'PAID':
      return <Badge variant='default'>付费版</Badge>
    default:
      return <Badge variant='secondary'>{type}</Badge>
  }
}

function formatPrice(price: number, currency: string) {
  if (currency === 'CNY') {
    return `¥${price.toFixed(2)}`
  } else if (currency === 'USD') {
    return `$${price.toFixed(2)}`
  }
  return `${price.toFixed(2)} ${currency}`
}

export function PlanTable({
  plans,
  loading,
  onPlanClick,
  onStatusChange,
  onSetDefault,
  onDelete,
}: PlanTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null)

  const handleDeleteClick = (planId: number) => {
    setDeletingPlanId(planId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingPlanId) {
      onDelete?.(deletingPlanId)
    }
    setDeleteDialogOpen(false)
    setDeletingPlanId(null)
  }

  return (
    <>
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16'>ID</TableHead>
              <TableHead>计划名称</TableHead>
              <TableHead>计划编码</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>等级</TableHead>
              <TableHead>价格</TableHead>
              <TableHead>有效期</TableHead>
              <TableHead>配额</TableHead>
              <TableHead>标记</TableHead>
              <TableHead>排序</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className='w-16'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-28' /></TableCell>
                  <TableCell><Skeleton className='h-5 w-14' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-12' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                  <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                  <TableCell><Skeleton className='h-5 w-10' /></TableCell>
                  <TableCell><Skeleton className='h-8 w-8' /></TableCell>
                </TableRow>
              ))
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className='h-24 text-center text-muted-foreground'>
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className='font-medium'>
                    <div className='group flex items-center gap-1'>
                      <span>{plan.id}</span>
                      <CopyButton text={String(plan.id)} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='group flex items-center gap-2'>
                      <span
                        className='cursor-pointer hover:text-primary transition-colors'
                        onClick={() => onPlanClick?.(plan.id)}
                      >
                        {plan.planName}
                      </span>
                      <CopyButton text={plan.planName} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='group flex items-center gap-1'>
                      <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                        {plan.planCode}
                      </code>
                      <CopyButton text={plan.planCode} />
                    </div>
                  </TableCell>
                  <TableCell>{getPlanTypeBadge(plan.planType)}</TableCell>
                  <TableCell>
                    <span className='font-medium'>Lv.{plan.planLevel}</span>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{formatPrice(plan.price, plan.currency)}</span>
                      {plan.originalPrice && plan.originalPrice > plan.price && (
                        <span className='text-xs text-muted-foreground line-through'>
                          {formatPrice(plan.originalPrice, plan.currency)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.durationDays ? `${plan.durationDays}天` : '永久'}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='text-sm cursor-default'>
                          {plan.dailyQuota != null && <div>日: {plan.dailyQuota.toLocaleString()}</div>}
                          {plan.monthlyQuota != null && <div>月: {plan.monthlyQuota.toLocaleString()}</div>}
                          {plan.dailyQuota == null && plan.monthlyQuota == null && '-'}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div>
                          <div>每日配额: {plan.dailyQuota?.toLocaleString() ?? '不限制'}</div>
                          <div>每月配额: {plan.monthlyQuota?.toLocaleString() ?? '不限制'}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-1'>
                      {plan.isDefault && (
                        <Badge variant='default' className='text-xs'>
                          <Star className='mr-1 size-3' />
                          默认
                        </Badge>
                      )}
                      {plan.isTrial && (
                        <Badge variant='secondary' className='text-xs'>试用</Badge>
                      )}
                      {plan.isVisible && (
                        <Badge variant='outline' className='text-xs'>可见</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{plan.sortOrder}</TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.status}
                      onCheckedChange={(checked) => onStatusChange?.(plan.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      {!plan.isDefault && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='size-8'
                              onClick={() => onSetDefault?.(plan.id)}
                            >
                              <Star className='size-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>设为默认</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8 text-destructive hover:text-destructive hover:bg-destructive/10'
                            onClick={() => handleDeleteClick(plan.id)}
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>删除计划</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除该订阅计划吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
