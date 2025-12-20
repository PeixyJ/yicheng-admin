import { useState, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getTemplateDetail } from '@/services/notification-template'
import type {
  NotificationTemplateVO,
  NotificationParentType,
  NotificationParam,
  NotificationButton,
} from '@/types/notification-template'

interface TemplateDetailSheetProps {
  templateId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-6 text-muted-foreground hover:text-foreground'
      onClick={handleCopy}
    >
      {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
    </Button>
  )
}

function InfoCard({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className='rounded-lg border bg-card p-4'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className='mt-1 text-sm font-medium'>{value ?? '-'}</p>
    </div>
  )
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

function parseJSON<T>(jsonString: string | null | undefined): T[] {
  if (!jsonString) return []
  try {
    return JSON.parse(jsonString)
  } catch {
    return []
  }
}

export function TemplateDetailSheet({ templateId, open, onOpenChange }: TemplateDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState<NotificationTemplateVO | null>(null)

  useEffect(() => {
    if (open && templateId) {
      loadTemplateDetail()
    }
  }, [open, templateId])

  const loadTemplateDetail = async () => {
    if (!templateId) return
    setLoading(true)
    try {
      const response = await getTemplateDetail(templateId)
      if (response.code === 'success') {
        setTemplate(response.data)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const params = template ? parseJSON<NotificationParam>(template.params) : []
  const buttons = template ? parseJSON<NotificationButton>(template.buttons) : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full max-w-2xl overflow-y-auto p-0 sm:max-w-2xl'>
        <SheetHeader className='border-b px-6 py-4'>
          <SheetTitle>模板详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='p-6 space-y-6'>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-48' />
              <Skeleton className='h-4 w-32' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-20 w-full' />
              ))}
            </div>
          </div>
        ) : template ? (
          <>
            {/* Header */}
            <div className='border-b bg-muted/30 px-6 py-6'>
              <div className='flex items-start justify-between'>
                <div>
                  <div className='flex items-center gap-3'>
                    <code className='rounded bg-background px-2 py-1 text-lg font-semibold'>
                      {template.code}
                    </code>
                    <CopyButton text={template.code} />
                  </div>
                  <p className='mt-2 text-lg'>{template.name}</p>
                  <div className='mt-2 flex items-center gap-2'>
                    {getParentTypeBadge(template.parentType)}
                    <Badge variant={template.status ? 'default' : 'secondary'}>
                      {template.status ? '已启用' : '已禁用'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className='p-6 space-y-6'>
              {/* 基本信息 */}
              <div>
                <h4 className='mb-4 text-sm font-semibold'>基本信息</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <InfoCard
                    label='过期天数'
                    value={template.expireDays === 0 ? '永不过期' : `${template.expireDays} 天`}
                  />
                  <InfoCard label='创建时间' value={template.createTime} />
                  <InfoCard label='更新时间' value={template.updateTime} />
                </div>
              </div>

              <Separator />

              {/* 模板内容 */}
              <div>
                <h4 className='mb-4 text-sm font-semibold'>标题模板</h4>
                <div className='rounded-lg border bg-muted/50 p-4'>
                  <pre className='text-sm whitespace-pre-wrap break-all'>
                    {template.titleTemplate || '-'}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className='mb-4 text-sm font-semibold'>内容模板</h4>
                <div className='rounded-lg border bg-muted/50 p-4'>
                  <pre className='text-sm whitespace-pre-wrap break-all'>
                    {template.contentTemplate || '-'}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* 参数定义 */}
              <div>
                <h4 className='mb-4 text-sm font-semibold'>参数定义</h4>
                {params.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>暂无参数定义</p>
                ) : (
                  <div className='rounded-lg border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>参数名</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>是否必填</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {params.map((param, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                                {param.name}
                              </code>
                            </TableCell>
                            <TableCell>{param.type}</TableCell>
                            <TableCell>
                              <Badge variant={param.required ? 'default' : 'outline'}>
                                {param.required ? '是' : '否'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <Separator />

              {/* 按钮配置 */}
              <div>
                <h4 className='mb-4 text-sm font-semibold'>按钮配置</h4>
                {buttons.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>暂无按钮配置</p>
                ) : (
                  <div className='space-y-3'>
                    {buttons.map((button, index) => (
                      <div key={index} className='rounded-lg border bg-card p-4'>
                        <div className='flex items-center gap-2'>
                          <Badge variant={button.type === 'REDIRECT' ? 'default' : 'secondary'}>
                            {button.type === 'REDIRECT' ? '跳转' : '功能'}
                          </Badge>
                          <span className='font-medium'>{button.label}</span>
                        </div>
                        <div className='mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground'>
                          <div>
                            <span className='text-xs'>动作: </span>
                            <code className='rounded bg-muted px-1 py-0.5 text-xs'>
                              {button.action}
                            </code>
                          </div>
                          {button.style && (
                            <div>
                              <span className='text-xs'>样式: </span>
                              <span>{button.style}</span>
                            </div>
                          )}
                          {button.redirect_url && (
                            <div className='col-span-2'>
                              <span className='text-xs'>跳转链接: </span>
                              <span className='break-all'>{button.redirect_url}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
