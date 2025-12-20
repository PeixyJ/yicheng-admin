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
import type { NotificationParentType } from '@/types/notification-template'

interface TemplateSearchProps {
  code: string
  name: string
  parentType: NotificationParentType | ''
  status: string
  onCodeChange: (value: string) => void
  onNameChange: (value: string) => void
  onParentTypeChange: (value: NotificationParentType | '') => void
  onStatusChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export function TemplateSearch({
  code,
  name,
  parentType,
  status,
  onCodeChange,
  onNameChange,
  onParentTypeChange,
  onStatusChange,
  onSearch,
  onReset,
}: TemplateSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3 flex-wrap'>
        {/* 模板编码搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='模板编码'
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className='w-36 pl-10'
          />
        </div>

        {/* 模板名称搜索 */}
        <Input
          placeholder='模板名称'
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className='w-36'
        />

        {/* 分类筛选 */}
        <Select
          value={parentType || 'all'}
          onValueChange={(v) => onParentTypeChange(v === 'all' ? '' : (v as NotificationParentType))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部分类' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部分类</SelectItem>
            <SelectItem value='INBOX'>收件箱</SelectItem>
            <SelectItem value='SYSTEM'>系统</SelectItem>
          </SelectContent>
        </Select>

        {/* 状态筛选 */}
        <Select
          value={status || 'all'}
          onValueChange={onStatusChange}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='true'>已启用</SelectItem>
            <SelectItem value='false'>已禁用</SelectItem>
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
