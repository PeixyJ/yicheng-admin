import { RotateCcw, Search } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import type { DiscountType } from '@/types/coupon-template.ts'

interface TemplateSearchProps {
  name: string
  discountType: DiscountType | ''
  status: string
  onNameChange: (value: string) => void
  onDiscountTypeChange: (value: DiscountType | '') => void
  onStatusChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

const DISCOUNT_TYPE_OPTIONS: { value: DiscountType; label: string }[] = [
  { value: 'FIXED_AMOUNT', label: '固定金额' },
  { value: 'PERCENT', label: '百分比' },
  { value: 'FREE_TRIAL', label: '免费试用' },
]

export function TemplateSearch({
  name,
  discountType,
  status,
  onNameChange,
  onDiscountTypeChange,
  onStatusChange,
  onSearch,
  onReset,
}: TemplateSearchProps) {
  return (
    <div className='flex items-center gap-3 flex-wrap'>
      <Input
        placeholder='模板名称'
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className='w-40'
      />

      <Select
        value={discountType}
        onValueChange={(value) => onDiscountTypeChange(value as DiscountType | '')}
      >
        <SelectTrigger className='w-32'>
          <SelectValue placeholder='折扣类型' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>全部类型</SelectItem>
          {DISCOUNT_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className='w-28'>
          <SelectValue placeholder='启用状态' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>全部状态</SelectItem>
          <SelectItem value='true'>已启用</SelectItem>
          <SelectItem value='false'>已禁用</SelectItem>
        </SelectContent>
      </Select>

      <div className='flex items-center gap-2 ml-auto'>
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
