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
import type { FeedbackType, FeedbackStatus, FeedbackPriority } from '@/types/feedback'

interface FeedbackSearchProps {
  keyword: string
  feedbackType: FeedbackType | ''
  status: FeedbackStatus | ''
  priority: FeedbackPriority | ''
  userId: string
  handlerId: string
  onKeywordChange: (value: string) => void
  onFeedbackTypeChange: (value: FeedbackType | '') => void
  onStatusChange: (value: FeedbackStatus | '') => void
  onPriorityChange: (value: FeedbackPriority | '') => void
  onUserIdChange: (value: string) => void
  onHandlerIdChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export function FeedbackSearch({
  keyword,
  feedbackType,
  status,
  priority,
  userId,
  handlerId,
  onKeywordChange,
  onFeedbackTypeChange,
  onStatusChange,
  onPriorityChange,
  onUserIdChange,
  onHandlerIdChange,
  onSearch,
  onReset,
}: FeedbackSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3 flex-wrap'>
        {/* 关键词搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='搜索标题/内容'
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className='w-44 pl-10'
          />
        </div>

        {/* 反馈类型 */}
        <Select
          value={feedbackType || 'all'}
          onValueChange={(v) => onFeedbackTypeChange(v === 'all' ? '' : (v as FeedbackType))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部类型' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部类型</SelectItem>
            <SelectItem value='BUG'>Bug</SelectItem>
            <SelectItem value='FEATURE'>功能建议</SelectItem>
            <SelectItem value='COMPLAINT'>投诉</SelectItem>
            <SelectItem value='QUESTION'>咨询</SelectItem>
            <SelectItem value='OTHER'>其他</SelectItem>
          </SelectContent>
        </Select>

        {/* 处理状态 */}
        <Select
          value={status || 'all'}
          onValueChange={(v) => onStatusChange(v === 'all' ? '' : (v as FeedbackStatus))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='PENDING'>待处理</SelectItem>
            <SelectItem value='PROCESSING'>处理中</SelectItem>
            <SelectItem value='RESOLVED'>已解决</SelectItem>
            <SelectItem value='CLOSED'>已关闭</SelectItem>
          </SelectContent>
        </Select>

        {/* 优先级 */}
        <Select
          value={priority || 'all'}
          onValueChange={(v) => onPriorityChange(v === 'all' ? '' : (v as FeedbackPriority))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部优先级' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部优先级</SelectItem>
            <SelectItem value='LOW'>低</SelectItem>
            <SelectItem value='NORMAL'>普通</SelectItem>
            <SelectItem value='HIGH'>高</SelectItem>
            <SelectItem value='URGENT'>紧急</SelectItem>
          </SelectContent>
        </Select>

        {/* 用户ID */}
        <Input
          placeholder='用户ID'
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          className='w-24'
        />

        {/* 处理人ID */}
        <Input
          placeholder='处理人ID'
          value={handlerId}
          onChange={(e) => onHandlerIdChange(e.target.value)}
          className='w-24'
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
