import { useState, useEffect } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'
import dayjs from 'dayjs'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { getPaymentEventDetail } from '@/services/payment-event'
import type { AdminPaymentEventVO, EventProcessStatus } from '@/types/payment-event'

function CopyableField({ label, value }: { label: string; value: string | number | null }) {
  const [copied, setCopied] = useState(false)

  if (!value) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(value))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className='group flex items-center justify-between py-2'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='flex items-center gap-2'>
        <span className='font-medium font-mono text-sm'>{value}</span>
        <Button
          variant='ghost'
          size='icon'
          className='size-6 opacity-0 group-hover:opacity-100 transition-opacity'
          onClick={handleCopy}
        >
          {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
        </Button>
      </div>
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex items-center justify-between py-2'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='font-medium'>{children}</div>
    </div>
  )
}

const STATUS_CONFIG: Record<EventProcessStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: '待处理', variant: 'secondary' },
  PROCESSING: { label: '处理中', variant: 'default' },
  SUCCESS: { label: '成功', variant: 'default' },
  FAILED: { label: '失败', variant: 'destructive' },
  SKIPPED: { label: '已跳过', variant: 'outline' },
  PERMANENTLY_FAILED: { label: '永久失败', variant: 'destructive' },
}

interface EventDetailSheetProps {
  eventId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRetry?: (eventId: number) => void
}

export function EventDetailSheet({
  eventId,
  open,
  onOpenChange,
  onRetry,
}: EventDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<AdminPaymentEventVO | null>(null)
  const [payloadCopied, setPayloadCopied] = useState(false)

  useEffect(() => {
    if (open && eventId) {
      fetchEventDetail()
    }
  }, [open, eventId])

  const fetchEventDetail = async () => {
    if (!eventId) return
    setLoading(true)
    try {
      const res = await getPaymentEventDetail(eventId)
      if (res.code === 'success') {
        setEvent(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch event detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPayload = async () => {
    if (!event?.payload) return
    await navigator.clipboard.writeText(event.payload)
    setPayloadCopied(true)
    setTimeout(() => setPayloadCopied(false), 1500)
  }

  const formatPayload = (payload: string) => {
    try {
      return JSON.stringify(JSON.parse(payload), null, 2)
    } catch {
      return payload
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[640px] sm:max-w-[640px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>事件详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='mt-6 space-y-6'>
            <div className='space-y-3'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-32 w-full' />
            </div>
          </div>
        ) : event ? (
          <Tabs defaultValue='info' className='mt-6'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='info'>基本信息</TabsTrigger>
              <TabsTrigger value='payload'>事件数据</TabsTrigger>
            </TabsList>

            <TabsContent value='info' className='mt-4 space-y-6'>
              {/* 基本信息 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>基本信息</h3>
                <div className='rounded-lg border p-4'>
                  <CopyableField label='ID' value={event.id} />
                  <Separator />
                  <CopyableField label='Stripe事件ID' value={event.stripeEventId} />
                  <Separator />
                  <InfoRow label='事件类型'>
                    <span className='font-mono text-sm'>{event.eventType}</span>
                  </InfoRow>
                  <Separator />
                  <InfoRow label='API版本'>
                    <span className='font-mono text-sm'>{event.apiVersion}</span>
                  </InfoRow>
                </div>
              </div>

              {/* 处理状态 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>处理状态</h3>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='状态'>
                    <Badge variant={STATUS_CONFIG[event.processStatus]?.variant || 'outline'}>
                      {STATUS_CONFIG[event.processStatus]?.label || event.processStatusDesc}
                    </Badge>
                  </InfoRow>
                  <Separator />
                  <InfoRow label='重试次数'>
                    <span className='font-medium'>{event.retryCount}</span>
                  </InfoRow>
                  {event.processMessage && (
                    <>
                      <Separator />
                      <div className='py-2'>
                        <span className='text-sm text-muted-foreground block mb-1'>处理消息</span>
                        <p className='text-sm bg-muted p-2 rounded'>{event.processMessage}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 时间信息 */}
              <div>
                <h3 className='text-sm font-semibold mb-2'>时间信息</h3>
                <div className='rounded-lg border p-4'>
                  <InfoRow label='创建时间'>
                    {dayjs(event.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </InfoRow>
                  <Separator />
                  <InfoRow label='处理时间'>
                    {event.processTime ? dayjs(event.processTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                  </InfoRow>
                </div>
              </div>

              {/* 重试按钮 */}
              {event.canRetry && (
                <div className='pt-2'>
                  <Button
                    onClick={() => onRetry?.(event.id)}
                    className='w-full'
                  >
                    <RefreshCw className='mr-2 size-4' />
                    重试处理
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value='payload' className='mt-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold'>事件数据 (JSON)</h3>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleCopyPayload}
                >
                  {payloadCopied ? (
                    <>
                      <Check className='mr-2 size-3.5' />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className='mr-2 size-3.5' />
                      复制
                    </>
                  )}
                </Button>
              </div>
              <div className='rounded-lg border bg-muted p-4'>
                <pre className='text-xs overflow-x-auto whitespace-pre-wrap font-mono'>
                  {formatPayload(event.payload)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className='mt-6 flex items-center justify-center h-32 text-muted-foreground'>
            事件信息加载失败
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
