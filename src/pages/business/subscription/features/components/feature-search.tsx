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
import type { FeatureType } from '@/types/feature'

interface FeatureSearchProps {
  featureName: string
  featureCode: string
  featureType: FeatureType | ''
  status: boolean | ''
  onFeatureNameChange: (value: string) => void
  onFeatureCodeChange: (value: string) => void
  onFeatureTypeChange: (value: FeatureType | '') => void
  onStatusChange: (value: boolean | '') => void
  onSearch: () => void
  onReset: () => void
}

export function FeatureSearch({
  featureName,
  featureCode,
  featureType,
  status,
  onFeatureNameChange,
  onFeatureCodeChange,
  onFeatureTypeChange,
  onStatusChange,
  onSearch,
  onReset,
}: FeatureSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        {/* 功能名称搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='功能名称'
            value={featureName}
            onChange={(e) => onFeatureNameChange(e.target.value)}
            className='w-52 pl-10'
          />
        </div>

        {/* 功能编码搜索 */}
        <Input
          placeholder='功能编码'
          value={featureCode}
          onChange={(e) => onFeatureCodeChange(e.target.value)}
          className='w-52'
        />

        {/* 功能类型 */}
        <Select
          value={featureType || 'all'}
          onValueChange={(v) => onFeatureTypeChange(v === 'all' ? '' : (v as FeatureType))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部类型' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部类型</SelectItem>
            <SelectItem value='BOOLEAN'>开关型</SelectItem>
            <SelectItem value='POINTS'>计量型</SelectItem>
          </SelectContent>
        </Select>

        {/* 启用状态 */}
        <Select
          value={status === '' ? 'all' : String(status)}
          onValueChange={(v) => onStatusChange(v === 'all' ? '' : v === 'true')}
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
