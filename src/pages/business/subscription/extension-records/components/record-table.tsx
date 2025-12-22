import { useState } from 'react'
import { Check, Copy, Eye, MessageSquareText, Undo2 } from 'lucide-react'

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
import type { ResourceExtensionRecordVO, ResourceType, ExtensionSource, ExtensionStatus } from '@/types/resource-pack'

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

function getSourceBadge(source: ExtensionSource) {
  switch (source) {
    case 'PURCHASE':
      return <Badge variant='outline'>购买</Badge>
    case 'GRANT':
      return <Badge variant='secondary'>赠送</Badge>
    default:
      return <Badge variant='secondary'>{source}</Badge>
  }
}

function getStatusBadge(status: ExtensionStatus) {
  switch (status) {
    case 'ACTIVE':
      return <Badge variant='default'>生效中</Badge>
    case 'EXPIRED':
      return <Badge variant='outline'>已过期</Badge>
    case 'REVOKED':
      return <Badge variant='destructive'>已撤销</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

interface RecordTableProps {
  records: ResourceExtensionRecordVO[]
  loading: boolean
  onView?: (record: ResourceExtensionRecordVO) => void
  onRevoke?: (record: ResourceExtensionRecordVO) => void
}

export function RecordTable({
  records,
  loading,
  onView,
  onRevoke,
}: RecordTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>团队</TableHead>
            <TableHead>资源类型</TableHead>
            <TableHead>资源数量</TableHead>
            <TableHead>来源</TableHead>
            <TableHead>资源包</TableHead>
            <TableHead>过期时间</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>赠送信息</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead className='w-20'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                <TableCell><Skeleton className='h-5 w-14' /></TableCell>
                <TableCell><Skeleton className='h-4 w-12' /></TableCell>
                <TableCell><Skeleton className='h-5 w-12' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-5 w-14' /></TableCell>
                <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-8 w-16' /></TableCell>
              </TableRow>
            ))
          ) : records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className='font-medium'>
                  <div className='group flex items-center gap-1'>
                    <span>{record.id}</span>
                    <CopyButton text={String(record.id)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <span>{record.teamName || record.teamId}</span>
                    <CopyButton text={String(record.teamId)} />
                  </div>
                </TableCell>
                <TableCell>
                  {record.resourceTypeDesc || getResourceTypeBadge(record.resourceType)}
                </TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell>
                  {record.sourceDesc || getSourceBadge(record.source)}
                </TableCell>
                <TableCell>
                  {record.packName ? (
                    <div className='group flex items-center gap-1'>
                      <span className='text-sm'>{record.packName}</span>
                      {record.packId && <CopyButton text={String(record.packId)} />}
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>
                <TableCell>
                  {record.expireTime || <span className='text-muted-foreground'>永久</span>}
                </TableCell>
                <TableCell>
                  {record.statusDesc || getStatusBadge(record.status)}
                </TableCell>
                <TableCell>
                  {record.source === 'GRANT' && record.grantUserId ? (
                    <div className='flex items-center gap-1.5 text-sm'>
                      <span>{record.grantUserName || record.grantUserId}</span>
                      {record.grantReason && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <MessageSquareText className='size-4 text-muted-foreground cursor-help' />
                          </TooltipTrigger>
                          <TooltipContent>{record.grantReason}</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {record.createTime}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='size-8'
                          onClick={() => onView?.(record)}
                        >
                          <Eye className='size-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>查看详情</TooltipContent>
                    </Tooltip>
                    {record.status === 'ACTIVE' && record.source === 'GRANT' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8 text-destructive hover:text-destructive'
                            onClick={() => onRevoke?.(record)}
                          >
                            <Undo2 className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>撤销赠送</TooltipContent>
                      </Tooltip>
                    )}
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
