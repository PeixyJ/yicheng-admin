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
import type { ResourceType } from '@/types/resource-pack'

interface PackageSearchProps {
  packCode: string
  packName: string
  resourceType: ResourceType | ''
  status: boolean | ''
  onPackCodeChange: (value: string) => void
  onPackNameChange: (value: string) => void
  onResourceTypeChange: (value: ResourceType | '') => void
  onStatusChange: (value: boolean | '') => void
  onSearch: () => void
  onReset: () => void
}

export function PackageSearch({
  packCode,
  packName,
  resourceType,
  status,
  onPackCodeChange,
  onPackNameChange,
  onResourceTypeChange,
  onStatusChange,
  onSearch,
  onReset,
}: PackageSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        {/* 资源包编码 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='资源包编码'
            value={packCode}
            onChange={(e) => onPackCodeChange(e.target.value)}
            className='w-40 pl-10'
          />
        </div>

        {/* 资源包名称 */}
        <Input
          placeholder='资源包名称'
          value={packName}
          onChange={(e) => onPackNameChange(e.target.value)}
          className='w-40'
        />

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
            <SelectItem value='enabled'>已上架</SelectItem>
            <SelectItem value='disabled'>已下架</SelectItem>
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
