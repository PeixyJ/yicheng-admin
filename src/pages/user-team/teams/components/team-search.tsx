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
import type { TeamStatus, TeamType } from '@/types/team'

interface TeamSearchProps {
  keyword: string
  teamType: TeamType | ''
  status: TeamStatus | ''
  ownerId: string
  onKeywordChange: (value: string) => void
  onTeamTypeChange: (value: TeamType | '') => void
  onStatusChange: (value: TeamStatus | '') => void
  onOwnerIdChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export function TeamSearch({
  keyword,
  teamType,
  status,
  ownerId,
  onKeywordChange,
  onTeamTypeChange,
  onStatusChange,
  onOwnerIdChange,
  onSearch,
  onReset,
}: TeamSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        {/* 关键词搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='搜索团队名称或编码'
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className='w-52 pl-10'
          />
        </div>

        {/* 团队类型 */}
        <Select
          value={teamType || 'all'}
          onValueChange={(v) => onTeamTypeChange(v === 'all' ? '' : (v as TeamType))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部类型' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部类型</SelectItem>
            <SelectItem value='PERSONAL'>个人</SelectItem>
            <SelectItem value='ENTERPRISE'>企业</SelectItem>
          </SelectContent>
        </Select>

        {/* 团队状态 */}
        <Select
          value={status || 'all'}
          onValueChange={(v) => onStatusChange(v === 'all' ? '' : (v as TeamStatus))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='PENDING'>待激活</SelectItem>
            <SelectItem value='ACTIVE'>正常</SelectItem>
            <SelectItem value='SUSPENDED'>已冻结</SelectItem>
            <SelectItem value='DISBANDED'>已解散</SelectItem>
          </SelectContent>
        </Select>

        {/* 所有者ID */}
        <Input
          placeholder='所有者ID'
          value={ownerId}
          onChange={(e) => onOwnerIdChange(e.target.value)}
          className='w-28'
        />
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
