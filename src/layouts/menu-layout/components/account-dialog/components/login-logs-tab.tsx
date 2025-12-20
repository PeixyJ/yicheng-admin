import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

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

import { getMyLoginLogs } from '@/services/admin-me'
import type { AdminLoginRecordVO } from '@/types/admin'

export function LoginLogsTab() {
  const [logs, setLogs] = useState<AdminLoginRecordVO[]>([])
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
      const res = await getMyLoginLogs({ page, size: pageSize })
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
        暂无登录日志
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>登录时间</TableHead>
            <TableHead>登录方式</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>IP 地址</TableHead>
            <TableHead>位置</TableHead>
            <TableHead>设备</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className='text-muted-foreground'>
                {formatDateTime(log.loginTime)}
              </TableCell>
              <TableCell>{log.loginTypeDesc}</TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  {getStatusBadge(log.status)}
                  {log.isAbnormal && (
                    <span title={log.abnormalReason || '异常登录'}>
                      <AlertTriangle className='h-4 w-4 text-amber-500' />
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className='font-mono text-sm'>{log.clientIp}</TableCell>
              <TableCell className='text-muted-foreground'>
                {log.ipLocation || '-'}
              </TableCell>
              <TableCell className='text-muted-foreground text-sm'>
                {[log.browser, log.os].filter(Boolean).join(' / ') || '-'}
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
