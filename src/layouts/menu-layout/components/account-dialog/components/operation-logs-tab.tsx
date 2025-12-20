import { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

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
import { Pagination } from '@/components/pagination'

import { getMyOperationLogs } from '@/services/admin-me'
import type { AdminOperationLogVO } from '@/types/admin'

export function OperationLogsTab() {
  const [logs, setLogs] = useState<AdminOperationLogVO[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadLogs()
  }, [page, pageSize])

  const loadLogs = async () => {
    setLoading(true)
    try {
      const res = await getMyOperationLogs({ page, size: pageSize })
      if (res.code === 'success') {
        setLogs(res.data.records)
        setTotal(res.data.total)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const formatDateTime = (dateStr: string) => {
    return dateStr.replace('T', ' ').slice(0, 19)
  }

  const getStatusBadge = (status: string) => {
    if (status === 'SUCCESS') {
      return (
        <Badge variant='default' className='bg-green-500 hover:bg-green-600'>
          <CheckCircle className='h-3 w-3 mr-1' />
          成功
        </Badge>
      )
    }
    return (
      <Badge variant='destructive'>
        <XCircle className='h-3 w-3 mr-1' />
        失败
      </Badge>
    )
  }

  const getMethodBadge = (method: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      GET: 'secondary',
      POST: 'default',
      PUT: 'outline',
      DELETE: 'destructive',
    }
    return (
      <Badge variant={variants[method] || 'secondary'} className='font-mono text-xs'>
        {method}
      </Badge>
    )
  }

  if (loading && logs.length === 0) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
    )
  }

  if (!loading && logs.length === 0) {
    return (
      <div className='py-12 text-center text-muted-foreground'>
        暂无操作日志
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>操作时间</TableHead>
            <TableHead>模块</TableHead>
            <TableHead>操作</TableHead>
            <TableHead>目标</TableHead>
            <TableHead>方法</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>耗时</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className='text-muted-foreground'>
                {formatDateTime(log.createTime)}
              </TableCell>
              <TableCell>{log.moduleDesc}</TableCell>
              <TableCell>{log.actionDesc}</TableCell>
              <TableCell className='text-muted-foreground max-w-[120px] truncate' title={log.targetName || undefined}>
                {log.targetName || '-'}
              </TableCell>
              <TableCell>{getMethodBadge(log.requestMethod)}</TableCell>
              <TableCell>{getStatusBadge(log.status)}</TableCell>
              <TableCell className='text-muted-foreground text-sm'>
                {log.durationMs}ms
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        pageSizeOptions={[10, 20, 50]}
        onChange={handlePageChange}
      />
    </div>
  )
}
