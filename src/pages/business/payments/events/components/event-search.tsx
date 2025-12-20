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
import type { EventProcessStatus } from '@/types/payment-event'

interface EventSearchProps {
  stripeEventId: string
  eventType: string
  processStatus: EventProcessStatus | ''
  createTimeStart: string
  createTimeEnd: string
  retryCountMin: string
  onStripeEventIdChange: (value: string) => void
  onEventTypeChange: (value: string) => void
  onProcessStatusChange: (value: EventProcessStatus | '') => void
  onCreateTimeStartChange: (value: string) => void
  onCreateTimeEndChange: (value: string) => void
  onRetryCountMinChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

const PROCESS_STATUS_OPTIONS: { value: EventProcessStatus; label: string }[] = [
  { value: 'PENDING', label: '待处理' },
  { value: 'PROCESSING', label: '处理中' },
  { value: 'SUCCESS', label: '成功' },
  { value: 'FAILED', label: '失败' },
  { value: 'SKIPPED', label: '已跳过' },
  { value: 'PERMANENTLY_FAILED', label: '永久失败' },
]

export function EventSearch({
  stripeEventId,
  eventType,
  processStatus,
  createTimeStart,
  createTimeEnd,
  retryCountMin,
  onStripeEventIdChange,
  onEventTypeChange,
  onProcessStatusChange,
  onCreateTimeStartChange,
  onCreateTimeEndChange,
  onRetryCountMinChange,
  onSearch,
  onReset,
}: EventSearchProps) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-3 flex-wrap'>
        <Input
          placeholder='Stripe事件ID'
          value={stripeEventId}
          onChange={(e) => onStripeEventIdChange(e.target.value)}
          className='w-48'
        />

        <Input
          placeholder='事件类型'
          value={eventType}
          onChange={(e) => onEventTypeChange(e.target.value)}
          className='w-44'
        />

        <Select
          value={processStatus}
          onValueChange={(value) => onProcessStatusChange(value as EventProcessStatus | '')}
        >
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='处理状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            {PROCESS_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type='datetime-local'
          placeholder='开始时间'
          value={createTimeStart}
          onChange={(e) => onCreateTimeStartChange(e.target.value)}
          className='w-44'
        />

        <Input
          type='datetime-local'
          placeholder='结束时间'
          value={createTimeEnd}
          onChange={(e) => onCreateTimeEndChange(e.target.value)}
          className='w-44'
        />

        <Input
          type='number'
          placeholder='最小重试次数'
          value={retryCountMin}
          onChange={(e) => onRetryCountMinChange(e.target.value)}
          className='w-32'
          min={0}
        />

        <div className='flex items-center gap-2 ml-auto'>
          <Button onClick={onSearch}>
            <Search className='mr-2 size-4' />
            搜索
          </Button>
          <Button onClick={onReset} variant='outline' size='icon' title='重置'>
            <RotateCcw className='size-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
