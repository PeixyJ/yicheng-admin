import { Search, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SubscribeStatus, SubscribeSource } from '@/types/subscribe'

interface SubscribeSearchProps {
  teamId: string
  planId: string
  status: SubscribeStatus | ''
  source: SubscribeSource | ''
  onTeamIdChange: (value: string) => void
  onPlanIdChange: (value: string) => void
  onStatusChange: (value: SubscribeStatus | '') => void
  onSourceChange: (value: SubscribeSource | '') => void
  onSearch: () => void
  onReset: () => void
}

export function SubscribeSearch({
  teamId,
  planId,
  status,
  source,
  onTeamIdChange,
  onPlanIdChange,
  onStatusChange,
  onSourceChange,
  onSearch,
  onReset,
}: SubscribeSearchProps) {
  return (
    <div className='flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4'>
      <Input
        placeholder='团队ID'
        value={teamId}
        onChange={(e) => onTeamIdChange(e.target.value)}
        className='w-32'
      />
      <Input
        placeholder='计划ID'
        value={planId}
        onChange={(e) => onPlanIdChange(e.target.value)}
        className='w-32'
      />
      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value as SubscribeStatus | '')}
      >
        <SelectTrigger className='w-32'>
          <SelectValue placeholder='订阅状态' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>全部状态</SelectItem>
          <SelectItem value='PENDING'>待生效</SelectItem>
          <SelectItem value='ACTIVE'>生效中</SelectItem>
          <SelectItem value='EXPIRED'>已过期</SelectItem>
          <SelectItem value='CANCELLED'>已取消</SelectItem>
          <SelectItem value='UPGRADED'>已升级</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={source}
        onValueChange={(value) => onSourceChange(value as SubscribeSource | '')}
      >
        <SelectTrigger className='w-32'>
          <SelectValue placeholder='订阅来源' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>全部来源</SelectItem>
          <SelectItem value='PURCHASE'>购买</SelectItem>
          <SelectItem value='GRANT'>赠送</SelectItem>
          <SelectItem value='SYSTEM'>系统</SelectItem>
        </SelectContent>
      </Select>
      <div className='flex gap-2'>
        <Button onClick={onSearch}>
          <Search className='mr-2 size-4' />
          搜索
        </Button>
        <Button variant='outline' onClick={onReset}>
          <RotateCcw className='mr-2 size-4' />
          重置
        </Button>
      </div>
    </div>
  )
}
