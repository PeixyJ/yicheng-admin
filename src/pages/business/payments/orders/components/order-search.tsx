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
  createTimeStart: string
  createTimeEnd: string
  onOrderNoChange: (value: string) => void
  onTeamIdChange: (value: string) => void
  onUserIdChange: (value: string) => void
  onPaymentChannelChange: (value: PaymentChannel | 'all') => void
  onOrderTypeChange: (value: OrderType | 'all') => void
  onOrderStatusChange: (value: OrderStatus | 'all') => void
  onCreateTimeStartChange: (value: string) => void
  onCreateTimeEndChange: (value: string) => void
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
  createTimeStart,
  createTimeEnd,
  onOrderNoChange,
  onTeamIdChange,
  onUserIdChange,
  onPaymentChannelChange,
  onOrderTypeChange,
  onOrderStatusChange,
  onCreateTimeStartChange,
  onCreateTimeEndChange,
  onSearch,
  onReset,
}: OrderSearchProps) {
  return (
    <div className='space-y-3'>
      {/* 第一行：订单号、团队ID、用户ID、支付渠道 */}
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='订单号'
            value={orderNo}
            onChange={(e) => onOrderNoChange(e.target.value)}
            className='w-44 pl-10'
          />
        </div>

        <Input
          placeholder='团队ID'
          value={teamId}
          onChange={(e) => onTeamIdChange(e.target.value)}
          className='w-28'
        />

        <Input
          placeholder='用户ID'
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          className='w-28'
        />

        <Select value={paymentChannel} onValueChange={onPaymentChannelChange}>
          <SelectTrigger className='w-32'>
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
      </div>

      {/* 第二行：创建时间范围、操作按钮 */}
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>创建时间</span>
          <Input
            type='datetime-local'
            value={createTimeStart}
            onChange={(e) => onCreateTimeStartChange(e.target.value)}
            className='w-44'
          />
          <span className='text-muted-foreground'>-</span>
          <Input
            type='datetime-local'
            value={createTimeEnd}
            onChange={(e) => onCreateTimeEndChange(e.target.value)}
            className='w-44'
          />
        </div>

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
    </div>
  )
}
