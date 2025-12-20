import { useState, useEffect } from 'react'
import {
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Flag,
  Globe,
  Mail,
  MessageSquare,
  Monitor,
  Phone,
  User,
  UserCheck,
  XCircle,
} from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  getFeedbackDetail,
  assignFeedback,
  resolveFeedback,
  closeFeedback,
  setFeedbackPriority,
} from '@/services/feedback'
import type {
  AdminFeedbackDetailVO,
  FeedbackStatus,
  FeedbackType,
  FeedbackPriority,
} from '@/types/feedback'

interface FeedbackDetailSheetProps {
  feedbackId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onFeedbackUpdated?: () => void
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

function InfoItem({ icon: Icon, label, value, copyable = false }: {
  icon: React.ElementType
  label: string
  value: string | number | null | undefined
  copyable?: boolean
}) {
  return (
    <div className='flex items-start gap-3'>
      <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted'>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-xs text-muted-foreground'>{label}</p>
        <div className='flex items-center gap-1'>
          <p className='text-sm font-medium truncate'>{value ?? '-'}</p>
          {copyable && value && <CopyButton text={String(value)} />}
        </div>
      </div>
    </div>
  )
}

function getStatusBadge(status: FeedbackStatus) {
  switch (status) {
    case 'PENDING':
      return <Badge variant='secondary'>待处理</Badge>
    case 'PROCESSING':
      return <Badge variant='default'>处理中</Badge>
    case 'RESOLVED':
      return <Badge className='bg-green-500 hover:bg-green-600'>已解决</Badge>
    case 'CLOSED':
      return <Badge variant='outline'>已关闭</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

function getFeedbackTypeBadge(type: FeedbackType) {
  switch (type) {
    case 'BUG':
      return <Badge variant='destructive'>Bug</Badge>
    case 'FEATURE':
      return <Badge className='bg-blue-500 hover:bg-blue-600'>功能建议</Badge>
    case 'COMPLAINT':
      return <Badge className='bg-orange-500 hover:bg-orange-600'>投诉</Badge>
    case 'QUESTION':
      return <Badge variant='secondary'>咨询</Badge>
    case 'OTHER':
      return <Badge variant='outline'>其他</Badge>
    default:
      return <Badge variant='outline'>{type}</Badge>
  }
}

function getPriorityBadge(priority: FeedbackPriority) {
  switch (priority) {
    case 'LOW':
      return <Badge variant='outline'>低</Badge>
    case 'NORMAL':
      return <Badge variant='secondary'>普通</Badge>
    case 'HIGH':
      return <Badge className='bg-orange-500 hover:bg-orange-600'>高</Badge>
    case 'URGENT':
      return <Badge variant='destructive'>紧急</Badge>
    default:
      return <Badge variant='outline'>{priority}</Badge>
  }
}

export function FeedbackDetailSheet({
  feedbackId,
  open,
  onOpenChange,
  onFeedbackUpdated,
}: FeedbackDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<AdminFeedbackDetailVO | null>(null)

  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false)
  const [handleResult, setHandleResult] = useState('')
  const [closeReason, setCloseReason] = useState('')
  const [newPriority, setNewPriority] = useState<FeedbackPriority>('NORMAL')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open && feedbackId) {
      loadFeedbackDetail()
    }
  }, [open, feedbackId])

  const loadFeedbackDetail = async () => {
    if (!feedbackId) return
    setLoading(true)
    try {
      const response = await getFeedbackDetail(feedbackId)
      if (response.code === 'success') {
        setFeedback(response.data)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!feedbackId) return
    setSubmitting(true)
    try {
      const response = await assignFeedback(feedbackId)
      if (response.code === 'success') {
        loadFeedbackDetail()
        onFeedbackUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleResolve = async () => {
    if (!feedbackId || !handleResult.trim()) return
    setSubmitting(true)
    try {
      const response = await resolveFeedback(feedbackId, { handleResult })
      if (response.code === 'success') {
        setResolveDialogOpen(false)
        setHandleResult('')
        loadFeedbackDetail()
        onFeedbackUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = async () => {
    if (!feedbackId) return
    setSubmitting(true)
    try {
      const response = await closeFeedback(feedbackId, closeReason ? { reason: closeReason } : undefined)
      if (response.code === 'success') {
        setCloseDialogOpen(false)
        setCloseReason('')
        loadFeedbackDetail()
        onFeedbackUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleSetPriority = async () => {
    if (!feedbackId) return
    setSubmitting(true)
    try {
      const response = await setFeedbackPriority(feedbackId, { priority: newPriority })
      if (response.code === 'success') {
        setPriorityDialogOpen(false)
        loadFeedbackDetail()
        onFeedbackUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const openPriorityDialog = () => {
    if (feedback) {
      setNewPriority(feedback.priority)
    }
    setPriorityDialogOpen(true)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='w-full max-w-2xl overflow-y-auto p-0 sm:max-w-2xl'>
          <SheetHeader className='border-b px-6 py-4'>
            <SheetTitle>反馈详情</SheetTitle>
          </SheetHeader>

          {loading ? (
            <div className='p-6 space-y-6'>
              <div className='space-y-2'>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </div>
              <div className='space-y-4'>
                <Skeleton className='h-24 w-full' />
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
              </div>
            </div>
          ) : feedback ? (
            <>
              {/* Header */}
              <div className='border-b bg-muted/30 px-6 py-6'>
                <div className='flex items-start gap-3 flex-wrap'>
                  {getFeedbackTypeBadge(feedback.feedbackType)}
                  {getStatusBadge(feedback.status)}
                  {getPriorityBadge(feedback.priority)}
                </div>
                <h3 className='mt-3 text-xl font-semibold tracking-tight'>{feedback.title}</h3>
                <div className='mt-2 flex items-center gap-2 text-sm text-muted-foreground'>
                  <span>ID: {feedback.id}</span>
                  <CopyButton text={String(feedback.id)} />
                  <span>·</span>
                  <span>{feedback.createTime}</span>
                </div>

                {/* Action Buttons */}
                <div className='mt-5 flex flex-wrap gap-3'>
                  {feedback.status === 'PENDING' && (
                    <Button
                      variant='default'
                      onClick={handleAssign}
                      disabled={submitting}
                    >
                      <UserCheck className='mr-2 h-4 w-4' />
                      领取反馈
                    </Button>
                  )}
                  {(feedback.status === 'PENDING' || feedback.status === 'PROCESSING') && (
                    <>
                      <Button
                        variant='outline'
                        className='border-green-500 text-green-600 hover:bg-green-50'
                        onClick={() => setResolveDialogOpen(true)}
                      >
                        <CheckCircle className='mr-2 h-4 w-4' />
                        处理反馈
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => setCloseDialogOpen(true)}
                      >
                        <XCircle className='mr-2 h-4 w-4' />
                        关闭反馈
                      </Button>
                    </>
                  )}
                  {feedback.status !== 'CLOSED' && (
                    <Button
                      variant='outline'
                      onClick={openPriorityDialog}
                    >
                      <Flag className='mr-2 h-4 w-4' />
                      设置优先级
                    </Button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className='p-6 space-y-6'>
                {/* Feedback Content */}
                <div>
                  <h4 className='mb-3 text-sm font-semibold flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4' />
                    反馈内容
                  </h4>
                  <div className='rounded-lg border bg-card p-4'>
                    <p className='text-sm whitespace-pre-wrap'>{feedback.content}</p>
                  </div>
                </div>

                {/* Images */}
                {feedback.images && feedback.images.length > 0 && (
                  <div>
                    <h4 className='mb-3 text-sm font-semibold'>附件图片</h4>
                    <div className='grid grid-cols-3 gap-3'>
                      {feedback.images.map((image, index) => (
                        <a
                          key={index}
                          href={image}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='group relative aspect-square overflow-hidden rounded-lg border'
                        >
                          <img
                            src={image}
                            alt={`附件 ${index + 1}`}
                            className='h-full w-full object-cover transition-transform group-hover:scale-105'
                          />
                          <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <ExternalLink className='h-6 w-6 text-white' />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Handle Result */}
                {feedback.handleResult && (
                  <div>
                    <h4 className='mb-3 text-sm font-semibold flex items-center gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500' />
                      处理结果
                    </h4>
                    <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                      <p className='text-sm whitespace-pre-wrap'>{feedback.handleResult}</p>
                    </div>
                  </div>
                )}

                {/* User Info */}
                <div>
                  <h4 className='mb-4 text-sm font-semibold'>用户信息</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <InfoItem
                      icon={User}
                      label='用户昵称'
                      value={feedback.userNickname}
                    />
                    <InfoItem
                      icon={User}
                      label='用户ID'
                      value={feedback.userId}
                      copyable
                    />
                    <InfoItem
                      icon={Mail}
                      label='联系邮箱'
                      value={feedback.contactEmail}
                      copyable
                    />
                    <InfoItem
                      icon={Phone}
                      label='联系电话'
                      value={feedback.contactPhone}
                      copyable
                    />
                  </div>
                </div>

                {/* Handler Info */}
                {feedback.handlerId && (
                  <div>
                    <h4 className='mb-4 text-sm font-semibold'>处理信息</h4>
                    <div className='grid grid-cols-2 gap-4'>
                      <InfoItem
                        icon={UserCheck}
                        label='处理人'
                        value={feedback.handlerNickname}
                      />
                      <InfoItem
                        icon={Clock}
                        label='处理时间'
                        value={feedback.handleTime}
                      />
                    </div>
                  </div>
                )}

                {/* Technical Info */}
                <div>
                  <h4 className='mb-4 text-sm font-semibold'>技术信息</h4>
                  <div className='grid grid-cols-1 gap-4'>
                    <InfoItem
                      icon={Globe}
                      label='客户端IP'
                      value={feedback.clientIp}
                      copyable
                    />
                    <InfoItem
                      icon={ExternalLink}
                      label='反馈页面'
                      value={feedback.pageUrl}
                      copyable
                    />
                    <InfoItem
                      icon={Monitor}
                      label='User-Agent'
                      value={feedback.userAgent}
                      copyable
                    />
                  </div>
                </div>

                {/* Time Info */}
                <div>
                  <h4 className='mb-4 text-sm font-semibold'>时间信息</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <InfoItem
                      icon={Calendar}
                      label='创建时间'
                      value={feedback.createTime}
                    />
                    <InfoItem
                      icon={Calendar}
                      label='更新时间'
                      value={feedback.updateTime}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                <CheckCircle className='h-5 w-5 text-green-600' />
              </div>
              处理反馈
            </DialogTitle>
            <DialogDescription>请填写处理结果，将反馈标记为已解决</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>处理结果 <span className='text-destructive'>*</span></Label>
              <Textarea
                className='mt-1.5'
                placeholder='请输入处理结果说明...'
                rows={4}
                value={handleResult}
                onChange={(e) => setHandleResult(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setResolveDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleResolve}
              disabled={!handleResult.trim() || submitting}
              className='bg-green-600 hover:bg-green-700'
            >
              确认处理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                <XCircle className='h-5 w-5 text-muted-foreground' />
              </div>
              关闭反馈
            </DialogTitle>
            <DialogDescription>关闭后反馈将不再处理</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>关闭原因（可选）</Label>
              <Textarea
                className='mt-1.5'
                placeholder='请输入关闭原因...'
                rows={3}
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCloseDialogOpen(false)}>
              取消
            </Button>
            <Button
              variant='secondary'
              onClick={handleClose}
              disabled={submitting}
            >
              确认关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Priority Dialog */}
      <Dialog open={priorityDialogOpen} onOpenChange={setPriorityDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                <Flag className='h-5 w-5 text-primary' />
              </div>
              设置优先级
            </DialogTitle>
            <DialogDescription>调整反馈的处理优先级</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>优先级</Label>
              <Select value={newPriority} onValueChange={(v) => setNewPriority(v as FeedbackPriority)}>
                <SelectTrigger className='mt-1.5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='LOW'>低</SelectItem>
                  <SelectItem value='NORMAL'>普通</SelectItem>
                  <SelectItem value='HIGH'>高</SelectItem>
                  <SelectItem value='URGENT'>紧急</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setPriorityDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleSetPriority}
              disabled={submitting}
            >
              确认设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
