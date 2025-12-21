import { useState, useEffect, useRef } from 'react'
import {
  ArrowLeftRight,
  Ban,
  Calendar,
  Camera,
  Check,
  Copy,
  LoaderCircle,
  Mail,
  Search,
  Trash2,
  Unlock,
  UserMinus,
  UserPlus,
  Users,
  X,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

import {
  getTeamDetail,
  getTeamDailyQuota,
  getTeamMonthlyQuota,
  getTeamInvitations,
  getTeamTransfers,
  getTeamMembers,
  suspendTeam,
  unsuspendTeam,
  disbandTeam,
  transferTeam,
  uploadTeamLogo,
  inviteTeamMember,
  removeTeamMember,
} from '@/services/team'
import { getUserList } from '@/services/user'
import type { AdminUserVO } from '@/types/user'
import type {
  AdminTeamDetailVO,
  AdminTeamQuotaVO,
  AdminTeamInvitationVO,
  AdminTeamTransferVO,
  AdminTeamMemberVO,
  TransferSelfRole,
} from '@/types/team'

interface TeamDetailSheetProps {
  teamId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTeamUpdated?: () => void
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

function QuotaCard({ title, quota }: { title: string; quota: AdminTeamQuotaVO | null }) {
  if (!quota) {
    return (
      <div className='rounded-lg border bg-card p-4'>
        <p className='text-sm font-medium'>{title}</p>
        <p className='mt-2 text-xs text-muted-foreground'>暂无数据</p>
      </div>
    )
  }

  const usagePercent = quota.totalQuota > 0 ? (quota.usedQuota / quota.totalQuota) * 100 : 0

  return (
    <div className='rounded-lg border bg-card p-4'>
      <p className='text-sm font-medium'>{title}</p>
      <div className='mt-3'>
        <div className='flex justify-between text-xs text-muted-foreground'>
          <span>已用 {quota.usedQuota}</span>
          <span>总计 {quota.totalQuota}</span>
        </div>
        <div className='mt-1.5 h-2 rounded-full bg-muted'>
          <div
            className='h-full rounded-full bg-primary transition-all'
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        <div className='mt-2 flex gap-4 text-xs text-muted-foreground'>
          <span>计划: {quota.planQuota}</span>
          <span>额外: {quota.extraQuota}</span>
          <span>可用: {quota.availableQuota}</span>
        </div>
      </div>
    </div>
  )
}

function getInvitationStatusBadge(status: string) {
  switch (status) {
    case 'PENDING':
      return <Badge variant='secondary'>待处理</Badge>
    case 'ACCEPTED':
      return <Badge variant='default'>已接受</Badge>
    case 'REJECTED':
      return <Badge variant='destructive'>已拒绝</Badge>
    case 'CANCELED':
      return <Badge variant='outline'>已取消</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

function getSelfRoleLabel(role: TransferSelfRole) {
  switch (role) {
    case 'ADMIN':
      return '管理员'
    case 'MEMBER':
      return '成员'
    case 'LEAVE':
      return '离开'
    default:
      return role
  }
}

export function TeamDetailSheet({ teamId, open, onOpenChange, onTeamUpdated }: TeamDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [team, setTeam] = useState<AdminTeamDetailVO | null>(null)
  const [dailyQuota, setDailyQuota] = useState<AdminTeamQuotaVO | null>(null)
  const [monthlyQuota, setMonthlyQuota] = useState<AdminTeamQuotaVO | null>(null)
  const [invitations, setInvitations] = useState<AdminTeamInvitationVO[]>([])
  const [transfers, setTransfers] = useState<AdminTeamTransferVO[]>([])
  const [members, setMembers] = useState<AdminTeamMemberVO[]>([])
  const [activeTab, setActiveTab] = useState('info')

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [disbandDialogOpen, setDisbandDialogOpen] = useState(false)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [transferUserId, setTransferUserId] = useState('')
  const [transferSelfRole, setTransferSelfRole] = useState<TransferSelfRole>('ADMIN')
  const [submitting, setSubmitting] = useState(false)

  // 邀请成员相关状态
  const [inviteUserKeyword, setInviteUserKeyword] = useState('')
  const [inviteUsers, setInviteUsers] = useState<AdminUserVO[]>([])
  const [selectedInviteUser, setSelectedInviteUser] = useState<AdminUserVO | null>(null)
  const [isSearchingInviteUser, setIsSearchingInviteUser] = useState(false)

  // 移除成员相关状态
  const [memberToRemove, setMemberToRemove] = useState<AdminTeamMemberVO | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const inviteSearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open && teamId) {
      loadTeamDetail()
    }
  }, [open, teamId])

  useEffect(() => {
    if (open && teamId && activeTab === 'quota') {
      loadQuotas()
    } else if (open && teamId && activeTab === 'invitations') {
      loadInvitations()
    } else if (open && teamId && activeTab === 'transfers') {
      loadTransfers()
    } else if (open && teamId && activeTab === 'members') {
      loadMembers()
    }
  }, [activeTab, open, teamId])

  useEffect(() => {
    if (transferDialogOpen && teamId) {
      loadMembers()
    }
  }, [transferDialogOpen, teamId])

  // 搜索邀请用户（防抖）
  useEffect(() => {
    if (inviteSearchTimeoutRef.current) {
      clearTimeout(inviteSearchTimeoutRef.current)
    }

    if (inviteUserKeyword.trim()) {
      setIsSearchingInviteUser(true)
      inviteSearchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await getUserList({ page: 1, size: 20, keyword: inviteUserKeyword })
          if (response.code === 'success') {
            // 过滤掉已经是团队成员的用户
            const memberUserIds = members.map(m => m.userId)
            setInviteUsers(response.data.records.filter(u => !memberUserIds.includes(u.id)))
          }
        } catch {
          // Error handled by interceptor
        } finally {
          setIsSearchingInviteUser(false)
        }
      }, 300)
    } else {
      setInviteUsers([])
      setIsSearchingInviteUser(false)
    }

    return () => {
      if (inviteSearchTimeoutRef.current) {
        clearTimeout(inviteSearchTimeoutRef.current)
      }
    }
  }, [inviteUserKeyword, members])

  const loadTeamDetail = async () => {
    if (!teamId) return
    setLoading(true)
    try {
      const response = await getTeamDetail(teamId)
      if (response.code === 'success') {
        setTeam(response.data)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const loadQuotas = async () => {
    if (!teamId) return
    try {
      const [dailyRes, monthlyRes] = await Promise.all([
        getTeamDailyQuota(teamId),
        getTeamMonthlyQuota(teamId),
      ])
      if (dailyRes.code === 'success') {
        setDailyQuota(dailyRes.data)
      }
      if (monthlyRes.code === 'success') {
        setMonthlyQuota(monthlyRes.data)
      }
    } catch {
      // Error handled by interceptor
    }
  }

  const loadInvitations = async () => {
    if (!teamId) return
    try {
      const response = await getTeamInvitations(teamId, 1, 20)
      if (response.code === 'success') {
        setInvitations(response.data.records)
      }
    } catch {
      // Error handled by interceptor
    }
  }

  const loadTransfers = async () => {
    if (!teamId) return
    try {
      const response = await getTeamTransfers(teamId, 1, 20)
      if (response.code === 'success') {
        setTransfers(response.data.records)
      }
    } catch {
      // Error handled by interceptor
    }
  }

  const loadMembers = async () => {
    if (!teamId) return
    try {
      const response = await getTeamMembers(teamId)
      if (response.code === 'success') {
        setMembers(response.data)
      }
    } catch {
      // Error handled by interceptor
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !teamId) return
    try {
      const response = await uploadTeamLogo(teamId, file)
      if (response.code === 'success') {
        loadTeamDetail()
        onTeamUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSuspend = async () => {
    if (!teamId || !reason.trim()) return
    setSubmitting(true)
    try {
      const response = await suspendTeam(teamId, { reason })
      if (response.code === 'success') {
        setSuspendDialogOpen(false)
        setReason('')
        loadTeamDetail()
        onTeamUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnsuspend = async () => {
    if (!teamId) return
    setSubmitting(true)
    try {
      const response = await unsuspendTeam(teamId)
      if (response.code === 'success') {
        loadTeamDetail()
        onTeamUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleDisband = async () => {
    if (!teamId || !reason.trim()) return
    setSubmitting(true)
    try {
      const response = await disbandTeam(teamId, { reason })
      if (response.code === 'success') {
        setDisbandDialogOpen(false)
        setReason('')
        loadTeamDetail()
        onTeamUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleTransfer = async () => {
    if (!teamId || !transferUserId.trim()) return
    setSubmitting(true)
    try {
      const response = await transferTeam(teamId, {
        toUserId: Number(transferUserId),
        selfRole: transferSelfRole,
      })
      if (response.code === 'success') {
        setTransferDialogOpen(false)
        setTransferUserId('')
        setTransferSelfRole('ADMIN')
        loadTeamDetail()
        onTeamUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleInviteMember = async () => {
    if (!teamId || !selectedInviteUser) return
    setSubmitting(true)
    try {
      const response = await inviteTeamMember(teamId, selectedInviteUser.id)
      if (response.code === 'success') {
        setInviteDialogOpen(false)
        setSelectedInviteUser(null)
        setInviteUserKeyword('')
        loadMembers()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveMember = async () => {
    if (!teamId || !memberToRemove) return
    setSubmitting(true)
    try {
      const response = await removeTeamMember(teamId, memberToRemove.id)
      if (response.code === 'success') {
        setRemoveDialogOpen(false)
        setMemberToRemove(null)
        loadMembers()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const openRemoveDialog = (member: AdminTeamMemberVO) => {
    setMemberToRemove(member)
    setRemoveDialogOpen(true)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='w-full max-w-2xl overflow-y-auto p-0 sm:max-w-2xl'>
          <SheetHeader className='border-b px-6 py-4'>
            <SheetTitle>团队详情</SheetTitle>
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
          ) : team ? (
            <>
              {/* Team Header */}
              <div className='border-b bg-muted/30 px-6 py-6'>
                <div className='flex items-start gap-5'>
                  <div className='relative group'>
                    <Avatar className='h-20 w-20 ring-4 ring-background shadow-lg'>
                      <AvatarImage src={team.logoUrl || undefined} />
                      <AvatarFallback className='text-xl'>{team.name.slice(0, 2)}</AvatarFallback>
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
                      onChange={handleLogoUpload}
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3'>
                      <h3 className='text-xl font-semibold tracking-tight'>{team.name}</h3>
                      <Badge variant={team.status === 'ACTIVE' ? 'default' : team.status === 'DISBANDED' ? 'outline' : 'destructive'}>
                        {team.statusDesc}
                      </Badge>
                      <Badge variant='outline'>{team.teamType === 'PERSONAL' ? '个人团队' : team.teamType === 'TEAM' ? '协作团队' : team.teamType}</Badge>
                    </div>
                    <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                      <span>ID: {team.id}</span>
                      <CopyButton text={String(team.id)} />
                      <span>·</span>
                      <span>{team.teamCode}</span>
                      <CopyButton text={team.teamCode} />
                    </div>
                    {team.description && (
                      <p className='mt-2 text-sm text-muted-foreground'>{team.description}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='mt-5 flex flex-wrap gap-3'>
                  {team.status === 'ACTIVE' && (
                    <>
                      <Button
                        variant='outline'
                        className='border-destructive text-destructive hover:bg-destructive/10'
                        onClick={() => setSuspendDialogOpen(true)}
                      >
                        <Ban className='mr-2 h-4 w-4' />
                        冻结团队
                      </Button>
                      <Button
                        variant='outline'
                        className='border-destructive text-destructive hover:bg-destructive/10'
                        onClick={() => setDisbandDialogOpen(true)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        解散团队
                      </Button>
                      <Button variant='outline' onClick={() => setTransferDialogOpen(true)}>
                        <ArrowLeftRight className='mr-2 h-4 w-4' />
                        转让团队
                      </Button>
                    </>
                  )}
                  {team.status === 'SUSPENDED' && (
                    <Button
                      variant='outline'
                      onClick={handleUnsuspend}
                      disabled={submitting}
                    >
                      <Unlock className='mr-2 h-4 w-4' />
                      解冻团队
                    </Button>
                  )}
                </div>

                {/* Disbanded Info */}
                {team.status === 'DISBANDED' && team.disbandReason && (
                  <div className='mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3'>
                    <p className='text-sm font-medium text-destructive'>解散原因</p>
                    <p className='mt-1 text-sm text-muted-foreground'>{team.disbandReason}</p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      操作人: {team.disbandedByNickname} · 时间: {team.disbandedAt}
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
                  <TabsTrigger value='quota' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                    配额信息
                  </TabsTrigger>
                  <TabsTrigger value='invitations' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                    邀请列表
                  </TabsTrigger>
                  <TabsTrigger value='transfers' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                    转让记录
                  </TabsTrigger>
                  <TabsTrigger value='members' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                    成员列表
                  </TabsTrigger>
                </TabsList>

                {/* Info Tab */}
                <TabsContent value='info' className='mt-0 p-6'>
                  <div className='grid gap-6'>
                    <div>
                      <h4 className='mb-4 text-sm font-semibold'>订阅信息</h4>
                      <div className='grid grid-cols-2 gap-4'>
                        <InfoCard label='当前计划' value={team.currentPlanName} />
                        <InfoCard
                          label='订阅时间'
                          value={team.subscriptionStartTime ? `${team.subscriptionStartTime} - ${team.subscriptionEndTime || '永久'}` : null}
                        />
                        <InfoCard label='Stripe客户ID' value={team.stripeCustomerId} />
                        <InfoCard label='成员数量' value={team.memberCount} />
                      </div>
                    </div>

                    <div>
                      <h4 className='mb-4 text-sm font-semibold'>所有者信息</h4>
                      <div className='flex items-center gap-4 rounded-lg border bg-card p-4'>
                        <Avatar className='size-12'>
                          <AvatarImage src={team.ownerAvatarUrl || undefined} />
                          <AvatarFallback>{team.ownerNickname.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{team.ownerNickname}</p>
                          <p className='text-sm text-muted-foreground'>ID: {team.ownerId}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className='mb-4 text-sm font-semibold'>时间信息</h4>
                      <div className='grid grid-cols-2 gap-4'>
                        <InfoCard label='创建时间' value={team.createTime} />
                        <InfoCard label='更新时间' value={team.updateTime} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Quota Tab */}
                <TabsContent value='quota' className='mt-0 p-6'>
                  <div className='grid gap-4'>
                    <QuotaCard title='今日配额' quota={dailyQuota} />
                    <QuotaCard title='当月配额' quota={monthlyQuota} />
                  </div>
                </TabsContent>

                {/* Invitations Tab */}
                <TabsContent value='invitations' className='mt-0 p-6'>
                  <div className='space-y-3'>
                    {invitations.length === 0 ? (
                      <p className='text-center text-sm text-muted-foreground py-8'>暂无邀请记录</p>
                    ) : (
                      invitations.map((invitation) => (
                        <div key={invitation.id} className='rounded-lg border bg-card p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                                <Mail className='h-4 w-4 text-primary' />
                              </div>
                              <div>
                                <div className='flex items-center gap-2'>
                                  <Avatar className='size-6'>
                                    <AvatarImage src={invitation.fromUserAvatarUrl || undefined} />
                                    <AvatarFallback className='text-xs'>{invitation.fromUserNickname.slice(0, 1)}</AvatarFallback>
                                  </Avatar>
                                  <span className='text-sm'>{invitation.fromUserNickname}</span>
                                  <span className='text-muted-foreground'>→</span>
                                  <Avatar className='size-6'>
                                    <AvatarImage src={invitation.toUserAvatarUrl || undefined} />
                                    <AvatarFallback className='text-xs'>{invitation.toUserNickname.slice(0, 1)}</AvatarFallback>
                                  </Avatar>
                                  <span className='text-sm'>{invitation.toUserNickname}</span>
                                </div>
                              </div>
                            </div>
                            {getInvitationStatusBadge(invitation.status)}
                          </div>
                          <div className='mt-2 flex items-center gap-4 text-xs text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              {invitation.createTime}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Transfers Tab */}
                <TabsContent value='transfers' className='mt-0 p-6'>
                  <div className='space-y-3'>
                    {transfers.length === 0 ? (
                      <p className='text-center text-sm text-muted-foreground py-8'>暂无转让记录</p>
                    ) : (
                      transfers.map((transfer) => (
                        <div key={transfer.id} className='rounded-lg border bg-card p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                                <ArrowLeftRight className='h-4 w-4 text-primary' />
                              </div>
                              <div>
                                <div className='flex items-center gap-2'>
                                  <Avatar className='size-6'>
                                    <AvatarImage src={transfer.fromUserAvatarUrl || undefined} />
                                    <AvatarFallback className='text-xs'>{transfer.fromUserNickname.slice(0, 1)}</AvatarFallback>
                                  </Avatar>
                                  <span className='text-sm'>{transfer.fromUserNickname}</span>
                                  <span className='text-muted-foreground'>→</span>
                                  <Avatar className='size-6'>
                                    <AvatarImage src={transfer.toUserAvatarUrl || undefined} />
                                    <AvatarFallback className='text-xs'>{transfer.toUserNickname.slice(0, 1)}</AvatarFallback>
                                  </Avatar>
                                  <span className='text-sm'>{transfer.toUserNickname}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant='outline'>{getSelfRoleLabel(transfer.selfRole)}</Badge>
                          </div>
                          <div className='mt-2 flex items-center gap-4 text-xs text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              {transfer.createTime}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Members Tab */}
                <TabsContent value='members' className='mt-0 p-6'>
                  <div className='space-y-4'>
                    {/* 邀请按钮（个人团队不显示） */}
                    {team?.status === 'ACTIVE' && team?.teamType !== 'PERSONAL' && (
                      <Button
                        variant='outline'
                        className='w-full'
                        onClick={() => setInviteDialogOpen(true)}
                      >
                        <UserPlus className='mr-2 h-4 w-4' />
                        邀请人员加入团队
                      </Button>
                    )}

                    {/* 成员列表 */}
                    {members.length === 0 ? (
                      <p className='text-center text-sm text-muted-foreground py-8'>暂无成员</p>
                    ) : (
                      members.map((member) => (
                        <div key={member.id} className='rounded-lg border bg-card p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <Avatar className='size-10'>
                                <AvatarImage src={member.userAvatarUrl || undefined} />
                                <AvatarFallback>{member.userNickname.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className='flex items-center gap-2'>
                                  <span className='font-medium'>{member.userNickname}</span>
                                  <Badge variant={member.role === 'OWNER' ? 'default' : member.role === 'ADMIN' ? 'secondary' : 'outline'}>
                                    {member.roleDesc}
                                  </Badge>
                                </div>
                                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                  <span>ID: {member.userId}</span>
                                  {member.description && (
                                    <>
                                      <span>·</span>
                                      <span>{member.description}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* 移除按钮（所有者不可移除） */}
                            {member.role !== 'OWNER' && team?.status === 'ACTIVE' && (
                              <Button
                                variant='ghost'
                                size='icon'
                                className='text-destructive hover:text-destructive hover:bg-destructive/10'
                                onClick={() => openRemoveDialog(member)}
                              >
                                <UserMinus className='h-4 w-4' />
                              </Button>
                            )}
                          </div>
                          <div className='mt-2 flex items-center gap-4 text-xs text-muted-foreground'>
                            {member.inviterNickname && (
                              <span className='flex items-center gap-1'>
                                <Users className='h-3 w-3' />
                                邀请人: {member.inviterNickname}
                              </span>
                            )}
                            {member.joinedTime && (
                              <span className='flex items-center gap-1'>
                                <Calendar className='h-3 w-3' />
                                加入时间: {member.joinedTime}
                              </span>
                            )}
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
                <Ban className='h-5 w-5 text-destructive' />
              </div>
              冻结团队
            </DialogTitle>
            <DialogDescription>冻结后团队成员将无法使用团队功能</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>冻结原因 <span className='text-destructive'>*</span></Label>
              <Textarea
                className='mt-1.5'
                placeholder='请输入冻结原因...'
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
              disabled={!reason.trim() || submitting}
            >
              确认冻结
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disband Dialog */}
      <Dialog open={disbandDialogOpen} onOpenChange={setDisbandDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10'>
                <Trash2 className='h-5 w-5 text-destructive' />
              </div>
              解散团队
            </DialogTitle>
            <DialogDescription>解散后团队将无法恢复，请谨慎操作</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>解散原因 <span className='text-destructive'>*</span></Label>
              <Textarea
                className='mt-1.5'
                placeholder='请输入解散原因...'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDisbandDialogOpen(false)}>
              取消
            </Button>
            <Button
              variant='destructive'
              onClick={handleDisband}
              disabled={!reason.trim() || submitting}
            >
              确认解散
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                <ArrowLeftRight className='h-5 w-5 text-primary' />
              </div>
              转让团队
            </DialogTitle>
            <DialogDescription>将团队所有权转让给其他用户</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>新所有者 <span className='text-destructive'>*</span></Label>
              <Select value={transferUserId} onValueChange={setTransferUserId}>
                <SelectTrigger className='mt-1.5'>
                  <SelectValue placeholder='请选择新所有者' />
                </SelectTrigger>
                <SelectContent position='popper' sideOffset={4} align='start'>
                  {members.map((member) => (
                    <SelectItem
                      key={member.userId}
                      value={String(member.userId)}
                      disabled={member.userId === team?.ownerId}
                    >
                      <div className='flex items-center gap-2'>
                        <Avatar className='size-5'>
                          <AvatarImage src={member.userAvatarUrl || undefined} />
                          <AvatarFallback className='text-xs'>{member.userNickname.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <span>{member.userNickname}</span>
                        <span className='text-muted-foreground'>
                          ({member.userId === team?.ownerId ? '当前所有者' : member.roleDesc})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>原所有者角色</Label>
              <Select value={transferSelfRole} onValueChange={(v) => setTransferSelfRole(v as TransferSelfRole)}>
                <SelectTrigger className='mt-1.5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position='popper' sideOffset={4} align='start'>
                  <SelectItem value='ADMIN'>管理员</SelectItem>
                  <SelectItem value='MEMBER'>成员</SelectItem>
                  <SelectItem value='LEAVE'>离开</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setTransferDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!transferUserId || submitting}
            >
              确认转让
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                <UserPlus className='h-5 w-5 text-primary' />
              </div>
              邀请人员加入团队
            </DialogTitle>
            <DialogDescription>搜索并选择要邀请的用户</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            {/* 已选择的用户 */}
            {selectedInviteUser && (
              <div className='flex items-center justify-between rounded-lg border bg-muted/50 p-3'>
                <div className='flex items-center gap-3'>
                  <Avatar className='size-8'>
                    <AvatarImage src={selectedInviteUser.avatarUrl || undefined} />
                    <AvatarFallback>{selectedInviteUser.nickname?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium text-sm'>{selectedInviteUser.nickname}</p>
                    <p className='text-xs text-muted-foreground'>ID: {selectedInviteUser.id}</p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6'
                  onClick={() => setSelectedInviteUser(null)}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            )}

            {/* 搜索输入 */}
            {!selectedInviteUser && (
              <div className='space-y-3'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
                  <Input
                    placeholder='搜索用户昵称或邀请码'
                    value={inviteUserKeyword}
                    onChange={(e) => setInviteUserKeyword(e.target.value)}
                    className='pl-9 pr-9'
                  />
                  {isSearchingInviteUser && (
                    <LoaderCircle className='absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground' />
                  )}
                </div>

                {/* 搜索结果 */}
                <div className='max-h-48 overflow-y-auto rounded-lg border'>
                  {inviteUsers.length === 0 ? (
                    <p className='text-center text-sm text-muted-foreground py-6'>
                      {inviteUserKeyword ? '未找到用户' : '输入关键词搜索用户'}
                    </p>
                  ) : (
                    inviteUsers.map((user) => (
                      <button
                        key={user.id}
                        type='button'
                        className='flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-accent cursor-pointer border-b last:border-b-0'
                        onClick={() => {
                          setSelectedInviteUser(user)
                          setInviteUserKeyword('')
                        }}
                      >
                        <Avatar className='size-8'>
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback>{user.nickname?.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1 text-left'>
                          <p className='font-medium'>{user.nickname}</p>
                          <p className='text-xs text-muted-foreground'>ID: {user.id}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => {
              setInviteDialogOpen(false)
              setSelectedInviteUser(null)
              setInviteUserKeyword('')
            }}>
              取消
            </Button>
            <Button
              onClick={handleInviteMember}
              disabled={!selectedInviteUser || submitting}
            >
              确认邀请
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10'>
                <UserMinus className='h-5 w-5 text-destructive' />
              </div>
              移除团队成员
            </DialogTitle>
            <DialogDescription>
              确定要将 <span className='font-medium text-foreground'>{memberToRemove?.userNickname}</span> 从团队中移除吗？
            </DialogDescription>
          </DialogHeader>
          {memberToRemove && (
            <div className='flex items-center gap-3 rounded-lg border bg-muted/50 p-3'>
              <Avatar className='size-10'>
                <AvatarImage src={memberToRemove.userAvatarUrl || undefined} />
                <AvatarFallback>{memberToRemove.userNickname.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>{memberToRemove.userNickname}</p>
                <p className='text-xs text-muted-foreground'>
                  {memberToRemove.roleDesc} · ID: {memberToRemove.userId}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant='outline' onClick={() => {
              setRemoveDialogOpen(false)
              setMemberToRemove(null)
            }}>
              取消
            </Button>
            <Button
              variant='destructive'
              onClick={handleRemoveMember}
              disabled={submitting}
            >
              确认移除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
