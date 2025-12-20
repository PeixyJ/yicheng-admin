import { Mail, Phone, CheckCircle, XCircle } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

import type { AdminAccountVO } from '@/types/admin'

interface AccountsTabProps {
  accounts: AdminAccountVO[]
}

export function AccountsTab({ accounts }: AccountsTabProps) {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <Mail className='h-4 w-4' />
      case 'PHONE':
        return <Phone className='h-4 w-4' />
      default:
        return null
    }
  }

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return dateStr.replace('T', ' ').slice(0, 19)
  }

  if (accounts.length === 0) {
    return (
      <div className='py-12 text-center text-muted-foreground'>
        暂无关联账号
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>
        以下是您关联的登录账号信息
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>账号类型</TableHead>
            <TableHead>账号标识</TableHead>
            <TableHead>验证状态</TableHead>
            <TableHead>最后登录时间</TableHead>
            <TableHead>最后登录 IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <div className='flex items-center gap-2'>
                  {getAccountIcon(account.accountType)}
                  <span>{account.accountTypeDesc}</span>
                </div>
              </TableCell>
              <TableCell className='font-mono'>{account.identifier}</TableCell>
              <TableCell>
                {account.verified ? (
                  <Badge variant='default' className='bg-green-500 hover:bg-green-600'>
                    <CheckCircle className='h-3 w-3 mr-1' />
                    已验证
                  </Badge>
                ) : (
                  <Badge variant='secondary'>
                    <XCircle className='h-3 w-3 mr-1' />
                    未验证
                  </Badge>
                )}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {formatDateTime(account.lastLoginTime)}
              </TableCell>
              <TableCell className='text-muted-foreground font-mono'>
                {account.lastLoginIp || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
