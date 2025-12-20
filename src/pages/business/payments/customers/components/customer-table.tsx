import { useState } from 'react'
import { Check, Copy, Eye } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { AdminPaymentCustomerVO } from '@/types/payment-customer'

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

interface CustomerTableProps {
  customers: AdminPaymentCustomerVO[]
  loading: boolean
  onViewDetail?: (customer: AdminPaymentCustomerVO) => void
}

export function CustomerTable({
  customers,
  loading,
  onViewDetail,
}: CustomerTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead className='w-24'>团队ID</TableHead>
            <TableHead className='w-24'>用户ID</TableHead>
            <TableHead className='w-56'>Stripe客户ID</TableHead>
            <TableHead className='w-48'>邮箱</TableHead>
            <TableHead className='w-32'>名称</TableHead>
            <TableHead className='w-40'>创建时间</TableHead>
            <TableHead className='w-20'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-10' /></TableCell>
                <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-44' /></TableCell>
                <TableCell><Skeleton className='h-4 w-36' /></TableCell>
                <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                <TableCell><Skeleton className='h-8 w-14' /></TableCell>
              </TableRow>
            ))
          ) : customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <span className='font-medium'>{customer.id}</span>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <span>{customer.teamId}</span>
                    <CopyButton text={String(customer.teamId)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <span>{customer.userId}</span>
                    <CopyButton text={String(customer.userId)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <span className='font-mono text-sm'>{customer.stripeCustomerId}</span>
                    <CopyButton text={customer.stripeCustomerId} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className='text-muted-foreground'>{customer.email || '-'}</span>
                </TableCell>
                <TableCell>
                  <span>{customer.name || '-'}</span>
                </TableCell>
                <TableCell>
                  <span className='text-muted-foreground'>
                    {dayjs(customer.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onViewDetail?.(customer)}
                  >
                    <Eye className='mr-1 size-3.5' />
                    详情
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
