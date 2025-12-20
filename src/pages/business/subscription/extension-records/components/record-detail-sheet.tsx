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
import { getExtensionRecordDetail } from '@/services/resource-pack'
import type { ResourceExtensionRecordVO, ResourceType, ExtensionSource, ExtensionStatus } from '@/types/resource-pack'

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

function InfoCard({ label, value, copyable }: { label: string; value: string | number | null | undefined; copyable?: boolean }) {
  return (
    <div className='rounded-lg border bg-card p-4'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <div className='mt-1 flex items-center gap-1'>
        <p className='text-sm font-medium'>{value ?? '-'}</p>
        {copyable && value && <CopyButton text={String(value)} />}
      </div>
    </div>
  )
}

function getResourceTypeBadge(type: ResourceType) {
  switch (type) {
    case 'PROJECT':
      return <Badge variant='default'>项目数</Badge>
    case 'MEMBER':
      return <Badge variant='secondary'>成员数</Badge>
    case 'STORAGE':
      return <Badge variant='outline'>存储空间</Badge>
    default:
      return <Badge variant='secondary'>{type}</Badge>
  }
}

function getSourceBadge(source: ExtensionSource) {
  switch (source) {
    case 'PURCHASE':
      return <Badge variant='outline'>购买</Badge>
    case 'GRANT':
      return <Badge variant='secondary'>赠送</Badge>
    default:
      return <Badge variant='secondary'>{source}</Badge>
  }
}

function getStatusBadge(status: ExtensionStatus) {
  switch (status) {
    case 'ACTIVE':
      return <Badge variant='default'>生效中</Badge>
    case 'EXPIRED':
      return <Badge variant='outline'>已过期</Badge>
    case 'REVOKED':
      return <Badge variant='destructive'>已撤销</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

interface RecordDetailSheetProps {
  recordId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecordDetailSheet({
  recordId,
  open,
  onOpenChange,
}: RecordDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [record, setRecord] = useState<ResourceExtensionRecordVO | null>(null)

  useEffect(() => {
    if (open && recordId) {
      loadRecordDetail()
    }
  }, [open, recordId])

  const loadRecordDetail = async () => {
    if (!recordId) return
    setLoading(true)
    try {
      const response = await getExtensionRecordDetail(recordId)
      if (response.code === 'success') {
        setRecord(response.data)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full max-w-xl overflow-y-auto p-0 sm:max-w-xl'>
        <SheetHeader className='border-b px-6 py-4'>
          <SheetTitle>扩展记录详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='p-6 space-y-6'>
            <div className='space-y-2'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-4 w-48' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='space-y-2'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-10 w-full' />
                </div>
              ))}
            </div>
          </div>
        ) : record ? (
          <>
            {/* Record Header */}
            <div className='border-b bg-muted/30 px-6 py-6'>
              <div className='flex items-start justify-between'>
                <div>
                  <div className='flex items-center gap-3'>
                    <h3 className='text-xl font-semibold tracking-tight'>
                      扩展记录 #{record.id}
                    </h3>
                    {getStatusBadge(record.status)}
                    {getSourceBadge(record.source)}
                  </div>
                  <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                    <span>ID: {record.id}</span>
                    <CopyButton text={String(record.id)} />
                  </div>
                </div>
              </div>
              <div className='mt-4 text-sm text-muted-foreground'>
                创建时间: {record.createTime}
              </div>
            </div>

            {/* Record Details */}
            <div className='p-6 space-y-6'>
              {/* 团队信息 */}
              <div>
                <h4 className='mb-4 text-sm font-semibold'>团队信息</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <InfoCard label='团队ID' value={record.teamId} copyable />
                  <InfoCard label='团队名称' value={record.teamName} />
                </div>
              </div>

              {/* 资源信息 */}
              <div>
                <h4 className='mb-4 text-sm font-semibold'>资源信息</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='rounded-lg border bg-card p-4'>
                    <p className='text-xs text-muted-foreground'>资源类型</p>
                    <div className='mt-1'>
                      {record.resourceTypeDesc || getResourceTypeBadge(record.resourceType)}
                    </div>
                  </div>
                  <InfoCard label='资源数量' value={record.amount} />
                  <InfoCard label='过期时间' value={record.expireTime || '永久'} />
                  <div className='rounded-lg border bg-card p-4'>
                    <p className='text-xs text-muted-foreground'>状态</p>
                    <div className='mt-1'>
                      {record.statusDesc || getStatusBadge(record.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 来源信息 */}
              <div>
                <h4 className='mb-4 text-sm font-semibold'>来源信息</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='rounded-lg border bg-card p-4'>
                    <p className='text-xs text-muted-foreground'>获取来源</p>
                    <div className='mt-1'>
                      {record.sourceDesc || getSourceBadge(record.source)}
                    </div>
                  </div>
                  {record.source === 'PURCHASE' ? (
                    <>
                      <InfoCard label='订单ID' value={record.orderId} copyable />
                      <InfoCard label='资源包ID' value={record.packId} copyable />
                      <InfoCard label='资源包名称' value={record.packName} />
                    </>
                  ) : (
                    <>
                      <InfoCard label='赠送人ID' value={record.grantUserId} copyable />
                      <InfoCard label='赠送人' value={record.grantUserName} />
                      <div className='col-span-2 rounded-lg border bg-card p-4'>
                        <p className='text-xs text-muted-foreground'>赠送原因</p>
                        <p className='mt-1 text-sm font-medium'>{record.grantReason || '-'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 关联资源包 (如果是赠送且关联了资源包) */}
              {record.source === 'GRANT' && record.packId && (
                <div>
                  <h4 className='mb-4 text-sm font-semibold'>关联资源包</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <InfoCard label='资源包ID' value={record.packId} copyable />
                    <InfoCard label='资源包名称' value={record.packName} />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
