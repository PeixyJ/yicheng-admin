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
import type { PlanType } from '@/types/plan'

interface PlanSearchProps {
  planName: string
  planCode: string
  planType: PlanType | ''
  status: boolean | ''
  onPlanNameChange: (value: string) => void
  onPlanCodeChange: (value: string) => void
  onPlanTypeChange: (value: PlanType | '') => void
  onStatusChange: (value: boolean | '') => void
  onSearch: () => void
  onReset: () => void
}

export function PlanSearch({
  planName,
  planCode,
  planType,
  status,
  onPlanNameChange,
  onPlanCodeChange,
  onPlanTypeChange,
  onStatusChange,
  onSearch,
  onReset,
}: PlanSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        {/* 计划名称搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='搜索计划名称'
            value={planName}
            onChange={(e) => onPlanNameChange(e.target.value)}
            className='w-40 pl-10'
          />
        </div>

        {/* 计划编码 */}
        <Input
          placeholder='计划编码'
          value={planCode}
          onChange={(e) => onPlanCodeChange(e.target.value)}
          className='w-36'
        />

        {/* 计划类型 */}
        <Select
          value={planType || 'all'}
          onValueChange={(v) => onPlanTypeChange(v === 'all' ? '' : (v as PlanType))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部类型' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部类型</SelectItem>
            <SelectItem value='FREE'>免费版</SelectItem>
            <SelectItem value='TRIAL'>试用版</SelectItem>
            <SelectItem value='PAID'>付费版</SelectItem>
          </SelectContent>
        </Select>

        {/* 启用状态 */}
        <Select
          value={status === '' ? 'all' : status ? 'enabled' : 'disabled'}
          onValueChange={(v) => onStatusChange(v === 'all' ? '' : v === 'enabled')}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='enabled'>已启用</SelectItem>
            <SelectItem value='disabled'>已禁用</SelectItem>
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
