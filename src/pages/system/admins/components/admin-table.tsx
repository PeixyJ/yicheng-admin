import { useState } from 'react'
import { Check, Copy, ShieldCheck, ShieldOff } from 'lucide-react'

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { AdminVO, AdminStatus } from '@/types/admin'

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

interface AdminTableProps {
  admins: AdminVO[]
  loading: boolean
  onAdminClick?: (adminId: number) => void
}

function getStatusBadge(status: AdminStatus) {
  switch (status) {
    case 'PENDING':
      return <Badge variant='secondary'>待激活</Badge>
    case 'ACTIVE':
      return <Badge variant='default'>正常</Badge>
    case 'SUSPENDED':
      return <Badge variant='destructive'>已停用</Badge>
    case 'RESIGNED':
      return <Badge variant='outline'>已离职</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

function getRoleBadge(roleCode: string, roleName: string) {
  switch (roleCode) {
    case 'SUPER_ADMIN':
      return <Badge variant='default' className='bg-purple-600 hover:bg-purple-700'>{roleName}</Badge>
    case 'ADMIN':
      return <Badge variant='default'>{roleName}</Badge>
    case 'OPERATOR':
      return <Badge variant='secondary'>{roleName}</Badge>
    case 'SUPPORT':
      return <Badge variant='outline'>{roleName}</Badge>
    case 'VIEWER':
      return <Badge variant='outline'>{roleName}</Badge>
    default:
      return <Badge variant='outline'>{roleName}</Badge>
  }
}

export function AdminTable({ admins, loading, onAdminClick }: AdminTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>管理员</TableHead>
            <TableHead>工号</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>管理范围</TableHead>
            <TableHead>MFA</TableHead>
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
                  <Skeleton className='h-5 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-14' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
              </TableRow>
            ))
          ) : admins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className='font-medium'>
                  <div className='group flex items-center gap-1'>
                    <span>{admin.id}</span>
                    <CopyButton text={String(admin.id)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-2'>
                    <div
                      className='flex items-center gap-2 cursor-pointer hover:text-primary transition-colors'
                      onClick={() => onAdminClick?.(admin.id)}
                    >
                      <Avatar className='size-8'>
                        <AvatarImage src={admin.avatarUrl || undefined} />
                        <AvatarFallback>{admin.nickname.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{admin.nickname}</span>
                    </div>
                    <CopyButton text={admin.nickname} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                      {admin.adminNo}
                    </code>
                    <CopyButton text={admin.adminNo} />
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(admin.roleCode, admin.roleName)}</TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className='text-sm text-muted-foreground cursor-default'>
                        {admin.scopeTypeDesc}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {admin.scopeType === 'ALL' ? '可管理所有团队' : '仅可管理指定团队'}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {admin.mfaEnabled ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ShieldCheck className='size-5 text-green-600' />
                      </TooltipTrigger>
                      <TooltipContent>MFA 已启用</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ShieldOff className='size-5 text-muted-foreground' />
                      </TooltipTrigger>
                      <TooltipContent>MFA 未启用</TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(admin.status)}</TableCell>
                <TableCell>{admin.createTime}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
