'use client'

import { MinusIcon, PlusIcon } from 'lucide-react'
import { Button, Group, Input, NumberField } from 'react-aria-components'
import { cn } from '@/lib/utils'

interface NumberInputProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number | undefined) => void
  minValue?: number
  maxValue?: number
  step?: number
  placeholder?: string
  disabled?: boolean
  className?: string
  allowEmpty?: boolean
}

export function NumberInput({
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  step = 1,
  placeholder,
  disabled,
  className,
  allowEmpty = true,
}: NumberInputProps) {
  const handleChange = (val: number) => {
    if (allowEmpty && isNaN(val)) {
      onChange?.(undefined)
    } else {
      onChange?.(val)
    }
  }

  return (
    <NumberField
      value={value ?? NaN}
      defaultValue={defaultValue}
      onChange={handleChange}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      isDisabled={disabled}
      className={cn('w-full', className)}
    >
      <Group className='border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-[3px] md:text-sm'>
        <Button
          slot='decrement'
          className='border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
        >
          <MinusIcon className='size-4' />
          <span className='sr-only'>Decrement</span>
        </Button>
        <Input
          placeholder={placeholder}
          className='selection:bg-primary selection:text-primary-foreground w-full grow px-3 py-2 text-center tabular-nums outline-none bg-transparent'
        />
        <Button
          slot='increment'
          className='border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-md border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
        >
          <PlusIcon className='size-4' />
          <span className='sr-only'>Increment</span>
        </Button>
      </Group>
    </NumberField>
  )
}
