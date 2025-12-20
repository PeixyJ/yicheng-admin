import {useState, useEffect, useRef} from 'react'
import {
    Ban,
    Camera,
    Check,
    Clock,
    Copy,
    Globe,
    KeyRound,
    LogIn,
    Mail,
    MapPin,
    MessageSquareText,
    Monitor,
    ShieldCheck,
    Smartphone,
    Trash2,
    Unlock,
    UserPen,
    CreditCard,
    AlertTriangle,
    Users,
    Crown,
} from 'lucide-react'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Skeleton} from '@/components/ui/skeleton'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {DatePicker} from '@/components/shadcn-studio/date-picker'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {BusinessError} from '@/types/api'

import {
    deleteUser,
    getUserAccounts,
    getUserDetail,
    getUserDevices,
    getUserLoginRecords,
    getUserOperationLogs,
    getUserTeams,
    suspendUser,
    unsuspendUser,
    updateUserRemark,
    uploadUserAvatar,
} from '@/services/user'

function formatDateTime(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

import type {
    AdminUserDetailVO,
    AdminUserDeviceVO,
    AdminUserLoginRecordVO,
    AdminUserOperationLogVO,
    AdminUserTeamVO,
    UserAccountVO,
} from '@/types/user'

interface UserDetailSheetProps {
    userId: number | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onUserUpdated?: () => void
}

function CopyButton({text}: { text: string }) {
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
            {copied ? <Check className='size-3.5'/> : <Copy className='size-3.5'/>}
        </Button>
    )
}

function InfoCard({label, value}: { label: string; value: string | null | undefined }) {
    return (
        <div className='rounded-lg border bg-card p-4'>
            <p className='text-xs text-muted-foreground'>{label}</p>
            <p className='mt-1 text-sm font-medium'>{value || '-'}</p>
        </div>
    )
}

export function UserDetailSheet({userId, open, onOpenChange, onUserUpdated}: UserDetailSheetProps) {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<AdminUserDetailVO | null>(null)
    const [devices, setDevices] = useState<AdminUserDeviceVO[]>([])
    const [loginRecords, setLoginRecords] = useState<AdminUserLoginRecordVO[]>([])
    const [operationLogs, setOperationLogs] = useState<AdminUserOperationLogVO[]>([])
    const [teams, setTeams] = useState<AdminUserTeamVO[]>([])
    const [accounts, setAccounts] = useState<UserAccountVO[]>([])
    const [activeTab, setActiveTab] = useState('info')

    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
    const [remarkDialogOpen, setRemarkDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteError, setDeleteError] = useState('')
    const [suspendReason, setSuspendReason] = useState('')
    const [suspendUntil, setSuspendUntil] = useState<Date | undefined>(undefined)
    const [remark, setRemark] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open && userId) {
            loadUserDetail()
        }
    }, [open, userId])

    useEffect(() => {
        if (open && userId && activeTab === 'devices') {
            loadDevices()
        } else if (open && userId && activeTab === 'logins') {
            loadLoginRecords()
        } else if (open && userId && activeTab === 'logs') {
            loadOperationLogs()
        } else if (open && userId && activeTab === 'teams') {
            loadTeams()
        } else if (open && userId && activeTab === 'accounts') {
            loadAccounts()
        }
    }, [activeTab, open, userId])

    const loadUserDetail = async () => {
        if (!userId) return
        setLoading(true)
        try {
            const response = await getUserDetail(userId)
            if (response.code === 'success') {
                setUser(response.data)
                setRemark(response.data.remark || '')
            }
        } catch {
            // Error handled by interceptor
        } finally {
            setLoading(false)
        }
    }

    const loadDevices = async () => {
        if (!userId) return
        try {
            const response = await getUserDevices(userId)
            if (response.code === 'success') {
                setDevices(response.data)
            }
        } catch {
            // Error handled by interceptor
        }
    }

    const loadLoginRecords = async () => {
        if (!userId) return
        try {
            const response = await getUserLoginRecords(userId, 1, 20)
            if (response.code === 'success') {
                setLoginRecords(response.data.records)
            }
        } catch {
            // Error handled by interceptor
        }
    }

    const loadOperationLogs = async () => {
        if (!userId) return
        try {
            const response = await getUserOperationLogs(userId, 1, 20)
            if (response.code === 'success') {
                setOperationLogs(response.data.records)
            }
        } catch {
            // Error handled by interceptor
        }
    }

    const loadTeams = async () => {
        if (!userId) return
        try {
            const response = await getUserTeams(userId)
            if (response.code === 'success') {
                setTeams(response.data)
            }
        } catch {
            // Error handled by interceptor
        }
    }

    const loadAccounts = async () => {
        if (!userId) return
        try {
            const response = await getUserAccounts(userId)
            if (response.code === 'success') {
                setAccounts(response.data)
            }
        } catch {
            // Error handled by interceptor
        }
    }

    const handleSuspend = async () => {
        if (!userId || !suspendReason.trim()) return
        setSubmitting(true)
        try {
            const response = await suspendUser(userId, {
                reason: suspendReason,
                suspendedUntil: suspendUntil ? formatDateTime(suspendUntil) : undefined,
            })
            if (response.code === 'success') {
                setSuspendDialogOpen(false)
                setSuspendReason('')
                setSuspendUntil(undefined)
                loadUserDetail()
                onUserUpdated?.()
            }
        } catch {
            // Error handled by interceptor
        } finally {
            setSubmitting(false)
        }
    }

    const handleUnsuspend = async () => {
        if (!userId) return
        setSubmitting(true)
        try {
            const response = await unsuspendUser(userId)
            if (response.code === 'success') {
                loadUserDetail()
                onUserUpdated?.()
            }
        } catch {
            // Error handled by interceptor
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateRemark = async () => {
        if (!userId) return
        setSubmitting(true)
        try {
            const response = await updateUserRemark(userId, {remark})
            if (response.code === 'success') {
                setRemarkDialogOpen(false)
                loadUserDetail()
            }
        } catch {
            // Error handled by interceptor
        } finally {
            setSubmitting(false)
        }
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !userId) return
        try {
            const response = await uploadUserAvatar(userId, file)
            if (response.code === 'success') {
                loadUserDetail()
                onUserUpdated?.()
            }
        } catch {
            // Error handled by interceptor
        }
    }

    const handleDelete = async () => {
        if (!userId) return
        setSubmitting(true)
        setDeleteError('')
        try {
            const response = await deleteUser(userId)
            if (response.code === 'success') {
                setDeleteDialogOpen(false)
                onOpenChange(false)
                onUserUpdated?.()
            }
        } catch (error) {
            if (error instanceof BusinessError) {
                setDeleteError(error.message)
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className='w-full max-w-2xl overflow-y-auto p-0 sm:max-w-2xl'>
                    <SheetHeader className='border-b px-6 py-4'>
                        <SheetTitle>用户详情</SheetTitle>
                    </SheetHeader>

                    {loading ? (
                        <div className='p-6 space-y-6'>
                            <div className='flex items-start gap-5'>
                                <Skeleton className='h-20 w-20 rounded-full'/>
                                <div className='flex-1 space-y-2'>
                                    <Skeleton className='h-6 w-32'/>
                                    <Skeleton className='h-4 w-48'/>
                                    <Skeleton className='h-4 w-64'/>
                                </div>
                            </div>
                        </div>
                    ) : user ? (
                        <>
                            {/* User Header */}
                            <div className='border-b bg-muted/30 px-6 py-6'>
                                <div className='flex items-start gap-5'>
                                    <div className='group relative'>
                                        <Avatar className='h-20 w-20 ring-4 ring-background shadow-lg'>
                                            <AvatarImage src={user.avatarUrl || undefined}/>
                                            <AvatarFallback
                                                className='text-xl'>{user.nickname.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className='absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'
                                        >
                                            <Camera className='h-6 w-6 text-white'/>
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type='file'
                                            className='hidden'
                                            accept='image/*'
                                            onChange={handleAvatarUpload}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-3'>
                                            <h3 className='text-xl font-semibold tracking-tight'>{user.nickname}</h3>
                                            <Badge variant={user.status === 'ACTIVE' ? 'default' : 'destructive'}>
                                                {user.statusDesc}
                                            </Badge>
                                        </div>
                                        <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                                            <span>ID: {user.id}</span>
                                            <CopyButton text={String(user.id)}/>
                                            <span>·</span>
                                            <span>邀请码: {user.inviteCode}</span>
                                            <CopyButton text={user.inviteCode}/>
                                        </div>
                                        <p className='mt-2 text-sm text-muted-foreground'>
                                            {user.remark || '-'}
                                        </p>
                                        {user.bio && (
                                            <p className='mt-1 text-sm text-muted-foreground'>{user.bio}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='mt-5 flex gap-3'>
                                    {user.status === 'ACTIVE' ? (
                                        <Button
                                            variant='outline'
                                            className='border-destructive text-destructive hover:bg-destructive/10'
                                            onClick={() => setSuspendDialogOpen(true)}
                                        >
                                            <Ban className='mr-2 h-4 w-4'/>
                                            封禁用户
                                        </Button>
                                    ) : (
                                        <Button
                                            variant='outline'
                                            onClick={handleUnsuspend}
                                            disabled={submitting}
                                        >
                                            <Unlock className='mr-2 h-4 w-4'/>
                                            解封用户
                                        </Button>
                                    )}
                                    <Button variant='outline' onClick={() => setRemarkDialogOpen(true)}>
                                        <MessageSquareText className='mr-2 h-4 w-4'/>
                                        编辑备注
                                    </Button>
                                    <Button
                                        variant='outline'
                                        className='border-destructive text-destructive hover:bg-destructive/10'
                                        onClick={() => setDeleteDialogOpen(true)}
                                    >
                                        <Trash2 className='mr-2 h-4 w-4'/>
                                        删除用户
                                    </Button>
                                </div>

                                {/* Suspended Info */}
                                {user.status === 'SUSPENDED' && user.suspendedReason && (
                                    <div className='mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3'>
                                        <p className='text-sm font-medium text-destructive'>封禁原因</p>
                                        <p className='mt-1 text-sm text-muted-foreground'>{user.suspendedReason}</p>
                                        {user.suspendedUntil && (
                                            <p className='mt-1 text-xs text-muted-foreground'>
                                                截止时间: {user.suspendedUntil}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tabs */}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                                <TabsList className='w-full justify-start rounded-none border-b bg-transparent px-6'>
                                    <TabsTrigger value='info'
                                                 className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                                        基本信息
                                    </TabsTrigger>
                                    <TabsTrigger value='accounts'
                                                 className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                                        账户列表
                                    </TabsTrigger>
                                    <TabsTrigger value='teams'
                                                 className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                                        团队列表
                                    </TabsTrigger>
                                    <TabsTrigger value='devices'
                                                 className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                                        设备列表
                                    </TabsTrigger>
                                    <TabsTrigger value='logins'
                                                 className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                                        登录记录
                                    </TabsTrigger>
                                    <TabsTrigger value='logs'
                                                 className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                                        操作日志
                                    </TabsTrigger>
                                </TabsList>

                                {/* Info Tab */}
                                <TabsContent value='info' className='mt-0 p-6'>
                                    <div className='grid gap-6'>
                                        <div>
                                            <h4 className='mb-4 text-sm font-semibold'>基础信息</h4>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <InfoCard label='性别' value={user.genderDesc}/>
                                                <InfoCard label='语言偏好' value={user.locale}/>
                                                <InfoCard label='时区' value={user.timezone}/>
                                                <InfoCard label='个人空间ID'
                                                          value={user.personalTeamId ? String(user.personalTeamId) : null}/>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className='mb-4 text-sm font-semibold'>邀请信息</h4>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <InfoCard label='邀请人ID'
                                                          value={user.invitedByUserId ? String(user.invitedByUserId) : null}/>
                                                <InfoCard label='邀请人昵称' value={user.inviterNickname}/>
                                                <div className='col-span-2'>
                                                    <InfoCard label='被邀请时间' value={user.invitedAt}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className='mb-4 text-sm font-semibold'>时间信息</h4>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <InfoCard label='创建时间' value={user.createTime}/>
                                                <InfoCard label='更新时间' value={user.updateTime}/>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Accounts Tab */}
                                <TabsContent value='accounts' className='mt-0 p-6'>
                                    <div className='space-y-3'>
                                        {accounts.length === 0 ? (
                                            <p className='text-center text-sm text-muted-foreground py-8'>暂无账户信息</p>
                                        ) : (
                                            accounts.map((account) => (
                                                <div key={account.id} className='rounded-lg border bg-card p-4'>
                                                    <div className='flex items-start justify-between'>
                                                        <div className='flex items-center gap-4'>
                                                            <div
                                                                className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                                                                <Mail className='h-5 w-5 text-primary'/>
                                                            </div>
                                                            <div>
                                                                <div className='flex items-center gap-2'>
                                                                    <p className='text-sm font-medium'>{account.identifier}</p>
                                                                    {account.verified && (
                                                                        <Badge variant='secondary' className='text-xs'>
                                                                            <ShieldCheck className='mr-1 h-3 w-3'/>
                                                                            已验证
                                                                        </Badge>
                                                                    )}
                                                                    {account.hasPassword && (
                                                                        <Badge variant='outline' className='text-xs'>
                                                                            <KeyRound className='mr-1 h-3 w-3'/>
                                                                            有密码
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className='text-xs text-muted-foreground'>
                                                                    {account.accountTypeDesc}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge variant={account.status ? 'default' : 'secondary'}>
                                                            {account.status ? '正常' : '禁用'}
                                                        </Badge>
                                                    </div>
                                                    <div className='mt-3 grid grid-cols-2 gap-3 text-xs'>
                                                        {account.verifiedAt && (
                                                            <div
                                                                className='flex items-center gap-2 text-muted-foreground'>
                                                                <Clock className='h-3 w-3'/>
                                                                <span>验证: {account.verifiedAt}</span>
                                                            </div>
                                                        )}
                                                        {account.lastLoginTime && (
                                                            <div
                                                                className='flex items-center gap-2 text-muted-foreground'>
                                                                <Clock className='h-3 w-3'/>
                                                                <span>最后登录: {account.lastLoginTime}</span>
                                                            </div>
                                                        )}
                                                        <div className='flex items-center gap-2 text-muted-foreground'>
                                                            <Clock className='h-3 w-3'/>
                                                            <span>创建: {account.createTime}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Teams Tab */}
                                <TabsContent value='teams' className='mt-0 p-6'>
                                    <div className='space-y-3'>
                                        {teams.length === 0 ? (
                                            <p className='text-center text-sm text-muted-foreground py-8'>暂无团队信息</p>
                                        ) : (
                                            teams.map((team) => (
                                                <div key={team.teamId} className='rounded-lg border bg-card p-4'>
                                                    <div className='flex items-start justify-between'>
                                                        <div className='flex items-center gap-4'>
                                                            <div
                                                                className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                                                                <Users className='h-5 w-5 text-primary'/>
                                                            </div>
                                                            <div>
                                                                <div className='flex items-center gap-2'>
                                                                    <p className='text-sm font-medium'>{team.teamName}</p>
                                                                    <Badge variant='outline' className='text-xs'>
                                                                        {team.roleDesc}
                                                                    </Badge>
                                                                </div>
                                                                <p className='text-xs text-muted-foreground'>
                                                                    {team.teamCode}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant={team.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                                            {team.statusDesc || team.status}
                                                        </Badge>
                                                    </div>
                                                    <div className='mt-3 grid grid-cols-2 gap-3 text-xs'>
                                                        <div className='flex items-center gap-2 text-muted-foreground'>
                                                            <Crown className='h-3 w-3'/>
                                                            <span>订阅: {team.currentPlanName || '-'}</span>
                                                        </div>
                                                        {team.subscriptionEndTime && (
                                                            <div
                                                                className='flex items-center gap-2 text-muted-foreground'>
                                                                <Clock className='h-3 w-3'/>
                                                                <span>到期: {team.subscriptionEndTime}</span>
                                                            </div>
                                                        )}
                                                        <div className='flex items-center gap-2 text-muted-foreground'>
                                                            <Clock className='h-3 w-3'/>
                                                            <span>加入: {team.joinedTime}</span>
                                                        </div>
                                                        <div className='flex items-center gap-2 text-muted-foreground'>
                                                            <Clock className='h-3 w-3'/>
                                                            <span>创建: {team.teamCreateTime}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Devices Tab */}
                                <TabsContent value='devices' className='mt-0 p-6'>
                                    <div className='space-y-3'>
                                        {devices.length === 0 ? (
                                            <p className='text-center text-sm text-muted-foreground py-8'>暂无设备信息</p>
                                        ) : (
                                            devices.map((device) => (
                                                <div key={device.id}
                                                     className='flex items-center justify-between rounded-lg border bg-card p-4'>
                                                    <div className='flex items-center gap-4'>
                                                        <div
                                                            className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                                                            {device.deviceType === 'PC' ? (
                                                                <Monitor className='h-5 w-5 text-primary'/>
                                                            ) : (
                                                                <Smartphone className='h-5 w-5 text-primary'/>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className='text-sm font-medium'>{device.deviceName}</p>
                                                            <p className='text-xs text-muted-foreground'>
                                                                {device.os} {device.osVersion} · {device.browser}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='text-right'>
                                                        {device.isTrusted && (
                                                            <Badge variant='secondary' className='mb-1'>
                                                                <ShieldCheck className='mr-1 h-3 w-3'/>
                                                                可信设备
                                                            </Badge>
                                                        )}
                                                        <p className='text-xs text-muted-foreground'>
                                                            最后登录: {device.lastLoginTime}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Logins Tab */}
                                <TabsContent value='logins' className='mt-0 p-6'>
                                    <div className='space-y-3'>
                                        {loginRecords.length === 0 ? (
                                            <p className='text-center text-sm text-muted-foreground py-8'>暂无登录记录</p>
                                        ) : (
                                            loginRecords.map((record) => (
                                                <div
                                                    key={record.id}
                                                    className={`rounded-lg border p-4 ${
                                                        record.isAbnormal ? 'border-amber-200 bg-amber-50/50' : 'bg-card'
                                                    }`}
                                                >
                                                    <div className='flex items-start justify-between'>
                                                        <div className='flex items-center gap-3'>
                                                            <div
                                                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                                    record.isAbnormal ? 'bg-amber-100' : 'bg-emerald-50'
                                                                }`}>
                                                                {record.isAbnormal ? (
                                                                    <AlertTriangle className='h-4 w-4 text-amber-600'/>
                                                                ) : (
                                                                    <LogIn className='h-4 w-4 text-emerald-600'/>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className='text-sm font-medium'>{record.loginTypeDesc}</p>
                                                                <p className='text-xs text-muted-foreground'>
                                                                    {record.isAbnormal ? record.abnormalReason : record.identifier}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant={record.status === 'SUCCESS' ? 'default' : 'destructive'}>
                                                            {record.statusDesc}
                                                        </Badge>
                                                    </div>
                                                    <div
                                                        className='mt-3 flex items-center gap-4 text-xs text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <Globe className='h-3 w-3'/>
                                {record.clientIp}
                            </span>
                                                        {record.ipLocation && (
                                                            <span className='flex items-center gap-1'>
                                <MapPin className='h-3 w-3'/>
                                                                {record.ipLocation}
                              </span>
                                                        )}
                                                        <span className='flex items-center gap-1'>
                              <Clock className='h-3 w-3'/>
                                                            {record.loginTime}
                            </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Logs Tab */}
                                <TabsContent value='logs' className='mt-0 p-6'>
                                    <div className='space-y-3'>
                                        {operationLogs.length === 0 ? (
                                            <p className='text-center text-sm text-muted-foreground py-8'>暂无操作日志</p>
                                        ) : (
                                            operationLogs.map((log) => (
                                                <div key={log.id} className='rounded-lg border bg-card p-4'>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center gap-3'>
                                                            <div
                                                                className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                                                                {log.module === 'USER' ? (
                                                                    <UserPen className='h-4 w-4 text-primary'/>
                                                                ) : (
                                                                    <CreditCard className='h-4 w-4 text-primary'/>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className='text-sm font-medium'>{log.actionDesc}</p>
                                                                <p className='text-xs text-muted-foreground'>
                                                                    {log.moduleDesc} · {log.targetName || log.action}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant={log.status === 'SUCCESS' ? 'default' : 'destructive'}>
                                                            {log.statusDesc}
                                                        </Badge>
                                                    </div>
                                                    <div
                                                        className='mt-3 flex items-center gap-4 text-xs text-muted-foreground'>
                                                        <span>耗时: {log.durationMs}ms</span>
                                                        <span>IP: {log.clientIp}</span>
                                                        <span>{log.createTime}</span>
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

            {/* Suspend Dialog */}
            <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
                <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10'>
                                <Ban className='h-5 w-5 text-destructive'/>
                            </div>
                            封禁用户
                        </DialogTitle>
                        <DialogDescription>封禁后用户将无法登录</DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4'>
                        <div>
                            <Label>封禁原因 <span className='text-destructive'>*</span></Label>
                            <Textarea
                                className='mt-1.5'
                                placeholder='请输入封禁原因...'
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>封禁截止时间</Label>
                            <div className='mt-1.5'>
                                <DatePicker
                                    value={suspendUntil}
                                    onChange={setSuspendUntil}
                                    placeholder='选择截止日期'
                                />
                            </div>
                            <p className='mt-1 text-xs text-muted-foreground'>留空表示永久封禁</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setSuspendDialogOpen(false)}>
                            取消
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={handleSuspend}
                            disabled={!suspendReason.trim() || submitting}
                        >
                            确认封禁
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remark Dialog */}
            <Dialog open={remarkDialogOpen} onOpenChange={setRemarkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>编辑管理员备注</DialogTitle>
                        <DialogDescription>备注仅管理员可见</DialogDescription>
                    </DialogHeader>
                    <div>
                        <Textarea
                            placeholder='请输入备注信息...'
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setRemarkDialogOpen(false)}>
                            取消
                        </Button>
                        <Button onClick={handleUpdateRemark} disabled={submitting}>
                            保存
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
                setDeleteDialogOpen(open)
                if (!open) setDeleteError('')
            }}>
                <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10'>
                                <Trash2 className='h-5 w-5 text-destructive'/>
                            </div>
                            删除用户
                        </DialogTitle>
                        <DialogDescription>
                            此操作将永久删除用户及其所有关联数据，且无法恢复。如果用户是团队所有者，请先转让团队后再删除。
                        </DialogDescription>
                    </DialogHeader>
                    {deleteError && (
                        <Alert variant='destructive'>
                            <AlertTriangle className='h-4 w-4'/>
                            <AlertDescription>{deleteError}</AlertDescription>
                        </Alert>
                    )}
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
                            取消
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={handleDelete}
                            disabled={submitting}
                        >
                            确认删除
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
