import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { getNotificationDetail } from '@/services/notification'
import type { NotificationDetailVO, ButtonExecutionVO } from '@/types/notification'
import dayjs from 'dayjs'

interface NotificationDetailSheetProps {
  notificationId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const parentTypeLabels: Record<string, string> = {
  INBOX: '收件箱',
  SYSTEM: '系统通知',
}

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  UNREAD: { label: '未读', variant: 'default' },
  READ: { label: '已读', variant: 'secondary' },
  ARCHIVED: { label: '已归档', variant: 'outline' },
}

const senderTypeLabels: Record<string, string> = {
  SYSTEM: '系统',
  USER: '用户',
}

const executionStatusConfig: Record<
  string,
  { label: string; variant: 'default' | 'destructive' }
> = {
  SUCCESS: { label: '成功', variant: 'default' },
  FAILED: { label: '失败', variant: 'destructive' },
}

interface NotificationButton {
  type: string
  label: string
  action?: string
  style?: string
  redirect_url?: string
}

interface NotificationParam {
  [key: string]: unknown
}

export function NotificationDetailSheet({
  notificationId,
  open,
  onOpenChange,
}: NotificationDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<NotificationDetailVO | null>(null)

  useEffect(() => {
    if (open && notificationId) {
      setLoading(true)
      getNotificationDetail(notificationId)
        .then((res) => {
          if (res.code === 'success') {
            setDetail(res.data)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [open, notificationId])

  const parseParams = (paramsStr: string | null): NotificationParam | null => {
    if (!paramsStr) return null
    try {
      return JSON.parse(paramsStr)
    } catch {
      return null
    }
  }

  const parseButtons = (buttonsStr: string | null): NotificationButton[] => {
    if (!buttonsStr) return []
    try {
      return JSON.parse(buttonsStr)
    } catch {
      return []
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[500px] overflow-y-auto sm:max-w-[500px]'>
        <SheetHeader>
          <SheetTitle>通知详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='mt-6 space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        ) : detail ? (
          <div className='mt-6 space-y-6'>
            {/* 基本信息 */}
            <div className='space-y-3'>
              <h3 className='text-sm font-medium'>基本信息</h3>
              <div className='grid grid-cols-2 gap-3 text-sm'>
                <div>
                  <span className='text-muted-foreground'>通知ID：</span>
                  <span className='font-mono'>{detail.id}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>用户ID：</span>
                  <span className='font-mono'>{detail.userId}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>团队ID：</span>
                  <span className='font-mono'>{detail.teamId}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>模板编码：</span>
                  <span className='font-mono'>{detail.templateCode}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>类型：</span>
                  <Badge variant='outline'>
                    {parentTypeLabels[detail.parentType] || detail.parentType}
                  </Badge>
                </div>
                <div>
                  <span className='text-muted-foreground'>状态：</span>
                  <Badge
                    variant={
                      statusConfig[detail.status]?.variant || 'secondary'
                    }
                  >
                    {statusConfig[detail.status]?.label || detail.status}
                  </Badge>
                </div>
                <div>
                  <span className='text-muted-foreground'>发送者类型：</span>
                  <span>
                    {senderTypeLabels[detail.senderType] || detail.senderType}
                  </span>
                </div>
                {detail.senderId && (
                  <div>
                    <span className='text-muted-foreground'>发送者ID：</span>
                    <span className='font-mono'>{detail.senderId}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* 通知内容 */}
            <div className='space-y-3'>
              <h3 className='text-sm font-medium'>通知内容</h3>
              <div className='space-y-2'>
                <div>
                  <span className='text-sm text-muted-foreground'>标题：</span>
                  <p className='text-sm font-medium'>{detail.title}</p>
                </div>
                <div>
                  <span className='text-sm text-muted-foreground'>内容：</span>
                  <p className='whitespace-pre-wrap text-sm'>{detail.content}</p>
                </div>
              </div>
            </div>

            {/* 参数信息 */}
            {detail.params && (
              <>
                <Separator />
                <div className='space-y-3'>
                  <h3 className='text-sm font-medium'>参数信息</h3>
                  <div className='rounded-md bg-muted p-3'>
                    <pre className='whitespace-pre-wrap text-xs'>
                      {JSON.stringify(parseParams(detail.params), null, 2)}
                    </pre>
                  </div>
                </div>
              </>
            )}

            {/* 按钮配置 */}
            {detail.buttons && parseButtons(detail.buttons).length > 0 && (
              <>
                <Separator />
                <div className='space-y-3'>
                  <h3 className='text-sm font-medium'>按钮配置</h3>
                  <div className='space-y-2'>
                    {parseButtons(detail.buttons).map((button, index) => (
                      <div
                        key={index}
                        className='rounded-md border p-3 text-sm'
                      >
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline'>{button.type}</Badge>
                          <span className='font-medium'>{button.label}</span>
                        </div>
                        {button.action && (
                          <div className='mt-1 text-muted-foreground'>
                            动作：{button.action}
                          </div>
                        )}
                        {button.redirect_url && (
                          <div className='mt-1 text-muted-foreground'>
                            跳转：{button.redirect_url}
                          </div>
                        )}
                        {button.style && (
                          <div className='mt-1 text-muted-foreground'>
                            样式：{button.style}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 按钮执行记录 */}
            {detail.buttonExecutions && detail.buttonExecutions.length > 0 && (
              <>
                <Separator />
                <div className='space-y-3'>
                  <h3 className='text-sm font-medium'>按钮执行记录</h3>
                  <div className='space-y-2'>
                    {detail.buttonExecutions.map((execution: ButtonExecutionVO) => {
                      const execStatusInfo =
                        executionStatusConfig[execution.executionStatus]
                      return (
                        <div
                          key={execution.id}
                          className='rounded-md border p-3 text-sm'
                        >
                          <div className='flex items-center justify-between'>
                            <span className='font-medium'>{execution.buttonKey}</span>
                            <Badge variant={execStatusInfo?.variant || 'secondary'}>
                              {execStatusInfo?.label || execution.executionStatus}
                            </Badge>
                          </div>
                          {execution.executionResult && (
                            <div className='mt-1 text-muted-foreground'>
                              结果：{execution.executionResult}
                            </div>
                          )}
                          {execution.errorMessage && (
                            <div className='mt-1 text-destructive'>
                              错误：{execution.errorMessage}
                            </div>
                          )}
                          <div className='mt-1 text-xs text-muted-foreground'>
                            执行时间：
                            {dayjs(execution.executedTime).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* 时间信息 */}
            <div className='space-y-3'>
              <h3 className='text-sm font-medium'>时间信息</h3>
              <div className='grid grid-cols-1 gap-2 text-sm'>
                <div>
                  <span className='text-muted-foreground'>创建时间：</span>
                  <span>
                    {dayjs(detail.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </div>
                {detail.readTime && (
                  <div>
                    <span className='text-muted-foreground'>阅读时间：</span>
                    <span>
                      {dayjs(detail.readTime).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>
                )}
                {detail.expireTime && (
                  <div>
                    <span className='text-muted-foreground'>过期时间：</span>
                    <span>
                      {dayjs(detail.expireTime).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className='mt-6 text-center text-muted-foreground'>
            无法加载通知详情
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
