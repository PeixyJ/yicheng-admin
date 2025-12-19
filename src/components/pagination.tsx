import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  pageSizeOptions?: number[]
  onChange: (page: number, pageSize: number) => void
}

export function Pagination({
  current,
  total,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChange(page, pageSize)
    }
  }

  const handlePageSizeChange = (value: string) => {
    onChange(1, Number(value))
  }

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-muted-foreground text-sm'>
        共 {total} 条
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm'>每页</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className='text-sm'>条</span>
        </div>
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => handlePageChange(1)}
            disabled={current === 1}
          >
            <ChevronsLeft className='size-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => handlePageChange(current - 1)}
            disabled={current === 1}
          >
            <ChevronLeft className='size-4' />
          </Button>
          <span className='text-sm px-2'>
            {current} / {totalPages || 1}
          </span>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => handlePageChange(current + 1)}
            disabled={current >= totalPages}
          >
            <ChevronRight className='size-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => handlePageChange(totalPages)}
            disabled={current >= totalPages}
          >
            <ChevronsRight className='size-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
