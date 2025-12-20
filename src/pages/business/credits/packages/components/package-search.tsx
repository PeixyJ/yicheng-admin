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
import type { Currency } from '@/types/point-package'

interface PackageSearchProps {
  keyword: string
  currency: Currency | ''
  status: string
  visible: string
  onKeywordChange: (value: string) => void
  onCurrencyChange: (value: Currency | '') => void
  onStatusChange: (value: string) => void
  onVisibleChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export function PackageSearch({
  keyword,
  currency,
  status,
  visible,
  onKeywordChange,
  onCurrencyChange,
  onStatusChange,
  onVisibleChange,
  onSearch,
  onReset,
}: PackageSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        {/* 关键词搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='搜索套餐名称或编码'
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className='w-52 pl-10'
          />
        </div>

        {/* 货币类型 */}
        <Select
          value={currency || 'all'}
          onValueChange={(v) => onCurrencyChange(v === 'all' ? '' : (v as Currency))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部货币' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部货币</SelectItem>
            <SelectItem value='CNY'>人民币</SelectItem>
            <SelectItem value='USD'>美元</SelectItem>
          </SelectContent>
        </Select>

        {/* 上架状态 */}
        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='上架状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='true'>已上架</SelectItem>
            <SelectItem value='false'>已下架</SelectItem>
          </SelectContent>
        </Select>

        {/* 可见状态 */}
        <Select
          value={visible}
          onValueChange={onVisibleChange}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='可见状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部可见</SelectItem>
            <SelectItem value='true'>可见</SelectItem>
            <SelectItem value='false'>隐藏</SelectItem>
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
