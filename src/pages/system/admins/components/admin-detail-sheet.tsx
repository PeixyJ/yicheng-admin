import { useState, useEffect, useRef } from 'react'
import {
  Ban,
  Calendar,
  Camera,
  Check,
  Copy,
  Key,
  Mail,
  Monitor,
  Settings,
  Shield,
  Trash2,
  Unlock,
  UserCog,
} from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  getAdminDetail,
  getAdminLoginLogs,
  getAdminOperationLogs,
  getAdminRoles,
  toggleAdminStatus,
  deleteAdmin,
  setAdminRole,
  resetAdminPassword,
  uploadAdminAvatar,
  updateAdmin,
} from '@/services/admin'
import type {
  AdminDetailVO,
  AdminLoginRecordVO,
  AdminOperationLogVO,
  AdminRoleVO,
  AdminRoleCode,
} from '@/types/admin'

interface AdminDetailSheetProps {
  adminId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdminUpdated?: () => void
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

function getLoginStatusBadge(status: string) {
  switch (status) {
    case 'SUCCESS':
      return <Badge variant='default'>成功</Badge>
    case 'FAILED':
      return <Badge variant='destructive'>失败</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

function getOperationStatusBadge(status: string) {
  switch (status) {
    case 'SUCCESS':
      return <Badge variant='default'>成功</Badge>
    case 'FAILED':
      return <Badge variant='destructive'>失败</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

export function AdminDetailSheet({ adminId, open, onOpenChange, onAdminUpdated }: AdminDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState<AdminDetailVO | null>(null)
  const [loginLogs, setLoginLogs] = useState<AdminLoginRecordVO[]>([])
  const [operationLogs, setOperationLogs] = useState<AdminOperationLogVO[]>([])
  const [roles, setRoles] = useState<AdminRoleVO[]>([])
  const [activeTab, setActiveTab] = useState('info')

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const [reason, setReason] = useState('')
  const [selectedRoleCode, setSelectedRoleCode] = useState<AdminRoleCode>('OPERATOR')
  const [editNickname, setEditNickname] = useState('')
  const [editRemark, setEditRemark] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && adminId) {
      loadAdminDetail()
      loadRoles()
    }
  }, [open, adminId])

  useEffect(() => {
    if (open && adminId && activeTab === 'login-logs') {
      loadLoginLogs()
    } else if (open && adminId && activeTab === 'operation-logs') {
      loadOperationLogs()
    }
  }, [activeTab, open, adminId])

  const loadAdminDetail = async () => {
    if (!adminId) return
    setLoading(true)
    try {
      const response = await getAdminDetail(adminId)
      if (response.code === 'success') {
        setAdmin(response.data)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    try {
      const response = await getAdminRoles()
      if (response.code === 'success') {
        setRoles(response.data)
      }
    } catch {
      // Error handled by interceptor
    }
  }

  const loadLoginLogs = async () => {
    if (!adminId) return
    try {
      const response = await getAdminLoginLogs(adminId, { page: 1, size: 20 })
      if (response.code === 'success') {
        setLoginLogs(response.data.records)
      }
    } catch {
      // Error handled by interceptor
    }
  }

  const loadOperationLogs = async () => {
    if (!adminId) return
    try {
      const response = await getAdminOperationLogs(adminId, { page: 1, size: 20 })
      if (response.code === 'success') {
        setOperationLogs(response.data.records)
      }
    } catch {
      // Error handled by interceptor
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !adminId) return
    try {
      const response = await uploadAdminAvatar(adminId, file)
      if (response.code === 'success') {
        loadAdminDetail()
        onAdminUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSuspend = async () => {
    if (!adminId) return
    setSubmitting(true)
    try {
      const response = await toggleAdminStatus(adminId, false, reason.trim() || undefined)
      if (response.code === 'success') {
        setSuspendDialogOpen(false)
        setReason('')
        loadAdminDetail()
        onAdminUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnsuspend = async () => {
    if (!adminId) return
    setSubmitting(true)
    try {
      const response = await toggleAdminStatus(adminId, true)
      if (response.code === 'success') {
        loadAdminDetail()
        onAdminUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!adminId) return
    setSubmitting(true)
    try {
      const response = await deleteAdmin(adminId)
      if (response.code === 'success') {
        setDeleteDialogOpen(false)
        onOpenChange(false)
        onAdminUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleSetRole = async () => {
    if (!adminId) return
    setSubmitting(true)
    try {
      const response = await setAdminRole(adminId, { roleCode: selectedRoleCode })
      if (response.code === 'success') {
        setRoleDialogOpen(false)
        loadAdminDetail()
        onAdminUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateAdmin = async () => {
    if (!adminId) return
    setSubmitting(true)
    try {
      const response = await updateAdmin(adminId, {
        nickname: editNickname.trim() || undefined,
        remark: editRemark.trim() || undefined,
      })
      if (response.code === 'success') {
        setEditDialogOpen(false)
        loadAdminDetail()
        onAdminUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetPassword = async () => {
    if (!adminId) return
    setSubmitting(true)
    try {
      const response = await resetAdminPassword(adminId)
      if (response.code === 'success') {
        setNewPassword(response.data)
        setResetPasswordDialogOpen(true)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = () => {
    if (admin) {
      setEditNickname(admin.nickname)
      setEditRemark(admin.remark || '')
      setEditDialogOpen(true)
    }
  }

  const openRoleDialog = () => {
    if (admin) {
      setSelectedRoleCode(admin.roleCode as AdminRoleCode)
      setRoleDialogOpen(true)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='w-full max-w-2xl overflow-y-auto p-0 sm:max-w-2xl'>
          <SheetHeader className='border-b px-6 py-4'>
            <SheetTitle>管理员详情</SheetTitle>
          </SheetHeader>

          {loading ? (
            <div className='p-6 space-y-6'>
              <div className='flex items-start gap-5'>
                <Skeleton className='h-20 w-20 rounded-full' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-6 w-32' />
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-4 w-64' />
                </div>
              </div>
            </div>
          ) : admin ? (
            <>
              {/* Admin Header */}
              <div className='border-b bg-muted/30 px-6 py-6'>
                <div className='flex items-start gap-5'>
                  <div className='relative group'>
                    <Avatar className='h-20 w-20 ring-4 ring-background shadow-lg'>
                      <AvatarImage src={admin.avatarUrl || undefined} />
                      <AvatarFallback className='text-xl'>{admin.nickname.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <button
                      type='button'
                      className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className='h-6 w-6 text-white' />
                    </button>
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3'>
                      <h3 className='text-xl font-semibold tracking-tight'>{admin.nickname}</h3>
                      <Badge variant={admin.status === 'ACTIVE' ? 'default' : admin.status === 'SUSPENDED' ? 'destructive' : 'secondary'}>
                        {admin.statusDesc}
                      </Badge>
                      <Badge variant={admin.roleCode === 'SUPER_ADMIN' ? 'default' : 'secondary'} className={admin.roleCode === 'SUPER_ADMIN' ? 'bg-purple-600 hover:bg-purple-700' : ''}>
                        {admin.roleName}
                      </Badge>
                    </div>
                    <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                      <span>ID: {admin.id}</span>
                      <CopyButton text={String(admin.id)} />
                      <span>·</span>
                      <span>工号: {admin.adminNo}</span>
                      <CopyButton text={admin.adminNo} />
                    </div>
                    {admin.remark && (
                      <p className='mt-2 text-sm text-muted-foreground'>{admin.remark}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='mt-5 flex flex-wrap gap-3'>
                  <Button variant='outline' onClick={openEditDialog}>
                    <Settings className='mr-2 h-4 w-4' />
                    编辑信息
                  </Button>
                  {admin.roleCode !== 'SUPER_ADMIN' && (
                    <>
                      <Button variant='outline' onClick={openRoleDialog}>
                        <UserCog className='mr-2 h-4 w-4' />
                        设置角色
                      </Button>
                      {admin.status === 'ACTIVE' && (
                        <Button
                          variant='outline'
                          className='border-destructive text-destructive hover:bg-destructive/10'
                          onClick={() => setSuspendDialogOpen(true)}
                        >
                          <Ban className='mr-2 h-4 w-4' />
                          停用账号
                        </Button>
                      )}
                      {admin.status === 'SUSPENDED' && (
                        <Button
                          variant='outline'
                          onClick={handleUnsuspend}
                          disabled={submitting}
                        >
                          <Unlock className='mr-2 h-4 w-4' />
                          启用账号
                        </Button>
                      )}
                      <Button variant='outline' onClick={handleResetPassword} disabled={submitting}>
                        <Key className='mr-2 h-4 w-4' />
                        重置密码
                      </Button>
                      <Button
                        variant='outline'
                        className='border-destructive text-destructive hover:bg-destructive/10'
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        删除账号
                      </Button>
                    </>
                  )}
                </div>

                {/* Suspended Info */}
                {admin.status === 'SUSPENDED' && admin.suspendedReason && (
                  <div className='mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3'>
                    <p className='text-sm font-medium text-destructive'>停用原因</p>
                    <p className='mt-1 text-sm text-muted-foreground'>{admin.suspendedReason}</p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      停用时间: {admin.suspendedAt}
                    </p>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='w-full justify-start rounded-none border-b bg-transparent px-6'>
                  <TabsTrigger value='info' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                    基本信息
                  </TabsTrigger>
                  <TabsTrigger value='accounts' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                    登录账号
                  </TabsTrigger>
                  <TabsTrigger value='login-logs' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                    登录日志
                  </TabsTrigger>
                  <TabsTrigger value='operation-logs' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                    操作日志
                  </TabsTrigger>
                </TabsList>

                {/* Info Tab */}
                <TabsContent value='info' className='mt-0 p-6'>
                  <div className='grid gap-6'>
                    <div>
                      <h4 className='mb-4 text-sm font-semibold'>角色权限</h4>
                      <div className='grid grid-cols-2 gap-4'>
                        <InfoCard label='角色' value={admin.roleName} />
                        <InfoCard label='管理范围' value={admin.scopeTypeDesc} />
                        <InfoCard label='MFA状态' value={admin.mfaEnabled ? '已启用' : '未启用'} />
                        <InfoCard label='IP白名单' value={admin.allowedIps ? '已设置' : '未设置'} />
                      </div>
                    </div>

                    <div>
                      <h4 className='mb-4 text-sm font-semibold'>时间信息</h4>
                      <div className='grid grid-cols-2 gap-4'>
                        <InfoCard label='创建时间' value={admin.createTime} />
                        <InfoCard label='更新时间' value={admin.updateTime} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Accounts Tab */}
                <TabsContent value='accounts' className='mt-0 p-6'>
                  <div className='space-y-3'>
                    {admin.accounts.length === 0 ? (
                      <p className='text-center text-sm text-muted-foreground py-8'>暂无登录账号</p>
                    ) : (
                      admin.accounts.map((account) => (
                        <div key={account.id} className='rounded-lg border bg-card p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                                <Mail className='h-4 w-4 text-primary' />
                              </div>
                              <div>
                                <div className='flex items-center gap-2'>
                                  <span className='text-sm font-medium'>{account.identifier}</span>
                                  <Badge variant={account.verified ? 'default' : 'secondary'}>
                                    {account.verified ? '已验证' : '未验证'}
                                  </Badge>
                                </div>
                                <p className='text-xs text-muted-foreground'>{account.accountTypeDesc}</p>
                              </div>
                            </div>
                            <Badge variant={account.status ? 'default' : 'outline'}>
                              {account.status ? '正常' : '禁用'}
                            </Badge>
                          </div>
                          {account.lastLoginTime && (
                            <div className='mt-2 flex items-center gap-4 text-xs text-muted-foreground'>
                              <span className='flex items-center gap-1'>
                                <Calendar className='h-3 w-3' />
                                最后登录: {account.lastLoginTime}
                              </span>
                              {account.lastLoginIp && (
                                <span className='flex items-center gap-1'>
                                  <Monitor className='h-3 w-3' />
                                  IP: {account.lastLoginIp}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Login Logs Tab */}
                <TabsContent value='login-logs' className='mt-0 p-6'>
                  <div className='space-y-3'>
                    {loginLogs.length === 0 ? (
                      <p className='text-center text-sm text-muted-foreground py-8'>暂无登录记录</p>
                    ) : (
                      loginLogs.map((log) => (
                        <div key={log.id} className='rounded-lg border bg-card p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                                <Shield className='h-4 w-4 text-primary' />
                              </div>
                              <div>
                                <div className='flex items-center gap-2'>
                                  <span className='text-sm font-medium'>{log.loginTypeDesc}</span>
                                  {getLoginStatusBadge(log.status)}
                                  {log.isAbnormal && (
                                    <Badge variant='destructive'>异常</Badge>
                                  )}
                                </div>
                                <p className='text-xs text-muted-foreground'>{log.identifier}</p>
                              </div>
                            </div>
                          </div>
                          <div className='mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              {log.loginTime}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Monitor className='h-3 w-3' />
                              {log.clientIp} {log.ipLocation && `(${log.ipLocation})`}
                            </span>
                            {log.browser && (
                              <span>{log.browser} / {log.os}</span>
                            )}
                          </div>
                          {log.failReason && (
                            <p className='mt-2 text-xs text-destructive'>失败原因: {log.failReason}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Operation Logs Tab */}
                <TabsContent value='operation-logs' className='mt-0 p-6'>
                  <div className='space-y-3'>
                    {operationLogs.length === 0 ? (
                      <p className='text-center text-sm text-muted-foreground py-8'>暂无操作记录</p>
                    ) : (
                      operationLogs.map((log) => (
                        <div key={log.id} className='rounded-lg border bg-card p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                                <Settings className='h-4 w-4 text-primary' />
                              </div>
                              <div>
                                <div className='flex items-center gap-2'>
                                  <span className='text-sm font-medium'>{log.moduleDesc} - {log.actionDesc}</span>
                                  {getOperationStatusBadge(log.status)}
                                </div>
                                {log.targetName && (
                                  <p className='text-xs text-muted-foreground'>目标: {log.targetName}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className='mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              {log.createTime}
                            </span>
                            <span>{log.requestMethod} {log.requestUrl}</span>
                            <span>{log.durationMs}ms</span>
                          </div>
                          {log.errorMsg && (
                            <p className='mt-2 text-xs text-destructive'>错误: {log.errorMsg}</p>
                          )}
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

      {/* Suspend Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10'>
                <Ban className='h-5 w-5 text-destructive' />
              </div>
              停用账号
            </DialogTitle>
            <DialogDescription>停用后该管理员将无法登录系统</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>停用原因</Label>
              <Textarea
                className='mt-1.5'
                placeholder='请输入停用原因（可选）...'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setSuspendDialogOpen(false)}>
              取消
            </Button>
            <Button
              variant='destructive'
              onClick={handleSuspend}
              disabled={submitting}
            >
              确认停用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除管理员？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该管理员账号及其关联信息，无法恢复。
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

      {/* Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                <UserCog className='h-5 w-5 text-primary' />
              </div>
              设置角色
            </DialogTitle>
            <DialogDescription>修改管理员的角色权限</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>选择角色 <span className='text-destructive'>*</span></Label>
              <Select value={selectedRoleCode} onValueChange={(v) => setSelectedRoleCode(v as AdminRoleCode)}>
                <SelectTrigger className='mt-1.5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.filter(r => r.code !== 'SUPER_ADMIN').map((role) => (
                    <SelectItem key={role.code} value={role.code}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setRoleDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSetRole} disabled={submitting}>
              确认设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                <Settings className='h-5 w-5 text-primary' />
              </div>
              编辑信息
            </DialogTitle>
            <DialogDescription>修改管理员的基本信息</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>姓名/昵称</Label>
              <Input
                className='mt-1.5'
                placeholder='请输入姓名/昵称'
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
              />
            </div>
            <div>
              <Label>备注</Label>
              <Textarea
                className='mt-1.5'
                placeholder='请输入备注信息'
                value={editRemark}
                onChange={(e) => setEditRemark(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateAdmin} disabled={submitting}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                <Key className='h-5 w-5 text-primary' />
              </div>
              密码已重置
            </DialogTitle>
            <DialogDescription>请将新密码发送给管理员，首次登录需修改密码</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='rounded-lg border bg-muted p-4'>
              <p className='text-sm text-muted-foreground'>新密码</p>
              <div className='mt-1 flex items-center gap-2'>
                <code className='text-lg font-mono font-semibold'>{newPassword}</code>
                <CopyButton text={newPassword} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setResetPasswordDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
