import { useEffect, useState } from 'react'
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
import type { AdminRoleCode, AdminRoleVO, AdminStatus } from '@/types/admin'
import { getAdminRoles } from '@/services/admin'

interface AdminSearchProps {
  keyword: string
  roleCode: AdminRoleCode | ''
  status: AdminStatus | ''
  onKeywordChange: (value: string) => void
  onRoleCodeChange: (value: AdminRoleCode | '') => void
  onStatusChange: (value: AdminStatus | '') => void
  onSearch: () => void
  onReset: () => void
}

export function AdminSearch({
  keyword,
  roleCode,
  status,
  onKeywordChange,
  onRoleCodeChange,
  onStatusChange,
  onSearch,
  onReset,
}: AdminSearchProps) {
  const [roles, setRoles] = useState<AdminRoleVO[]>([])

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      const res = await getAdminRoles()
      if (res.code === 'success') {
        setRoles(res.data)
      }
    } catch {
      // Error handled by interceptor
    }
  }

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        {/* 关键词搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='搜索工号或姓名'
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className='w-52 pl-10'
          />
        </div>

        {/* 角色筛选 */}
        <Select
          value={roleCode || 'all'}
          onValueChange={(v) => onRoleCodeChange(v === 'all' ? '' : (v as AdminRoleCode))}
        >
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='全部角色' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部角色</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.code} value={role.code}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 状态筛选 */}
        <Select
          value={status || 'all'}
          onValueChange={(v) => onStatusChange(v === 'all' ? '' : (v as AdminStatus))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='PENDING'>待激活</SelectItem>
            <SelectItem value='ACTIVE'>正常</SelectItem>
            <SelectItem value='SUSPENDED'>已停用</SelectItem>
            <SelectItem value='RESIGNED'>已离职</SelectItem>
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
