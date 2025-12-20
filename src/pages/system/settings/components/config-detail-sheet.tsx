import { useState, useEffect } from 'react'
import {
  Calendar,
  Check,
  Copy,
  History,
  Lock,
  LockOpen,
  Pencil,
  Save,
  Settings,
  Trash2,
} from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import {
  getSystemConfigDetail,
  getSystemConfigLogs,
  updateSystemConfig,
  deleteSystemConfig,
} from '@/services/system-config'
import type {
  SystemConfigDetailVO,
  SystemConfigLogVO,
} from '@/types/system-config'

interface ConfigDetailSheetProps {
  configId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfigUpdated?: () => void
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

function InfoCard({ label, value, copyable = false }: { label: string; value: string | number | null | undefined; copyable?: boolean }) {
  return (
    <div className='rounded-lg border bg-card p-4'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <div className='mt-1 flex items-center gap-1'>
        <p className='text-sm font-medium break-all'>{value ?? '-'}</p>
        {copyable && value && <CopyButton text={String(value)} />}
      </div>
    </div>
  )
}

function getValueTypeBadge(valueType: string, valueTypeDesc: string) {
  switch (valueType) {
    case 'STRING':
      return <Badge variant='outline'>{valueTypeDesc}</Badge>
    case 'NUMBER':
      return <Badge variant='secondary'>{valueTypeDesc}</Badge>
    case 'BOOLEAN':
      return <Badge variant='default'>{valueTypeDesc}</Badge>
    case 'JSON':
      return <Badge variant='default' className='bg-purple-600 hover:bg-purple-700'>{valueTypeDesc}</Badge>
    case 'TEXT':
      return <Badge variant='outline'>{valueTypeDesc}</Badge>
    default:
      return <Badge variant='outline'>{valueTypeDesc}</Badge>
  }
}

function getGroupBadge(configGroup: string, configGroupDesc: string) {
  switch (configGroup) {
    case 'SYSTEM':
      return <Badge variant='default'>{configGroupDesc}</Badge>
    case 'BUSINESS':
      return <Badge variant='secondary'>{configGroupDesc}</Badge>
    case 'SECURITY':
      return <Badge variant='destructive'>{configGroupDesc}</Badge>
    case 'NOTIFICATION':
      return <Badge variant='outline'>{configGroupDesc}</Badge>
    case 'PAYMENT':
      return <Badge variant='default' className='bg-green-600 hover:bg-green-700'>{configGroupDesc}</Badge>
    case 'FEATURE':
      return <Badge variant='secondary'>{configGroupDesc}</Badge>
    default:
      return <Badge variant='outline'>{configGroupDesc}</Badge>
  }
}

function getActionBadge(action: string, actionDesc: string) {
  switch (action) {
    case 'CREATE':
      return <Badge variant='default' className='bg-green-600 hover:bg-green-700'>{actionDesc}</Badge>
    case 'UPDATE':
      return <Badge variant='default' className='bg-blue-600 hover:bg-blue-700'>{actionDesc}</Badge>
    case 'DELETE':
      return <Badge variant='destructive'>{actionDesc}</Badge>
    default:
      return <Badge variant='secondary'>{actionDesc}</Badge>
  }
}

export function ConfigDetailSheet({ configId, open, onOpenChange, onConfigUpdated }: ConfigDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState<SystemConfigDetailVO | null>(null)
  const [logs, setLogs] = useState<SystemConfigLogVO[]>([])
  const [activeTab, setActiveTab] = useState('info')

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [editValue, setEditValue] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [changeReason, setChangeReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open && configId) {
      loadConfigDetail()
    }
  }, [open, configId])

  useEffect(() => {
    if (open && configId && activeTab === 'logs') {
      loadConfigLogs()
    }
  }, [activeTab, open, configId])

  const loadConfigDetail = async () => {
    if (!configId) return
    setLoading(true)
    try {
      const response = await getSystemConfigDetail(configId)
      if (response.code === 'success') {
        setConfig(response.data)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const loadConfigLogs = async () => {
    if (!configId) return
    try {
      const response = await getSystemConfigLogs(configId, { page: 1, size: 20 })
      if (response.code === 'success') {
        setLogs(response.data.records)
      }
    } catch {
      // Error handled by interceptor
    }
  }

  const handleUpdate = async () => {
    if (!configId || !config) return
    setSubmitting(true)
    try {
      const response = await updateSystemConfig(
        configId,
        {
          configValue: editValue,
          description: editDescription.trim() || undefined,
          dataVersion: config.dataVersion,
        },
        changeReason.trim() || undefined
      )
      if (response.code === 'success') {
        setEditDialogOpen(false)
        setChangeReason('')
        loadConfigDetail()
        onConfigUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!configId) return
    setSubmitting(true)
    try {
      const response = await deleteSystemConfig(configId)
      if (response.code === 'success') {
        setDeleteDialogOpen(false)
        onOpenChange(false)
        onConfigUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = () => {
    if (config) {
      setEditValue(config.configValue)
      setEditDescription(config.description || '')
      setChangeReason('')
      setEditDialogOpen(true)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='w-full max-w-2xl overflow-y-auto p-0 sm:max-w-2xl'>
          <SheetHeader className='border-b px-6 py-4'>
            <SheetTitle>配置详情</SheetTitle>
          </SheetHeader>

          {loading ? (
            <div className='p-6 space-y-6'>
              <div className='space-y-2'>
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-48' />
                <Skeleton className='h-4 w-64' />
              </div>
            </div>
          ) : config ? (
            <>
              {/* Config Header */}
              <div className='border-b bg-muted/30 px-6 py-6'>
                <div className='space-y-3'>
                  <div className='flex items-center gap-3'>
                    <code className='rounded bg-muted px-2 py-1 text-lg font-semibold'>
                      {config.configKey}
                    </code>
                    <CopyButton text={config.configKey} />
                  </div>
                  <div className='flex items-center gap-2'>
                    {getValueTypeBadge(config.valueType, config.valueTypeDesc)}
                    {getGroupBadge(config.configGroup, config.configGroupDesc)}
                    {config.isReadonly ? (
                      <Badge variant='outline' className='gap-1'>
                        <Lock className='size-3' />
                        只读
                      </Badge>
                    ) : (
                      <Badge variant='outline' className='gap-1 text-green-600 border-green-600'>
                        <LockOpen className='size-3' />
                        可编辑
                      </Badge>
                    )}
                    {config.isEncrypted && (
                      <Badge variant='secondary'>已加密</Badge>
                    )}
                  </div>
                  {config.description && (
                    <p className='text-sm text-muted-foreground'>{config.description}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='mt-5 flex flex-wrap gap-3'>
                  {!config.isReadonly && (
                    <>
                      <Button variant='outline' onClick={openEditDialog}>
                        <Pencil className='mr-2 h-4 w-4' />
                        编辑配置
                      </Button>
                      <Button
                        variant='outline'
                        className='border-destructive text-destructive hover:bg-destructive/10'
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        删除配置
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='w-full justify-start rounded-none border-b bg-transparent px-6'>
                  <TabsTrigger value='info' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                    配置信息
                  </TabsTrigger>
                  <TabsTrigger value='logs' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                    变更日志
                  </TabsTrigger>
                </TabsList>

                {/* Info Tab */}
                <TabsContent value='info' className='mt-0 p-6'>
                  <div className='grid gap-6'>
                    <div>
                      <h4 className='mb-4 text-sm font-semibold'>配置值</h4>
                      <div className='rounded-lg border bg-muted/30 p-4'>
                        <div className='flex items-start justify-between gap-2'>
                          <pre className='text-sm whitespace-pre-wrap break-all font-mono flex-1'>
                            {config.configValue}
                          </pre>
                          <CopyButton text={config.configValue} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className='mb-4 text-sm font-semibold'>基本信息</h4>
                      <div className='grid grid-cols-2 gap-4'>
                        <InfoCard label='配置ID' value={config.id} copyable />
                        <InfoCard label='数据版本' value={config.dataVersion} />
                        <InfoCard label='排序值' value={config.sortOrder} />
                        <InfoCard label='默认值' value={config.defaultValue} copyable />
                      </div>
                    </div>

                    <div>
                      <h4 className='mb-4 text-sm font-semibold'>时间信息</h4>
                      <div className='grid grid-cols-2 gap-4'>
                        <InfoCard label='创建时间' value={config.createTime} />
                        <InfoCard label='更新时间' value={config.updateTime} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Logs Tab */}
                <TabsContent value='logs' className='mt-0 p-6'>
                  <div className='space-y-3'>
                    {logs.length === 0 ? (
                      <p className='text-center text-sm text-muted-foreground py-8'>暂无变更记录</p>
                    ) : (
                      logs.map((log) => (
                        <div key={log.id} className='rounded-lg border bg-card p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                                <History className='h-4 w-4 text-primary' />
                              </div>
                              <div>
                                <div className='flex items-center gap-2'>
                                  {getActionBadge(log.action, log.actionDesc)}
                                  <span className='text-sm font-medium'>{log.adminName}</span>
                                </div>
                                <p className='text-xs text-muted-foreground'>ID: {log.id}</p>
                              </div>
                            </div>
                          </div>
                          {(log.beforeValue || log.afterValue) && (
                            <div className='mt-3 grid grid-cols-2 gap-3'>
                              {log.beforeValue && (
                                <div className='rounded border bg-muted/30 p-2'>
                                  <p className='text-xs text-muted-foreground mb-1'>修改前</p>
                                  <p className='text-xs font-mono break-all'>{log.beforeValue}</p>
                                </div>
                              )}
                              {log.afterValue && (
                                <div className='rounded border bg-muted/30 p-2'>
                                  <p className='text-xs text-muted-foreground mb-1'>修改后</p>
                                  <p className='text-xs font-mono break-all'>{log.afterValue}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {log.changeReason && (
                            <div className='mt-2 rounded border bg-muted/30 p-2'>
                              <p className='text-xs text-muted-foreground'>修改原因: {log.changeReason}</p>
                            </div>
                          )}
                          <div className='mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              {log.createTime}
                            </span>
                            <span>IP: {log.clientIp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                <Settings className='h-5 w-5 text-primary' />
              </div>
              编辑配置
            </DialogTitle>
            <DialogDescription>
              修改配置 <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>{config?.configKey}</code> 的值
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>配置值 <span className='text-destructive'>*</span></Label>
              <Textarea
                className='mt-1.5 font-mono min-h-32'
                placeholder='请输入配置值...'
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </div>
            <div>
              <Label>描述</Label>
              <Input
                className='mt-1.5'
                placeholder='请输入描述信息'
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>修改原因</Label>
              <Textarea
                className='mt-1.5'
                placeholder='请输入修改原因（可选）...'
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdate} disabled={submitting || !editValue.trim()}>
              <Save className='mr-2 h-4 w-4' />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除配置？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除配置 <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>{config?.configKey}</code>，无法恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
