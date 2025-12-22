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
import { getTeamList } from '@/services/team'
import { getUserList } from '@/services/user'
import type { AdminTeamVO } from '@/types/team'
import type { AdminUserVO } from '@/types/user'
import type { PaymentChannel, OrderType, OrderStatus } from '@/types/payment-order'

const PAYMENT_CHANNEL_OPTIONS: { value: PaymentChannel | 'all'; label: string }[] = [
  { value: 'all', label: '全部渠道' },
  { value: 'STRIPE', label: 'Stripe' },
  { value: 'ALIPAY', label: '支付宝' },
  { value: 'WECHAT_PAY', label: '微信支付' },
]

const ORDER_TYPE_OPTIONS: { value: OrderType | 'all'; label: string }[] = [
  { value: 'all', label: '全部类型' },
  { value: 'NEW', label: '新订阅' },
  { value: 'UPGRADE', label: '升级' },
  { value: 'RENEW', label: '续费' },
  { value: 'POINT_PURCHASE', label: '点数购买' },
]

const ORDER_STATUS_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'PENDING', label: '待支付' },
  { value: 'PAID', label: '已支付' },
  { value: 'FAILED', label: '支付失败' },
  { value: 'CANCELLED', label: '已取消' },
  { value: 'REFUNDED', label: '已退款' },
  { value: 'PARTIAL_REFUNDED', label: '部分退款' },
]

interface OrderSearchProps {
  orderNo: string
  teamId: string
  userId: string
  paymentChannel: PaymentChannel | 'all'
  orderType: OrderType | 'all'
  orderStatus: OrderStatus | 'all'
  onOrderNoChange: (value: string) => void
  onTeamIdChange: (value: string) => void
  onUserIdChange: (value: string) => void
  onPaymentChannelChange: (value: PaymentChannel | 'all') => void
  onOrderTypeChange: (value: OrderType | 'all') => void
  onOrderStatusChange: (value: OrderStatus | 'all') => void
  onSearch: () => void
  onReset: () => void
}

export function OrderSearch({
  orderNo,
  teamId,
  userId,
  paymentChannel,
  orderType,
  orderStatus,
  onOrderNoChange,
  onTeamIdChange,
  onUserIdChange,
  onPaymentChannelChange,
  onOrderTypeChange,
  onOrderStatusChange,
  onSearch,
  onReset,
}: OrderSearchProps) {
  // 团队选择器状态
  const [teamSearchOpen, setTeamSearchOpen] = useState(false)
  const [teamKeyword, setTeamKeyword] = useState('')
  const [teams, setTeams] = useState<AdminTeamVO[]>([])
  const [selectedTeam, setSelectedTeam] = useState<AdminTeamVO | null>(null)
  const [isSearchingTeam, setIsSearchingTeam] = useState(false)
  const teamSearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 用户选择器状态
  const [userSearchOpen, setUserSearchOpen] = useState(false)
  const [userKeyword, setUserKeyword] = useState('')
  const [users, setUsers] = useState<AdminUserVO[]>([])
  const [selectedUser, setSelectedUser] = useState<AdminUserVO | null>(null)
  const [isSearchingUser, setIsSearchingUser] = useState(false)
  const userSearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 当外部 teamId 被清空时，清除选中状态
  useEffect(() => {
    if (!teamId) {
      setSelectedTeam(null)
    }
  }, [teamId])

  // 当外部 userId 被清空时，清除选中状态
  useEffect(() => {
    if (!userId) {
      setSelectedUser(null)
    }
  }, [userId])

  // 加载团队列表
  const fetchTeams = async (keyword: string) => {
    setIsSearchingTeam(true)
    try {
      const response = await getTeamList({ page: 1, size: 20, keyword: keyword || undefined })
      if (response.code === 'success') {
        setTeams(response.data.records)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setIsSearchingTeam(false)
    }
  }

  // 加载用户列表
  const fetchUsers = async (keyword: string) => {
    setIsSearchingUser(true)
    try {
      const response = await getUserList({ page: 1, size: 20, keyword: keyword || undefined })
      if (response.code === 'success') {
        setUsers(response.data.records)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setIsSearchingUser(false)
    }
  }

  // 打开团队选择器时加载初始数据
  useEffect(() => {
    if (teamSearchOpen) {
      fetchTeams('')
    }
  }, [teamSearchOpen])

  // 打开用户选择器时加载初始数据
  useEffect(() => {
    if (userSearchOpen) {
      fetchUsers('')
    }
  }, [userSearchOpen])

  // 搜索团队（防抖）
  useEffect(() => {
    if (!teamSearchOpen) return

    if (teamSearchTimeoutRef.current) {
      clearTimeout(teamSearchTimeoutRef.current)
    }

    teamSearchTimeoutRef.current = setTimeout(() => {
      fetchTeams(teamKeyword)
    }, 300)

    return () => {
      if (teamSearchTimeoutRef.current) {
        clearTimeout(teamSearchTimeoutRef.current)
      }
    }
  }, [teamKeyword])

  // 搜索用户（防抖）
  useEffect(() => {
    if (!userSearchOpen) return

    if (userSearchTimeoutRef.current) {
      clearTimeout(userSearchTimeoutRef.current)
    }

    userSearchTimeoutRef.current = setTimeout(() => {
      fetchUsers(userKeyword)
    }, 300)

    return () => {
      if (userSearchTimeoutRef.current) {
        clearTimeout(userSearchTimeoutRef.current)
      }
    }
  }, [userKeyword])

  // 选择团队
  const handleSelectTeam = (team: AdminTeamVO) => {
    setSelectedTeam(team)
    onTeamIdChange(String(team.id))
    setTeamSearchOpen(false)
    setTeamKeyword('')
  }

  // 清除团队选择
  const handleClearTeam = () => {
    setSelectedTeam(null)
    onTeamIdChange('')
  }

  // 选择用户
  const handleSelectUser = (user: AdminUserVO) => {
    setSelectedUser(user)
    onUserIdChange(String(user.id))
    setUserSearchOpen(false)
    setUserKeyword('')
  }

  // 清除用户选择
  const handleClearUser = () => {
    setSelectedUser(null)
    onUserIdChange('')
  }

  return (
    <div className='flex items-center gap-3 rounded-lg border bg-card p-4'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='订单号'
          value={orderNo}
          onChange={(e) => onOrderNoChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className='w-44 pl-10'
        />
      </div>

      {/* 团队选择器 */}
      <Popover open={teamSearchOpen} onOpenChange={setTeamSearchOpen}>
        <div className='relative'>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-40 justify-start font-normal'
            >
              {selectedTeam ? (
                <div className='flex items-center gap-2 flex-1 min-w-0 pr-4'>
                  <Avatar className='size-5 shrink-0'>
                    <AvatarImage src={selectedTeam.logoUrl ?? undefined} />
                    <AvatarFallback className='text-xs'>{selectedTeam.name?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className='truncate text-sm'>{selectedTeam.name}</span>
                </div>
              ) : (
                <span className='text-muted-foreground'>选择团队</span>
              )}
            </Button>
          </PopoverTrigger>
          {selectedTeam && (
            <button
              type='button'
              className='absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-accent'
              onClick={handleClearTeam}
            >
              <X className='size-4 text-muted-foreground hover:text-foreground' />
            </button>
          )}
        </div>
        <PopoverContent className='w-64 p-2' align='start'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
            <Input
              placeholder='搜索团队名称或编码'
              value={teamKeyword}
              onChange={(e) => setTeamKeyword(e.target.value)}
              className='pl-8 pr-8'
            />
            {isSearchingTeam && (
              <LoaderCircle className='absolute right-2.5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground' />
            )}
          </div>
          <div className='mt-2 max-h-48 overflow-y-auto'>
            {teams.length === 0 ? (
              <p className='text-center text-sm text-muted-foreground py-4'>
                {isSearchingTeam ? '搜索中...' : '未找到团队'}
              </p>
            ) : (
              teams.map((team) => (
                <button
                  key={team.id}
                  type='button'
                  className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent cursor-pointer'
                  onClick={() => handleSelectTeam(team)}
                >
                  <Avatar className='size-6'>
                    <AvatarImage src={team.logoUrl ?? undefined} />
                    <AvatarFallback className='text-xs'>{team.name?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 text-left min-w-0'>
                    <p className='truncate font-medium'>{team.name}</p>
                    <p className='truncate text-xs text-muted-foreground'>ID: {team.id}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* 用户选择器 */}
      <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
        <div className='relative'>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-40 justify-start font-normal'
            >
              {selectedUser ? (
                <div className='flex items-center gap-2 flex-1 min-w-0 pr-4'>
                  <Avatar className='size-5 shrink-0'>
                    <AvatarImage src={selectedUser.avatarUrl ?? undefined} />
                    <AvatarFallback className='text-xs'>{selectedUser.nickname?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className='truncate text-sm'>{selectedUser.nickname}</span>
                </div>
              ) : (
                <span className='text-muted-foreground'>选择用户</span>
              )}
            </Button>
          </PopoverTrigger>
          {selectedUser && (
            <button
              type='button'
              className='absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-accent'
              onClick={handleClearUser}
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
              value={userKeyword}
              onChange={(e) => setUserKeyword(e.target.value)}
              className='pl-8 pr-8'
            />
            {isSearchingUser && (
              <LoaderCircle className='absolute right-2.5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground' />
            )}
          </div>
          <div className='mt-2 max-h-48 overflow-y-auto'>
            {users.length === 0 ? (
              <p className='text-center text-sm text-muted-foreground py-4'>
                {isSearchingUser ? '搜索中...' : '未找到用户'}
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
                    <AvatarImage src={user.avatarUrl ?? undefined} />
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

      <Select value={paymentChannel} onValueChange={onPaymentChannelChange}>
        <SelectTrigger className='w-28'>
          <SelectValue placeholder='支付渠道' />
        </SelectTrigger>
        <SelectContent>
          {PAYMENT_CHANNEL_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={orderType} onValueChange={onOrderTypeChange}>
        <SelectTrigger className='w-28'>
          <SelectValue placeholder='订单类型' />
        </SelectTrigger>
        <SelectContent>
          {ORDER_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={orderStatus} onValueChange={onOrderStatusChange}>
        <SelectTrigger className='w-28'>
          <SelectValue placeholder='订单状态' />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='ml-auto flex items-center gap-2'>
        <Button onClick={onSearch}>
          <Search className='mr-2 size-4' />
          搜索
        </Button>
        <Button variant='outline' onClick={onReset}>
          <RotateCcw className='mr-2 size-4' />
          重置
        </Button>
      </div>
    </div>
  )
}
