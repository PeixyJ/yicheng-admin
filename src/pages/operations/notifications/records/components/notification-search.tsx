import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { NotificationParentType, NotificationStatus } from '@/types/notification'

interface NotificationSearchProps {
  userId: string
  teamId: string
  parentType: NotificationParentType | ''
  status: NotificationStatus | ''
  onUserIdChange: (value: string) => void
  onTeamIdChange: (value: string) => void
  onParentTypeChange: (value: NotificationParentType | '') => void
  onStatusChange: (value: NotificationStatus | '') => void
  onSearch: () => void
  onReset: () => void
}

const parentTypeOptions: { value: NotificationParentType; label: string }[] = [
  { value: 'INBOX', label: '收件箱' },
  { value: 'SYSTEM', label: '系统通知' },
]

const statusOptions: { value: NotificationStatus; label: string }[] = [
  { value: 'UNREAD', label: '未读' },
  { value: 'READ', label: '已读' },
  { value: 'ARCHIVED', label: '已归档' },
]

export function NotificationSearch({
  userId,
  teamId,
  parentType,
  status,
  onUserIdChange,
  onTeamIdChange,
  onParentTypeChange,
  onStatusChange,
  onSearch,
  onReset,
}: NotificationSearchProps) {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <Input
        placeholder='用户ID'
        value={userId}
        onChange={(e) => onUserIdChange(e.target.value)}
        className='w-40'
      />
      <Input
        placeholder='团队ID'
        value={teamId}
        onChange={(e) => onTeamIdChange(e.target.value)}
        className='w-40'
      />
      <Select
        value={parentType}
        onValueChange={(value) =>
          onParentTypeChange(value as NotificationParentType | '')
        }
      >
        <SelectTrigger className='w-32'>
          <SelectValue placeholder='通知类型' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>全部类型</SelectItem>
          {parentTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value as NotificationStatus | '')}
      >
        <SelectTrigger className='w-32'>
          <SelectValue placeholder='状态' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>全部状态</SelectItem>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onSearch}>搜索</Button>
      <Button variant='outline' onClick={onReset}>
        重置
      </Button>
    </div>
  )
}
