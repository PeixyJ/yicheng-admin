import { useState } from 'react'
import { Check, Copy, Pencil, Trash2 } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { NotificationTemplateVO, NotificationParentType } from '@/types/notification-template'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-6 opacity-0 group-hover:opacity-100 transition-opacity'
      onClick={handleCopy}
    >
      {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
    </Button>
  )
}

interface TemplateTableProps {
  templates: NotificationTemplateVO[]
  loading: boolean
  onTemplateClick?: (templateId: number) => void
  onEdit?: (template: NotificationTemplateVO) => void
  onDelete?: (template: NotificationTemplateVO) => void
  onStatusChange?: (templateId: number, status: boolean) => void
}

function getParentTypeBadge(parentType: NotificationParentType) {
  switch (parentType) {
    case 'INBOX':
      return <Badge variant='default'>收件箱</Badge>
    case 'SYSTEM':
      return <Badge variant='secondary'>系统</Badge>
    default:
      return <Badge variant='outline'>{parentType}</Badge>
  }
}

export function TemplateTable({
  templates,
  loading,
  onTemplateClick,
  onEdit,
  onDelete,
  onStatusChange,
}: TemplateTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>模板编码</TableHead>
            <TableHead>模板名称</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>过期天数</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead className='w-24'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className='h-4 w-8' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-24' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-10' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-8 w-20' />
                </TableCell>
              </TableRow>
            ))
          ) : templates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className='font-medium'>
                  <div className='group flex items-center gap-1'>
                    <span>{template.id}</span>
                    <CopyButton text={String(template.id)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                      {template.code}
                    </code>
                    <CopyButton text={template.code} />
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className='cursor-pointer hover:text-primary transition-colors'
                    onClick={() => onTemplateClick?.(template.id)}
                  >
                    {template.name}
                  </span>
                </TableCell>
                <TableCell>{getParentTypeBadge(template.parentType)}</TableCell>
                <TableCell>
                  <span className='text-sm'>
                    {template.expireDays === 0 ? '永不过期' : `${template.expireDays} 天`}
                  </span>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={template.status}
                    onCheckedChange={(checked) => onStatusChange?.(template.id, checked)}
                  />
                </TableCell>
                <TableCell className='text-sm text-muted-foreground'>
                  {template.createTime}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='size-8'
                      onClick={() => onEdit?.(template)}
                    >
                      <Pencil className='size-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='size-8 text-destructive hover:text-destructive'
                      onClick={() => onDelete?.(template)}
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
