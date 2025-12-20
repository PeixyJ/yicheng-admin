import { RotateCcw, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PointTeamSearchProps {
  teamId: string
  minAvailablePoints: string
  maxAvailablePoints: string
  onTeamIdChange: (value: string) => void
  onMinAvailablePointsChange: (value: string) => void
  onMaxAvailablePointsChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export function PointTeamSearch({
  teamId,
  minAvailablePoints,
  maxAvailablePoints,
  onTeamIdChange,
  onMinAvailablePointsChange,
  onMaxAvailablePointsChange,
  onSearch,
  onReset,
}: PointTeamSearchProps) {
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
            className='w-32 pl-10'
          />
        </div>

        {/* 可用点数范围 */}
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>可用点数</span>
          <Input
            type='number'
            placeholder='最小'
            value={minAvailablePoints}
            onChange={(e) => onMinAvailablePointsChange(e.target.value)}
            className='w-24'
          />
          <span className='text-muted-foreground'>-</span>
          <Input
            type='number'
            placeholder='最大'
            value={maxAvailablePoints}
            onChange={(e) => onMaxAvailablePointsChange(e.target.value)}
            className='w-24'
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
