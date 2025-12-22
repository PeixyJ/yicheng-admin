import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Send } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { sendNotification } from '@/services/notification'
import { getTemplateList } from '@/services/notification-template'
import { getTeamList } from '@/services/team'
import { getUserList } from '@/services/user'
import type { NotificationTemplateVO, NotificationParam } from '@/types/notification-template'
import type { AdminTeamVO } from '@/types/team'
import type { AdminUserVO } from '@/types/user'
import type { NotificationSenderType } from '@/types/notification'

interface SendNotificationDialogProps {
  onSuccess?: () => void
}

export function SendNotificationDialog({ onSuccess }: SendNotificationDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 模板选择
  const [templateOpen, setTemplateOpen] = useState(false)
  const [templates, setTemplates] = useState<NotificationTemplateVO[]>([])
  const [templateSearch, setTemplateSearch] = useState('')
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplateVO | null>(null)

  // 用户选择
  const [userOpen, setUserOpen] = useState(false)
  const [users, setUsers] = useState<AdminUserVO[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [usersLoading, setUsersLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUserVO | null>(null)

  // 团队选择
  const [teamOpen, setTeamOpen] = useState(false)
  const [teams, setTeams] = useState<AdminTeamVO[]>([])
  const [teamSearch, setTeamSearch] = useState('')
  const [teamsLoading, setTeamsLoading] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<AdminTeamVO | null>(null)

  // 发送者配置
  const [senderType, setSenderType] = useState<NotificationSenderType>('SYSTEM')
  const [senderId, setSenderId] = useState('')

  // 模板参数
  const [params, setParams] = useState<Record<string, string>>({})

  // 解析模板参数定义
  const templateParams: NotificationParam[] = selectedTemplate?.params
    ? JSON.parse(selectedTemplate.params)
    : []

  // 搜索模板
  useEffect(() => {
    if (!templateOpen) return

    const searchTemplates = async () => {
      setTemplatesLoading(true)
      try {
        const res = await getTemplateList({
          page: 1,
          size: 50,
          name: templateSearch || undefined,
          status: true,
        })
        if (res.code === 'success') {
          setTemplates(res.data.records)
        }
      } catch {
        // Error handled by interceptor
      } finally {
        setTemplatesLoading(false)
      }
    }

    const debounce = setTimeout(searchTemplates, 300)
    return () => clearTimeout(debounce)
  }, [templateOpen, templateSearch])

  // 搜索用户
  useEffect(() => {
    if (!userOpen) return

    const searchUsers = async () => {
      setUsersLoading(true)
      try {
        const res = await getUserList({
          page: 1,
          size: 50,
          keyword: userSearch || undefined,
        })
        if (res.code === 'success') {
          setUsers(res.data.records)
        }
      } catch {
        // Error handled by interceptor
      } finally {
        setUsersLoading(false)
      }
    }

    const debounce = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounce)
  }, [userOpen, userSearch])

  // 搜索团队
  useEffect(() => {
    if (!teamOpen) return

    const searchTeams = async () => {
      setTeamsLoading(true)
      try {
        const res = await getTeamList({
          page: 1,
          size: 50,
          keyword: teamSearch || undefined,
        })
        if (res.code === 'success') {
          setTeams(res.data.records)
        }
      } catch {
        // Error handled by interceptor
      } finally {
        setTeamsLoading(false)
      }
    }

    const debounce = setTimeout(searchTeams, 300)
    return () => clearTimeout(debounce)
  }, [teamOpen, teamSearch])

  // 当选择模板时，初始化参数
  useEffect(() => {
    if (selectedTemplate) {
      const initialParams: Record<string, string> = {}
      templateParams.forEach((param) => {
        initialParams[param.name] = ''
      })
      setParams(initialParams)
    } else {
      setParams({})
    }
  }, [selectedTemplate?.id])

  const resetForm = () => {
    setSelectedTemplate(null)
    setSelectedUser(null)
    setSelectedTeam(null)
    setSenderType('SYSTEM')
    setSenderId('')
    setParams({})
    setTemplateSearch('')
    setUserSearch('')
    setTeamSearch('')
  }

  const handleSubmit = async () => {
    if (!selectedTemplate || !selectedUser) return

    setSubmitting(true)
    try {
      const paramsObj: Record<string, unknown> = {}
      Object.entries(params).forEach(([key, value]) => {
        if (value) paramsObj[key] = value
      })

      const res = await sendNotification({
        templateCode: selectedTemplate.code,
        userId: selectedUser.id,
        teamId: selectedTeam?.id,
        params: Object.keys(paramsObj).length > 0 ? paramsObj : undefined,
        senderType,
        senderId: senderType === 'USER' && senderId ? Number(senderId) : undefined,
      })

      if (res.code === 'success') {
        setOpen(false)
        resetForm()
        onSuccess?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const isValid = selectedTemplate && selectedUser

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className='mr-2 size-4' />
          发送通知
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-lg' onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <Send className='h-5 w-5 text-primary' />
            </div>
            手动发送通知
          </DialogTitle>
          <DialogDescription>选择通知模板和接收用户，发送自定义通知</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-2'>
          {/* 模板选择 */}
          <div>
            <Label>
              通知模板 <span className='text-destructive'>*</span>
            </Label>
            <Popover open={templateOpen} onOpenChange={setTemplateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={templateOpen}
                  className={cn(
                    'w-full justify-between font-normal mt-1.5',
                    !selectedTemplate && 'text-muted-foreground'
                  )}
                >
                  <span className='truncate'>
                    {selectedTemplate ? selectedTemplate.name : '选择通知模板'}
                  </span>
                  <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-(--radix-popover-trigger-width)! p-0'
                align='start'
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder='搜索模板名称...'
                    value={templateSearch}
                    onValueChange={setTemplateSearch}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                  <CommandList>
                    {templatesLoading ? (
                      <CommandEmpty>加载中...</CommandEmpty>
                    ) : templates.length === 0 ? (
                      <CommandEmpty>未找到模板</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {templates.map((template) => (
                          <CommandItem
                            key={template.id}
                            value={String(template.id)}
                            onSelect={() => {
                              setSelectedTemplate(template)
                              setTemplateOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 size-4 shrink-0',
                                selectedTemplate?.id === template.id ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            <div className='flex flex-col min-w-0'>
                              <span className='truncate'>{template.name}</span>
                              <span className='text-xs text-muted-foreground truncate'>
                                {template.code} · {template.parentType}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* 用户选择 */}
          <div>
            <Label>
              接收用户 <span className='text-destructive'>*</span>
            </Label>
            <Popover open={userOpen} onOpenChange={setUserOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={userOpen}
                  className={cn(
                    'w-full justify-between font-normal mt-1.5',
                    !selectedUser && 'text-muted-foreground'
                  )}
                >
                  {selectedUser ? (
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-5'>
                        <AvatarImage src={selectedUser.avatarUrl || undefined} />
                        <AvatarFallback className='text-xs'>
                          {selectedUser.nickname.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='truncate'>{selectedUser.nickname}</span>
                    </div>
                  ) : (
                    <span>选择接收用户</span>
                  )}
                  <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-(--radix-popover-trigger-width)! p-0'
                align='start'
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder='搜索用户昵称...'
                    value={userSearch}
                    onValueChange={setUserSearch}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                  <CommandList>
                    {usersLoading ? (
                      <CommandEmpty>加载中...</CommandEmpty>
                    ) : users.length === 0 ? (
                      <CommandEmpty>未找到用户</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={String(user.id)}
                            onSelect={() => {
                              setSelectedUser(user)
                              setUserOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 size-4 shrink-0',
                                selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            <Avatar className='mr-2 size-6 shrink-0'>
                              <AvatarImage src={user.avatarUrl || undefined} />
                              <AvatarFallback className='text-xs'>
                                {user.nickname.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col min-w-0'>
                              <span className='truncate'>{user.nickname}</span>
                              <span className='text-xs text-muted-foreground truncate'>
                                ID: {user.id}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* 团队选择 */}
          <div>
            <Label>所属团队</Label>
            <Popover open={teamOpen} onOpenChange={setTeamOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={teamOpen}
                  className={cn(
                    'w-full justify-between font-normal mt-1.5',
                    !selectedTeam && 'text-muted-foreground'
                  )}
                >
                  {selectedTeam ? (
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-5'>
                        <AvatarImage src={selectedTeam.logoUrl || undefined} />
                        <AvatarFallback className='text-xs'>
                          {selectedTeam.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='truncate'>{selectedTeam.name}</span>
                    </div>
                  ) : (
                    <span>选择团队（可选）</span>
                  )}
                  <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-(--radix-popover-trigger-width)! p-0'
                align='start'
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder='搜索团队名称...'
                    value={teamSearch}
                    onValueChange={setTeamSearch}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                  <CommandList>
                    {teamsLoading ? (
                      <CommandEmpty>加载中...</CommandEmpty>
                    ) : teams.length === 0 ? (
                      <CommandEmpty>未找到团队</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        <CommandItem
                          value='none'
                          onSelect={() => {
                            setSelectedTeam(null)
                            setTeamOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 size-4 shrink-0',
                              !selectedTeam ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          不选择团队
                        </CommandItem>
                        {teams.map((team) => (
                          <CommandItem
                            key={team.id}
                            value={String(team.id)}
                            onSelect={() => {
                              setSelectedTeam(team)
                              setTeamOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 size-4 shrink-0',
                                selectedTeam?.id === team.id ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            <Avatar className='mr-2 size-6 shrink-0'>
                              <AvatarImage src={team.logoUrl || undefined} />
                              <AvatarFallback className='text-xs'>
                                {team.name.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col min-w-0'>
                              <span className='truncate'>{team.name}</span>
                              <span className='text-xs text-muted-foreground truncate'>
                                {team.teamCode}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* 发送者配置 */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>发送者类型</Label>
              <Select value={senderType} onValueChange={(v) => setSenderType(v as NotificationSenderType)}>
                <SelectTrigger className='mt-1.5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='SYSTEM'>系统</SelectItem>
                  <SelectItem value='USER'>用户</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {senderType === 'USER' && (
              <div>
                <Label>发送者用户ID</Label>
                <Input
                  className='mt-1.5'
                  placeholder='输入用户ID'
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* 模板参数 */}
          {templateParams.length > 0 && (
            <div className='space-y-3'>
              <Label className='text-sm font-medium'>模板参数</Label>
              <div className='space-y-3 rounded-lg border p-3'>
                {templateParams.map((param) => (
                  <div key={param.name}>
                    <Label className='text-sm'>
                      {param.name}
                      {param.required && <span className='text-destructive ml-0.5'>*</span>}
                      <span className='ml-2 text-xs text-muted-foreground'>({param.type})</span>
                    </Label>
                    <Input
                      className='mt-1'
                      placeholder={`输入 ${param.name}`}
                      value={params[param.name] || ''}
                      onChange={(e) =>
                        setParams((prev) => ({ ...prev, [param.name]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || submitting}>
            {submitting ? '发送中...' : '发送通知'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
