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
import type { ResourceType, ExtensionSource, ExtensionStatus } from '@/types/resource-pack'

interface RecordSearchProps {
  teamId: string
  resourceType: ResourceType | ''
  source: ExtensionSource | ''
  status: ExtensionStatus | ''
  onTeamIdChange: (value: string) => void
  onResourceTypeChange: (value: ResourceType | '') => void
  onSourceChange: (value: ExtensionSource | '') => void
  onStatusChange: (value: ExtensionStatus | '') => void
  onSearch: () => void
  onReset: () => void
}

export function RecordSearch({
  teamId,
  resourceType,
  source,
  status,
  onTeamIdChange,
  onResourceTypeChange,
  onSourceChange,
  onStatusChange,
  onSearch,
  onReset,
}: RecordSearchProps) {
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

        {/* 资源类型 */}
        <Select
          value={resourceType || 'all'}
          onValueChange={(v) => onResourceTypeChange(v === 'all' ? '' : (v as ResourceType))}
        >
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='全部类型' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部类型</SelectItem>
            <SelectItem value='PROJECT'>项目数</SelectItem>
            <SelectItem value='MEMBER'>成员数</SelectItem>
            <SelectItem value='STORAGE'>存储空间</SelectItem>
          </SelectContent>
        </Select>

        {/* 来源 */}
        <Select
          value={source || 'all'}
          onValueChange={(v) => onSourceChange(v === 'all' ? '' : (v as ExtensionSource))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部来源' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部来源</SelectItem>
            <SelectItem value='PURCHASE'>购买</SelectItem>
            <SelectItem value='GRANT'>赠送</SelectItem>
          </SelectContent>
        </Select>

        {/* 状态 */}
        <Select
          value={status || 'all'}
          onValueChange={(v) => onStatusChange(v === 'all' ? '' : (v as ExtensionStatus))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='ACTIVE'>生效中</SelectItem>
            <SelectItem value='EXPIRED'>已过期</SelectItem>
            <SelectItem value='REVOKED'>已撤销</SelectItem>
          </SelectContent>
        </Select>
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
