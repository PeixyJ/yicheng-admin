import { useState, useEffect, useRef } from 'react'
import { LoaderCircle, RotateCcw, Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserList } from '@/services/user'
import type { AdminUserVO } from '@/types/user'
import type { TeamStatus, TeamType } from '@/types/team'

interface TeamSearchProps {
  keyword: string
  teamType: TeamType | ''
  status: TeamStatus | ''
  ownerId: string
  onKeywordChange: (value: string) => void
  onTeamTypeChange: (value: TeamType | '') => void
  onStatusChange: (value: TeamStatus | '') => void
  onOwnerIdChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export function TeamSearch({
  keyword,
  teamType,
  status,
  ownerId,
  onKeywordChange,
  onTeamTypeChange,
  onStatusChange,
  onOwnerIdChange,
  onSearch,
  onReset,
}: TeamSearchProps) {
  const [ownerSearchOpen, setOwnerSearchOpen] = useState(false)
  const [ownerKeyword, setOwnerKeyword] = useState('')
  const [users, setUsers] = useState<AdminUserVO[]>([])
  const [selectedUser, setSelectedUser] = useState<AdminUserVO | null>(null)
  const [isSearchingOwner, setIsSearchingOwner] = useState(false)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 当外部 ownerId 被清空时，清除选中状态
  useEffect(() => {
    if (!ownerId) {
      setSelectedUser(null)
    }
  }, [ownerId])

  // 搜索用户（防抖）
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (ownerKeyword.trim()) {
      setIsSearchingOwner(true)
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await getUserList({ page: 1, size: 20, keyword: ownerKeyword })
          if (response.code === 'success') {
            setUsers(response.data.records)
          }
        } catch {
          // Error handled by interceptor
        } finally {
          setIsSearchingOwner(false)
        }
      }, 300)
    } else {
      setUsers([])
      setIsSearchingOwner(false)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [ownerKeyword])

  // 选择用户
  const handleSelectUser = (user: AdminUserVO) => {
    setSelectedUser(user)
    onOwnerIdChange(String(user.id))
    setOwnerSearchOpen(false)
    setOwnerKeyword('')
  }

  // 清除选择
  const handleClearOwner = () => {
    setSelectedUser(null)
    onOwnerIdChange('')
  }

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        {/* 关键词搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='搜索团队名称或编码'
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className='w-52 pl-10'
          />
        </div>

        {/* 团队类型 */}
        <Select
          value={teamType || 'all'}
          onValueChange={(v) => onTeamTypeChange(v === 'all' ? '' : (v as TeamType))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部类型' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部类型</SelectItem>
            <SelectItem value='PERSONAL'>个人团队</SelectItem>
            <SelectItem value='TEAM'>协作团队</SelectItem>
          </SelectContent>
        </Select>

        {/* 团队状态 */}
        <Select
          value={status || 'all'}
          onValueChange={(v) => onStatusChange(v === 'all' ? '' : (v as TeamStatus))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='PENDING'>待激活</SelectItem>
            <SelectItem value='ACTIVE'>正常</SelectItem>
            <SelectItem value='SUSPENDED'>已冻结</SelectItem>
            <SelectItem value='DISBANDED'>已解散</SelectItem>
          </SelectContent>
        </Select>

        {/* 所有者 */}
        <Popover open={ownerSearchOpen} onOpenChange={setOwnerSearchOpen}>
          <div className='relative'>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-64 justify-start font-normal'
              >
                {selectedUser ? (
                  <div className='flex items-center gap-2 flex-1 min-w-0 pr-4'>
                    <Avatar className='size-5 shrink-0'>
                      <AvatarImage src={selectedUser.avatarUrl || undefined} />
                      <AvatarFallback className='text-xs'>{selectedUser.nickname?.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className='truncate'>{selectedUser.nickname}</span>
                  </div>
                ) : (
                  <span className='text-muted-foreground'>选择所有者</span>
                )}
              </Button>
            </PopoverTrigger>
            {selectedUser && (
              <button
                type='button'
                className='absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-accent'
                onClick={handleClearOwner}
              >
                <X className='size-4 text-muted-foreground hover:text-foreground' />
              </button>
            )}
          </div>
          <PopoverContent className='w-64 p-2' align='start'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
              <Input
                placeholder='搜索用户昵称或邀请码'
                value={ownerKeyword}
                onChange={(e) => setOwnerKeyword(e.target.value)}
                className='pl-8 pr-8'
              />
              {isSearchingOwner && (
                <LoaderCircle className='absolute right-2.5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground' />
              )}
            </div>
            <div className='mt-2 max-h-48 overflow-y-auto'>
              {users.length === 0 ? (
                <p className='text-center text-sm text-muted-foreground py-4'>
                  {ownerKeyword ? '未找到用户' : '输入关键词搜索'}
                </p>
              ) : (
                users.map((user) => (
                  <button
                    key={user.id}
                    type='button'
                    className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent cursor-pointer'
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar className='size-6'>
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback className='text-xs'>{user.nickname?.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1 text-left min-w-0'>
                      <p className='truncate font-medium'>{user.nickname}</p>
                      <p className='truncate text-xs text-muted-foreground'>ID: {user.id}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
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
