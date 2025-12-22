import { useState } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'

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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { PointPackageVO, Currency } from '@/types/point-package'

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

function formatPrice(price: number, currency: Currency): string {
  return currency === 'CNY' ? `¥${price.toFixed(2)}` : `$${price.toFixed(2)}`
}

interface PackageTableProps {
  packages: PointPackageVO[]
  loading: boolean
  onPackageClick?: (pkg: PointPackageVO) => void
  onStatusChange?: (pkg: PointPackageVO, status: boolean) => void
  onVisibleChange?: (pkg: PointPackageVO, visible: boolean) => void
  onSyncStripe?: (pkg: PointPackageVO) => void
}

export function PackageTable({
  packages,
  loading,
  onPackageClick,
  onStatusChange,
  onVisibleChange,
  onSyncStripe,
}: PackageTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-32'>套餐编码</TableHead>
            <TableHead>套餐名称</TableHead>
            <TableHead className='w-24'>点数</TableHead>
            <TableHead className='w-32'>价格</TableHead>
            <TableHead className='w-24'>有效期</TableHead>
            <TableHead className='w-28'>购买限制</TableHead>
            <TableHead className='w-20'>上架</TableHead>
            <TableHead className='w-20'>可见</TableHead>
            <TableHead className='w-24'>Stripe</TableHead>
            <TableHead className='w-16'>排序</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-6 w-10' /></TableCell>
                <TableCell><Skeleton className='h-6 w-10' /></TableCell>
                <TableCell><Skeleton className='h-5 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-8' /></TableCell>
              </TableRow>
            ))
          ) : packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg.packCode}>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                      {pkg.packCode}
                    </code>
                    <CopyButton text={pkg.packCode} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-2'>
                    <span
                      className='cursor-pointer hover:text-primary transition-colors'
                      onClick={() => onPackageClick?.(pkg)}
                    >
                      {pkg.packName}
                    </span>
                    {pkg.badge && (
                      <Badge variant='secondary' className='text-xs'>
                        {pkg.badge}
                      </Badge>
                    )}
                    <CopyButton text={pkg.packName} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className='font-medium'>{pkg.points.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{formatPrice(pkg.price, pkg.currency)}</span>
                    {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                      <span className='text-xs text-muted-foreground line-through'>
                        {formatPrice(pkg.originalPrice, pkg.currency)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {pkg.validDays ? (
                    <span>{pkg.validDays} 天</span>
                  ) : (
                    <span className='text-muted-foreground'>永久</span>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='text-sm cursor-default'>
                        {pkg.purchaseLimit ? (
                          <span>限购 {pkg.purchaseLimit} 次</span>
                        ) : (
                          <span className='text-muted-foreground'>不限购</span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className='text-xs'>
                        <div>单次购买: {pkg.minQuantity} - {pkg.maxQuantity}</div>
                        {pkg.purchaseLimit && <div>限购次数: {pkg.purchaseLimit}</div>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={pkg.status}
                    onCheckedChange={(checked) => onStatusChange?.(pkg, checked)}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={pkg.visible}
                    onCheckedChange={(checked) => onVisibleChange?.(pkg, checked)}
                  />
                </TableCell>
                <TableCell>
                  {pkg.stripePriceId ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant='default' className='cursor-default'>已同步</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className='text-xs space-y-1'>
                          <div>Price: {pkg.stripePriceId}</div>
                          <div>Product: {pkg.stripeProductId}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-6 text-xs'
                      onClick={(e) => {
                        e.stopPropagation()
                        onSyncStripe?.(pkg)
                      }}
                    >
                      <RefreshCw className='mr-1 size-3' />
                      同步
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <span className='text-muted-foreground'>{pkg.sortOrder}</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
