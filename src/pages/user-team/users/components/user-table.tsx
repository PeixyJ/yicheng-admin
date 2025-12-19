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
import type { AdminUserVO, UserStatus } from '@/types/user'

interface UserTableProps {
  users: AdminUserVO[]
  loading: boolean
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

function getGenderText(gender: number) {
  switch (gender) {
    case 1:
      return '男'
    case 2:
      return '女'
    default:
      return '未知'
  }
}

export function UserTable({ users, loading }: UserTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>用户</TableHead>
            <TableHead>性别</TableHead>
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
                  <Skeleton className='h-4 w-8' />
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
              <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='font-medium'>{user.id}</TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Avatar className='size-8'>
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback>{user.nickname.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{user.nickname}</span>
                  </div>
                </TableCell>
                <TableCell>{getGenderText(user.gender)}</TableCell>
                <TableCell>
                  <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                    {user.inviteCode}
                  </code>
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
