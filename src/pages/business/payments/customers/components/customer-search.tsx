import { RotateCcw, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CustomerSearchProps {
  teamId: string
  userId: string
  stripeCustomerId: string
  email: string
  name: string
  onTeamIdChange: (value: string) => void
  onUserIdChange: (value: string) => void
  onStripeCustomerIdChange: (value: string) => void
  onEmailChange: (value: string) => void
  onNameChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export function CustomerSearch({
  teamId,
  userId,
  stripeCustomerId,
  email,
  name,
  onTeamIdChange,
  onUserIdChange,
  onStripeCustomerIdChange,
  onEmailChange,
  onNameChange,
  onSearch,
  onReset,
}: CustomerSearchProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
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

        <Input
          placeholder='Stripe客户ID'
          value={stripeCustomerId}
          onChange={(e) => onStripeCustomerIdChange(e.target.value)}
          className='w-48'
        />

        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input
            placeholder='邮箱'
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className='w-44 pl-10'
          />
        </div>

        <Input
          placeholder='名称'
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className='w-32'
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
  )
}
