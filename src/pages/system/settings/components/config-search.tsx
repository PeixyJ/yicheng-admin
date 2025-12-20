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

interface ConfigSearchProps {
  keyword: string
  configGroup: string
  onKeywordChange: (value: string) => void
  onConfigGroupChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export function ConfigSearch({
  keyword,
  configGroup,
  onKeywordChange,
  onConfigGroupChange,
  onSearch,
  onReset,
}: ConfigSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        {/* 关键词搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='搜索配置键或描述'
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className='w-64 pl-10'
          />
        </div>

        {/* 配置分组 */}
        <Select
          value={configGroup || 'all'}
          onValueChange={(v) => onConfigGroupChange(v === 'all' ? '' : v)}
        >
          <SelectTrigger className='w-36'>
            <SelectValue placeholder='全部分组' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部分组</SelectItem>
            <SelectItem value='SYSTEM'>系统配置</SelectItem>
            <SelectItem value='BUSINESS'>业务配置</SelectItem>
            <SelectItem value='SECURITY'>安全配置</SelectItem>
            <SelectItem value='NOTIFICATION'>通知配置</SelectItem>
            <SelectItem value='PAYMENT'>支付配置</SelectItem>
            <SelectItem value='FEATURE'>功能开关</SelectItem>
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
