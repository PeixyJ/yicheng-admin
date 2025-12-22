import { useState } from 'react'
import { Check, Copy, Pencil, Power, PowerOff } from 'lucide-react'

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
import type { SubscribeResourcePackageVO, ResourceType } from '@/types/resource-pack'

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

function getResourceTypeBadge(type: ResourceType) {
  switch (type) {
    case 'PROJECT':
      return <Badge variant='default'>项目数</Badge>
    case 'MEMBER':
      return <Badge variant='secondary'>成员数</Badge>
    case 'STORAGE':
      return <Badge variant='outline'>存储空间</Badge>
    default:
      return <Badge variant='secondary'>{type}</Badge>
  }
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

interface PackageTableProps {
  packages: SubscribeResourcePackageVO[]
  loading: boolean
  onView?: (pkg: SubscribeResourcePackageVO) => void
  onToggleStatus?: (pkg: SubscribeResourcePackageVO) => void
}

export function PackageTable({
  packages,
  loading,
  onView,
  onToggleStatus,
}: PackageTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>资源包编码</TableHead>
            <TableHead>资源包名称</TableHead>
            <TableHead>资源类型</TableHead>
            <TableHead>资源数量</TableHead>
            <TableHead>销售价格</TableHead>
            <TableHead>原价</TableHead>
            <TableHead>有效天数</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className='w-20'>操作</TableHead>
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
                <TableCell><Skeleton className='h-4 w-12' /></TableCell>
                <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-12' /></TableCell>
                <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                <TableCell><Skeleton className='h-5 w-14' /></TableCell>
                <TableCell><Skeleton className='h-8 w-16' /></TableCell>
              </TableRow>
            ))
          ) : packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className='font-medium'>
                  <div className='group flex items-center gap-1'>
                    <span>{pkg.id}</span>
                    <CopyButton text={String(pkg.id)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                      {pkg.packCode}
                    </code>
                    <CopyButton text={pkg.packCode} />
                  </div>
                </TableCell>
                <TableCell>{pkg.packName}</TableCell>
                <TableCell>{getResourceTypeBadge(pkg.resourceType)}</TableCell>
                <TableCell>{pkg.resourceAmount}</TableCell>
                <TableCell className='font-medium'>
                  {formatPrice(pkg.price, pkg.currency)}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {pkg.originalPrice ? (
                    <span className='line-through'>
                      {formatPrice(pkg.originalPrice, pkg.currency)}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {pkg.durationDays ? `${pkg.durationDays}天` : '永久'}
                </TableCell>
                <TableCell>{pkg.sortOrder}</TableCell>
                <TableCell>
                  {pkg.status ? (
                    <Badge variant='default'>已上架</Badge>
                  ) : (
                    <Badge variant='secondary'>已下架</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='size-8'
                          onClick={() => onView?.(pkg)}
                        >
                          <Pencil className='size-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>查看详情</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className={`size-8 ${pkg.status ? 'text-destructive hover:text-destructive' : 'text-green-600 hover:text-green-600'}`}
                          onClick={() => onToggleStatus?.(pkg)}
                        >
                          {pkg.status ? <PowerOff className='size-4' /> : <Power className='size-4' />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{pkg.status ? '下架' : '上架'}</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
