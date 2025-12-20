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

        {/* 模板ID */}
        <Input
          placeholder='模板ID'
          value={templateId}
          onChange={(e) => onTemplateIdChange(e.target.value)}
          className='w-24'
        />

        {/* 团队ID */}
        <Input
          placeholder='团队ID'
          value={teamId}
          onChange={(e) => onTeamIdChange(e.target.value)}
          className='w-24'
        />

        {/* 用户ID */}
        <Input
          placeholder='用户ID'
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          className='w-24'
        />

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
