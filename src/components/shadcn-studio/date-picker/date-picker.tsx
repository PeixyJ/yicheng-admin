'use client'

import { useState, useEffect } from 'react'

import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function DatePicker({ value, onChange, placeholder = '选择日期', disabled }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState('00:00:00')

  useEffect(() => {
    if (value) {
      const hours = String(value.getHours()).padStart(2, '0')
      const minutes = String(value.getMinutes()).padStart(2, '0')
      const seconds = String(value.getSeconds()).padStart(2, '0')
      setTime(`${hours}:${minutes}:${seconds}`)
    }
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const [hours, minutes, seconds] = time.split(':').map(Number)
      date.setHours(hours || 0, minutes || 0, seconds || 0)
      onChange?.(date)
      setOpen(false)
    } else {
      onChange?.(undefined)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (value) {
      const [hours, minutes, seconds] = newTime.split(':').map(Number)
      const newDate = new Date(value)
      newDate.setHours(hours || 0, minutes || 0, seconds || 0)
      onChange?.(newDate)
    }
  }

  return (
    <div className='flex gap-2'>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='flex-1 justify-between font-normal'
            disabled={disabled}
          >
            {value ? formatDate(value) : placeholder}
            <ChevronDownIcon className='h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='z-[100] w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='single'
            selected={value}
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
      <Input
        type='time'
        step='1'
        value={time}
        onChange={(e) => handleTimeChange(e.target.value)}
        disabled={disabled}
        className='w-32 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
      />
    </div>
  )
}
