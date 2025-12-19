import {RotateCcw, Search} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type {UserStatus} from '@/types/user'

interface UserSearchProps {
    keyword: string
    status: UserStatus | ''
    invitedByUserId: string
    onKeywordChange: (value: string) => void
    onStatusChange: (value: UserStatus | '') => void
    onInvitedByUserIdChange: (value: string) => void
    onSearch: () => void
    onReset: () => void
}

export function UserSearch({
  keyword,
  status,
  invitedByUserId,
  onKeywordChange,
  onStatusChange,
  onInvitedByUserIdChange,
  onSearch,
  onReset,
}: UserSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        {/* 关键词搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='搜索昵称或邀请码'
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className='w-52 pl-10'
          />
        </div>

        {/* 邀请人ID */}
        <Input
          placeholder='邀请人ID'
          value={invitedByUserId}
          onChange={(e) => onInvitedByUserIdChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className='w-28'
        />

        {/* 状态筛选 */}
        <Select
          value={status || 'all'}
          onValueChange={(v) => onStatusChange(v === 'all' ? '' : (v as UserStatus))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='ACTIVE'>正常</SelectItem>
            <SelectItem value='SUSPENDED'>封禁</SelectItem>
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
