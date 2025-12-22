'use client'

import { useState, useEffect, useId } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateTimePickerProps {
  value?: string // datetime string (yyyy-MM-dd HH:mm:ss)
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = '选择日期时间',
  disabled = false,
  minDate,
  className,
}: DateTimePickerProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState('00:00')

  // 从 value 初始化 date 和 time
  useEffect(() => {
    if (value) {
      // 支持两种格式: "yyyy-MM-dd HH:mm:ss" 和 "yyyy-MM-ddTHH:mm"
      const separator = value.includes('T') ? 'T' : ' '
      const [datePart, timePart] = value.split(separator)
      if (datePart) {
        setDate(new Date(datePart))
      }
      if (timePart) {
        setTime(timePart.slice(0, 5)) // HH:mm
      }
    } else {
      setDate(undefined)
      setTime('00:00')
    }
  }, [value])

  // 当 date 或 time 变化时，通知父组件
  const updateValue = (newDate: Date | undefined, newTime: string) => {
    if (newDate && onChange) {
      const year = newDate.getFullYear()
      const month = String(newDate.getMonth() + 1).padStart(2, '0')
      const day = String(newDate.getDate()).padStart(2, '0')
      // 输出格式: yyyy-MM-dd HH:mm:ss
      const formattedValue = `${year}-${month}-${day} ${newTime}:00`
      onChange(formattedValue)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setOpen(false)
    updateValue(selectedDate, time)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    updateValue(date, newTime)
  }

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id={`date-${id}`}
            disabled={disabled}
            className={cn(
              'flex-1 justify-between font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            {date ? formatDate(date) : placeholder}
            <ChevronDownIcon className='size-4 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={handleDateSelect}
            disabled={minDate ? { before: minDate } : undefined}
          />
        </PopoverContent>
      </Popover>
      <Input
        type='time'
        id={`time-${id}`}
        value={time}
        onChange={handleTimeChange}
        disabled={disabled}
        className='w-24 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
      />
    </div>
  )
}
