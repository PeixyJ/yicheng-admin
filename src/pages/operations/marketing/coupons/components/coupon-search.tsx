import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, RotateCcw, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { getCouponTemplateList } from '@/services/coupon-template'
import { getTeamList } from '@/services/team'
import { getUserList } from '@/services/user'
import type { CouponTemplateVO } from '@/types/coupon-template'
import type { AdminTeamVO } from '@/types/team'
import type { AdminUserVO } from '@/types/user'
import type { CouponStatus, CouponSource } from '@/types/coupon'

interface CouponSearchProps {
  couponNo: string
  templateId: string
  teamId: string
  userId: string
  status: CouponStatus | ''
  source: CouponSource | ''
  onCouponNoChange: (value: string) => void
  onTemplateIdChange: (value: string) => void
  onTeamIdChange: (value: string) => void
  onUserIdChange: (value: string) => void
  onStatusChange: (value: CouponStatus | '') => void
  onSourceChange: (value: CouponSource | '') => void
  onSearch: () => void
  onReset: () => void
}

export function CouponSearch({
  couponNo,
  templateId,
  teamId,
  userId,
  status,
  source,
  onCouponNoChange,
  onTemplateIdChange,
  onTeamIdChange,
  onUserIdChange,
  onStatusChange,
  onSourceChange,
  onSearch,
  onReset,
}: CouponSearchProps) {
  // 模板下拉状态
  const [templateOpen, setTemplateOpen] = useState(false)
  const [templates, setTemplates] = useState<CouponTemplateVO[]>([])
  const [templateSearch, setTemplateSearch] = useState('')
  const [templatesLoading, setTemplatesLoading] = useState(false)

  // 团队下拉状态
  const [teamOpen, setTeamOpen] = useState(false)
  const [teams, setTeams] = useState<AdminTeamVO[]>([])
  const [teamSearch, setTeamSearch] = useState('')
  const [teamsLoading, setTeamsLoading] = useState(false)

  // 用户下拉状态
  const [userOpen, setUserOpen] = useState(false)
  const [users, setUsers] = useState<AdminUserVO[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [usersLoading, setUsersLoading] = useState(false)

  // 搜索模板
  useEffect(() => {
    if (!templateOpen) return

    const searchTemplates = async () => {
      setTemplatesLoading(true)
      try {
        const res = await getCouponTemplateList({
          page: 1,
          size: 50,
          name: templateSearch || undefined,
        })
        if (res.code === 'success') {
          setTemplates(res.data.records)
        }
      } catch {
        // Error handled by interceptor
      } finally {
        setTemplatesLoading(false)
      }
    }

    const debounce = setTimeout(searchTemplates, 300)
    return () => clearTimeout(debounce)
  }, [templateOpen, templateSearch])

  // 搜索团队
  useEffect(() => {
    if (!teamOpen) return

    const searchTeams = async () => {
      setTeamsLoading(true)
      try {
        const res = await getTeamList({
          page: 1,
          size: 50,
          keyword: teamSearch || undefined,
        })
        if (res.code === 'success') {
          setTeams(res.data.records)
        }
      } catch {
        // Error handled by interceptor
      } finally {
        setTeamsLoading(false)
      }
    }

    const debounce = setTimeout(searchTeams, 300)
    return () => clearTimeout(debounce)
  }, [teamOpen, teamSearch])

  // 搜索用户
  useEffect(() => {
    if (!userOpen) return

    const searchUsers = async () => {
      setUsersLoading(true)
      try {
        const res = await getUserList({
          page: 1,
          size: 50,
          keyword: userSearch || undefined,
        })
        if (res.code === 'success') {
          setUsers(res.data.records)
        }
      } catch {
        // Error handled by interceptor
      } finally {
        setUsersLoading(false)
      }
    }

    const debounce = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounce)
  }, [userOpen, userSearch])

  // 获取选中模板的显示名称
  const getSelectedTemplateName = () => {
    if (!templateId) return null
    const template = templates.find((t) => String(t.id) === templateId)
    return template?.name ?? `模板 ${templateId}`
  }

  // 获取选中团队的显示名称
  const getSelectedTeamName = () => {
    if (!teamId) return null
    const team = teams.find((t) => String(t.id) === teamId)
    return team?.name ?? `团队 ${teamId}`
  }

  // 获取选中用户的显示名称
  const getSelectedUserName = () => {
    if (!userId) return null
    const user = users.find((u) => String(u.id) === userId)
    return user?.nickname ?? `用户 ${userId}`
  }

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3 flex-wrap'>
        {/* 优惠券编号搜索 */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='优惠券编号'
            value={couponNo}
            onChange={(e) => onCouponNoChange(e.target.value)}
            className='w-40 pl-10'
          />
        </div>

        {/* 模板选择 */}
        <Popover open={templateOpen} onOpenChange={setTemplateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={templateOpen}
              className={cn('w-36 justify-between font-normal', !templateId && 'text-muted-foreground')}
            >
              <span className='truncate'>{getSelectedTemplateName() ?? '选择模板'}</span>
              <ChevronsUpDown className='ml-1 size-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-64 p-0' align='start' onOpenAutoFocus={(e) => e.preventDefault()}>
            <Command shouldFilter={false}>
              <CommandInput
                placeholder='搜索模板名称...'
                value={templateSearch}
                onValueChange={setTemplateSearch}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <CommandList>
                {templatesLoading ? (
                  <CommandEmpty>加载中...</CommandEmpty>
                ) : templates.length === 0 ? (
                  <CommandEmpty>未找到模板</CommandEmpty>
                ) : (
                  <CommandGroup>
                    <CommandItem
                      value='all'
                      onSelect={() => {
                        onTemplateIdChange('')
                        setTemplateOpen(false)
                      }}
                    >
                      <Check className={cn('mr-2 size-4 shrink-0', !templateId ? 'opacity-100' : 'opacity-0')} />
                      全部模板
                    </CommandItem>
                    {templates.map((template) => (
                      <CommandItem
                        key={template.id}
                        value={String(template.id)}
                        onSelect={() => {
                          onTemplateIdChange(String(template.id))
                          setTemplateOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 size-4 shrink-0',
                            templateId === String(template.id) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className='flex flex-col min-w-0'>
                          <span className='truncate'>{template.name}</span>
                          <span className='text-xs text-muted-foreground truncate'>
                            {template.discountTypeDesc}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* 团队选择 */}
        <Popover open={teamOpen} onOpenChange={setTeamOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={teamOpen}
              className={cn('w-36 justify-between font-normal', !teamId && 'text-muted-foreground')}
            >
              <span className='truncate'>{getSelectedTeamName() ?? '选择团队'}</span>
              <ChevronsUpDown className='ml-1 size-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-64 p-0' align='start' onOpenAutoFocus={(e) => e.preventDefault()}>
            <Command shouldFilter={false}>
              <CommandInput
                placeholder='搜索团队名称或编码...'
                value={teamSearch}
                onValueChange={setTeamSearch}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <CommandList>
                {teamsLoading ? (
                  <CommandEmpty>加载中...</CommandEmpty>
                ) : teams.length === 0 ? (
                  <CommandEmpty>未找到团队</CommandEmpty>
                ) : (
                  <CommandGroup>
                    <CommandItem
                      value='all'
                      onSelect={() => {
                        onTeamIdChange('')
                        setTeamOpen(false)
                      }}
                    >
                      <Check className={cn('mr-2 size-4 shrink-0', !teamId ? 'opacity-100' : 'opacity-0')} />
                      全部团队
                    </CommandItem>
                    {teams.map((team) => (
                      <CommandItem
                        key={team.id}
                        value={String(team.id)}
                        onSelect={() => {
                          onTeamIdChange(String(team.id))
                          setTeamOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 size-4 shrink-0',
                            teamId === String(team.id) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <Avatar className='mr-2 size-6 shrink-0'>
                          <AvatarImage src={team.logoUrl || undefined} alt={team.name} />
                          <AvatarFallback className='text-xs'>{team.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col min-w-0'>
                          <span className='truncate'>{team.name}</span>
                          <span className='text-xs text-muted-foreground truncate'>
                            {team.teamCode} · {team.statusDesc}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* 用户选择 */}
        <Popover open={userOpen} onOpenChange={setUserOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={userOpen}
              className={cn('w-36 justify-between font-normal', !userId && 'text-muted-foreground')}
            >
              <span className='truncate'>{getSelectedUserName() ?? '选择用户'}</span>
              <ChevronsUpDown className='ml-1 size-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-64 p-0' align='start' onOpenAutoFocus={(e) => e.preventDefault()}>
            <Command shouldFilter={false}>
              <CommandInput
                placeholder='搜索用户昵称...'
                value={userSearch}
                onValueChange={setUserSearch}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <CommandList>
                {usersLoading ? (
                  <CommandEmpty>加载中...</CommandEmpty>
                ) : users.length === 0 ? (
                  <CommandEmpty>未找到用户</CommandEmpty>
                ) : (
                  <CommandGroup>
                    <CommandItem
                      value='all'
                      onSelect={() => {
                        onUserIdChange('')
                        setUserOpen(false)
                      }}
                    >
                      <Check className={cn('mr-2 size-4 shrink-0', !userId ? 'opacity-100' : 'opacity-0')} />
                      全部用户
                    </CommandItem>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={String(user.id)}
                        onSelect={() => {
                          onUserIdChange(String(user.id))
                          setUserOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 size-4 shrink-0',
                            userId === String(user.id) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <Avatar className='mr-2 size-6 shrink-0'>
                          <AvatarImage src={user.avatarUrl || undefined} alt={user.nickname} />
                          <AvatarFallback className='text-xs'>{user.nickname.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col min-w-0'>
                          <span className='truncate'>{user.nickname}</span>
                          <span className='text-xs text-muted-foreground truncate'>ID: {user.id}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* 状态筛选 */}
        <Select
          value={status || 'all'}
          onValueChange={(v) => onStatusChange(v === 'all' ? '' : (v as CouponStatus))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
            <SelectItem value='UNUSED'>未使用</SelectItem>
            <SelectItem value='USED'>已使用</SelectItem>
            <SelectItem value='EXPIRED'>已过期</SelectItem>
            <SelectItem value='REVOKED'>已撤销</SelectItem>
          </SelectContent>
        </Select>

        {/* 来源筛选 */}
        <Select
          value={source || 'all'}
          onValueChange={(v) => onSourceChange(v === 'all' ? '' : (v as CouponSource))}
        >
          <SelectTrigger className='w-28'>
            <SelectValue placeholder='全部来源' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部来源</SelectItem>
            <SelectItem value='PROMO_CODE'>优惠码</SelectItem>
            <SelectItem value='SYSTEM_GRANT'>系统发放</SelectItem>
            <SelectItem value='ACTIVITY'>活动</SelectItem>
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
