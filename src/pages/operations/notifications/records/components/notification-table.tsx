import { useState } from 'react'
import { Copy, Check, MoreHorizontal, Eye, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { NotificationVO } from '@/types/notification'
import dayjs from 'dayjs'

interface NotificationTableProps {
  notifications: NotificationVO[]
  loading: boolean
  onNotificationClick: (id: number) => void
  onDelete: (notification: NotificationVO) => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant='ghost' size='icon' className='h-6 w-6' onClick={handleCopy}>
      {copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
    </Button>
  )
}

const parentTypeLabels: Record<string, string> = {
  INBOX: '收件箱',
  SYSTEM: '系统通知',
}

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  UNREAD: { label: '未读', variant: 'default' },
  READ: { label: '已读', variant: 'secondary' },
  ARCHIVED: { label: '已归档', variant: 'outline' },
}

const senderTypeLabels: Record<string, string> = {
  SYSTEM: '系统',
  USER: '用户',
}

export function NotificationTable({
  notifications,
  loading,
  onNotificationClick,
  onDelete,
}: NotificationTableProps) {
  if (loading) {
    return (
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-20'>ID</TableHead>
              <TableHead className='w-24'>用户ID</TableHead>
              <TableHead className='w-24'>团队ID</TableHead>
              <TableHead className='w-28'>模板编码</TableHead>
              <TableHead className='w-24'>类型</TableHead>
              <TableHead>标题</TableHead>
              <TableHead className='w-24'>发送者</TableHead>
              <TableHead className='w-20'>状态</TableHead>
              <TableHead className='w-40'>创建时间</TableHead>
              <TableHead className='w-20'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className='h-4 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-28' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-8' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-20'>ID</TableHead>
              <TableHead className='w-24'>用户ID</TableHead>
              <TableHead className='w-24'>团队ID</TableHead>
              <TableHead className='w-28'>模板编码</TableHead>
              <TableHead className='w-24'>类型</TableHead>
              <TableHead>标题</TableHead>
              <TableHead className='w-24'>发送者</TableHead>
              <TableHead className='w-20'>状态</TableHead>
              <TableHead className='w-40'>创建时间</TableHead>
              <TableHead className='w-20'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={10} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-20'>ID</TableHead>
            <TableHead className='w-24'>用户ID</TableHead>
            <TableHead className='w-24'>团队ID</TableHead>
            <TableHead className='w-28'>模板编码</TableHead>
            <TableHead className='w-24'>类型</TableHead>
            <TableHead>标题</TableHead>
            <TableHead className='w-24'>发送者</TableHead>
            <TableHead className='w-20'>状态</TableHead>
            <TableHead className='w-40'>创建时间</TableHead>
            <TableHead className='w-20'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) => {
            const statusInfo = statusConfig[notification.status] || {
              label: notification.status,
              variant: 'secondary' as const,
            }
            return (
              <TableRow key={notification.id}>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <span className='font-mono text-sm'>{notification.id}</span>
                    <CopyButton text={String(notification.id)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <span className='font-mono text-sm'>{notification.userId}</span>
                    <CopyButton text={String(notification.userId)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <span className='font-mono text-sm'>{notification.teamId}</span>
                    <CopyButton text={String(notification.teamId)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <span className='font-mono text-sm'>{notification.templateCode}</span>
                    <CopyButton text={notification.templateCode} />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant='outline'>
                    {parentTypeLabels[notification.parentType] || notification.parentType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant='link'
                    className='h-auto p-0 text-left'
                    onClick={() => onNotificationClick(notification.id)}
                  >
                    {notification.title}
                  </Button>
                </TableCell>
                <TableCell>
                  <span className='text-sm'>
                    {senderTypeLabels[notification.senderType] || notification.senderType}
                    {notification.senderId && ` (${notification.senderId})`}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </TableCell>
                <TableCell>
                  <span className='text-sm text-muted-foreground'>
                    {dayjs(notification.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => onNotificationClick(notification.id)}
                      >
                        <Eye className='mr-2 h-4 w-4' />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-destructive'
                        onClick={() => onDelete(notification)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
