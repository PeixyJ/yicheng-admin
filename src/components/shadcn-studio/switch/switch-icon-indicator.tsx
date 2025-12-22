'use client'

import { CheckIcon, XIcon } from 'lucide-react'

import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface SwitchIconIndicatorProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

export function SwitchIconIndicator({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: SwitchIconIndicatorProps) {
  return (
    <div className={cn('relative inline-grid h-7 grid-cols-[1fr_1fr] items-center text-sm font-medium', className)}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className='peer data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 [&_span]:!bg-background absolute inset-0 h-[inherit] w-14 [&_span]:size-6.5 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-7 [&_span]:data-[state=checked]:rtl:-translate-x-7'
        aria-label={ariaLabel}
      />
      <span className='peer-data-[state=checked]:text-muted-foreground/70 pointer-events-none relative ml-1.75 flex min-w-7 items-center text-center'>
        <CheckIcon className='size-4' aria-hidden='true' />
      </span>
      <span className='peer-data-[state=unchecked]:text-muted-foreground/70 pointer-events-none relative -ms-0.25 flex min-w-7 items-center text-center'>
        <XIcon className='size-4' aria-hidden='true' />
      </span>
    </div>
  )
}
