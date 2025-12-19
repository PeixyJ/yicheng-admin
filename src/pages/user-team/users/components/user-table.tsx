import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { AdminUserVO, UserStatus } from '@/types/user'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-6 text-muted-foreground hover:text-foreground'
      onClick={handleCopy}
    >
      {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
    </Button>
  )
}

interface UserTableProps {
  users: AdminUserVO[]
  loading: boolean
  onUserClick?: (userId: number) => void
}

function getStatusBadge(status: UserStatus) {
  switch (status) {
    case 'ACTIVE':
      return <Badge variant='default'>正常</Badge>
    case 'SUSPENDED':
      return <Badge variant='destructive'>封禁</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

export function UserTable({ users, loading, onUserClick }: UserTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>用户</TableHead>
            <TableHead>邀请码</TableHead>
            <TableHead>邀请人</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
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
                  <div className='flex items-center gap-2'>
                    <Skeleton className='size-8 rounded-full' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='font-medium'>
                  <div className='group/id flex items-center gap-1'>
                    <span>{user.id}</span>
                    <span className='opacity-0 group-hover/id:opacity-100 transition-opacity'>
                      <CopyButton text={String(user.id)} />
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group/nickname flex items-center gap-2'>
                    <div
                      className='flex cursor-pointer items-center gap-2 rounded-md transition-colors hover:text-primary'
                      onClick={() => onUserClick?.(user.id)}
                    >
                      <Avatar className='size-8 ring-2 ring-transparent transition-all hover:ring-primary'>
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback>{user.nickname.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{user.nickname}</span>
                    </div>
                    <span className='opacity-0 group-hover/nickname:opacity-100 transition-opacity'>
                      <CopyButton text={user.nickname} />
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group/code flex items-center gap-1'>
                    <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                      {user.inviteCode}
                    </code>
                    <span className='opacity-0 group-hover/code:opacity-100 transition-opacity'>
                      <CopyButton text={user.inviteCode} />
                    </span>
                  </div>
                </TableCell>
                <TableCell>{user.inviterNickname || '-'}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{user.createTime}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
