import { useState, useEffect } from 'react'
import { Plus, UserPlus } from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { createAdmin, getAdminRoles } from '@/services/admin'
import type { AdminRoleCode, AdminRoleVO } from '@/types/admin'

interface CreateAdminDialogProps {
  onSuccess?: () => void
}

export function CreateAdminDialog({ onSuccess }: CreateAdminDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [roles, setRoles] = useState<AdminRoleVO[]>([])

  const [adminNo, setAdminNo] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleCode, setRoleCode] = useState<AdminRoleCode>('OPERATOR')
  const [remark, setRemark] = useState('')

  useEffect(() => {
    if (open) {
      loadRoles()
    }
  }, [open])

  const loadRoles = async () => {
    try {
      const res = await getAdminRoles()
      if (res.code === 'success') {
        setRoles(res.data)
      }
    } catch {
      // Error handled by interceptor
    }
  }

  const resetForm = () => {
    setAdminNo('')
    setNickname('')
    setEmail('')
    setPassword('')
    setRoleCode('OPERATOR')
    setRemark('')
  }

  const handleSubmit = async () => {
    if (!adminNo.trim() || !nickname.trim() || !email.trim()) return

    setSubmitting(true)
    try {
      const response = await createAdmin({
        adminNo: adminNo.trim(),
        nickname: nickname.trim(),
        email: email.trim(),
        password: password.trim() || undefined,
        roleCode,
        remark: remark.trim() || undefined,
      })
      if (response.code === 'success') {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          添加管理员
        </Button>
      </DialogTrigger>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <UserPlus className='h-5 w-5 text-primary' />
            </div>
            添加管理员
          </DialogTitle>
          <DialogDescription>创建新的管理员账号，初始密码将通过邮件发送</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label>工号 <span className='text-destructive'>*</span></Label>
            <Input
              className='mt-1.5'
              placeholder='请输入工号'
              value={adminNo}
              onChange={(e) => setAdminNo(e.target.value)}
              maxLength={50}
            />
          </div>
          <div>
            <Label>姓名/昵称 <span className='text-destructive'>*</span></Label>
            <Input
              className='mt-1.5'
              placeholder='请输入姓名/昵称'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={50}
            />
          </div>
          <div>
            <Label>登录邮箱 <span className='text-destructive'>*</span></Label>
            <Input
              className='mt-1.5'
              type='email'
              placeholder='请输入登录邮箱'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label>初始密码</Label>
            <Input
              className='mt-1.5'
              type='password'
              placeholder='留空则自动生成'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className='mt-1 text-xs text-muted-foreground'>留空则系统自动生成随机密码</p>
          </div>
          <div>
            <Label>角色 <span className='text-destructive'>*</span></Label>
            <Select value={roleCode} onValueChange={(v) => setRoleCode(v as AdminRoleCode)}>
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
          <div>
            <Label>备注</Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入备注信息（可选）'
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!adminNo.trim() || !nickname.trim() || !email.trim() || submitting}
          >
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
