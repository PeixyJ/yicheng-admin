import { useState } from 'react'
import { Check, Copy, Lock, LockOpen } from 'lucide-react'

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
import type { SystemConfigVO } from '@/types/system-config'

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

interface ConfigTableProps {
  configs: SystemConfigVO[]
  loading: boolean
  onConfigClick?: (configId: number) => void
}

function getValueTypeBadge(valueType: string, valueTypeDesc: string) {
  switch (valueType) {
    case 'STRING':
      return <Badge variant='outline'>{valueTypeDesc}</Badge>
    case 'NUMBER':
      return <Badge variant='secondary'>{valueTypeDesc}</Badge>
    case 'BOOLEAN':
      return <Badge variant='default'>{valueTypeDesc}</Badge>
    case 'JSON':
      return <Badge variant='default' className='bg-purple-600 hover:bg-purple-700'>{valueTypeDesc}</Badge>
    case 'TEXT':
      return <Badge variant='outline'>{valueTypeDesc}</Badge>
    default:
      return <Badge variant='outline'>{valueTypeDesc}</Badge>
  }
}

function getGroupBadge(configGroup: string, configGroupDesc: string) {
  switch (configGroup) {
    case 'SYSTEM':
      return <Badge variant='default'>{configGroupDesc}</Badge>
    case 'BUSINESS':
      return <Badge variant='secondary'>{configGroupDesc}</Badge>
    case 'SECURITY':
      return <Badge variant='destructive'>{configGroupDesc}</Badge>
    case 'NOTIFICATION':
      return <Badge variant='outline'>{configGroupDesc}</Badge>
    case 'PAYMENT':
      return <Badge variant='default' className='bg-green-600 hover:bg-green-700'>{configGroupDesc}</Badge>
    case 'FEATURE':
      return <Badge variant='secondary'>{configGroupDesc}</Badge>
    default:
      return <Badge variant='outline'>{configGroupDesc}</Badge>
  }
}

function truncateValue(value: string, maxLength: number = 50): string {
  if (value.length <= maxLength) return value
  return value.slice(0, maxLength) + '...'
}

export function ConfigTable({ configs, loading, onConfigClick }: ConfigTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead className='w-64'>配置键</TableHead>
            <TableHead>配置值</TableHead>
            <TableHead className='w-24'>值类型</TableHead>
            <TableHead className='w-28'>分组</TableHead>
            <TableHead className='w-20'>只读</TableHead>
            <TableHead className='w-40'>更新时间</TableHead>
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
                  <Skeleton className='h-4 w-48' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-64' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
              </TableRow>
            ))
          ) : configs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            configs.map((config) => (
              <TableRow key={config.id}>
                <TableCell className='font-medium'>
                  <div className='group flex items-center gap-1'>
                    <span>{config.id}</span>
                    <CopyButton text={String(config.id)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-2'>
                    <code
                      className='rounded bg-muted px-1.5 py-0.5 text-sm cursor-pointer hover:text-primary transition-colors'
                      onClick={() => onConfigClick?.(config.id)}
                    >
                      {config.configKey}
                    </code>
                    <CopyButton text={config.configKey} />
                  </div>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='group flex items-center gap-1'>
                        <span className='text-sm text-muted-foreground max-w-xs truncate'>
                          {truncateValue(config.configValue)}
                        </span>
                        <CopyButton text={config.configValue} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side='bottom' className='max-w-md'>
                      <p className='break-all'>{config.configValue}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>{getValueTypeBadge(config.valueType, config.valueTypeDesc)}</TableCell>
                <TableCell>{getGroupBadge(config.configGroup, config.configGroupDesc)}</TableCell>
                <TableCell>
                  {config.isReadonly ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Lock className='size-4 text-muted-foreground' />
                      </TooltipTrigger>
                      <TooltipContent>只读配置</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <LockOpen className='size-4 text-green-600' />
                      </TooltipTrigger>
                      <TooltipContent>可编辑</TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell className='text-muted-foreground text-sm'>{config.updateTime}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
