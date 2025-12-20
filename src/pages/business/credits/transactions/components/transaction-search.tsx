import { RotateCcw, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TransactionType } from '@/types/point'

const TRANSACTION_TYPE_OPTIONS: { value: TransactionType | 'all'; label: string }[] = [
  { value: 'all', label: '全部类型' },
  { value: 'PURCHASE', label: '购买' },
  { value: 'CONSUME', label: '消费' },
  { value: 'GRANT', label: '赠送' },
  { value: 'ADJUST', label: '调整' },
  { value: 'EXPIRE', label: '过期' },
  { value: 'REFUND', label: '退款' },
]

interface TransactionSearchProps {
  teamId: string
  transactionNo: string
  type: TransactionType | 'all'
  startTime: string
  endTime: string
  onTeamIdChange: (value: string) => void
  onTransactionNoChange: (value: string) => void
  onTypeChange: (value: TransactionType | 'all') => void
  onStartTimeChange: (value: string) => void
  onEndTimeChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export function TransactionSearch({
  teamId,
  transactionNo,
  type,
  startTime,
  endTime,
  onTeamIdChange,
  onTransactionNoChange,
  onTypeChange,
  onStartTimeChange,
  onEndTimeChange,
  onSearch,
  onReset,
}: TransactionSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        {/* 团队ID */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='团队ID'
            value={teamId}
            onChange={(e) => onTeamIdChange(e.target.value)}
            className='w-28 pl-10'
          />
        </div>

        {/* 交易单号 */}
        <Input
          placeholder='交易单号'
          value={transactionNo}
          onChange={(e) => onTransactionNoChange(e.target.value)}
          className='w-40'
        />

        {/* 交易类型 */}
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='交易类型' />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 时间范围 */}
        <div className='flex items-center gap-2'>
          <Input
            type='datetime-local'
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className='w-44'
          />
          <span className='text-muted-foreground'>-</span>
          <Input
            type='datetime-local'
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className='w-44'
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className='flex items-center gap-2'>
        <Button onClick={onSearch}>
          <Search className='mr-2 size-4' />
          搜索
        </Button>
        <Button onClick={onReset} variant='outline' size='icon' title='重置'>
          <RotateCcw className='size-4' />
        </Button>
      </div>
    </div>
  )
}
