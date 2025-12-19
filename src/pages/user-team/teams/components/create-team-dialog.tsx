import { useState } from 'react'
import { Plus, Users } from 'lucide-react'

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

import { createTeam } from '@/services/team'
import type { TeamType } from '@/types/team'

interface CreateTeamDialogProps {
  onSuccess?: () => void
}

export function CreateTeamDialog({ onSuccess }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [teamType, setTeamType] = useState<TeamType>('TEAM')
  const [ownerId, setOwnerId] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [description, setDescription] = useState('')

  const resetForm = () => {
    setName('')
    setTeamType('TEAM')
    setOwnerId('')
    setLogoUrl('')
    setDescription('')
  }

  const handleSubmit = async () => {
    if (!name.trim() || !ownerId.trim()) return

    setSubmitting(true)
    try {
      const response = await createTeam({
        name: name.trim(),
        teamType,
        ownerId: Number(ownerId),
        logoUrl: logoUrl.trim() || undefined,
        description: description.trim() || undefined,
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
          创建团队
        </Button>
      </DialogTrigger>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <Users className='h-5 w-5 text-primary' />
            </div>
            创建团队
          </DialogTitle>
          <DialogDescription>创建一个新的团队</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label>团队名称 <span className='text-destructive'>*</span></Label>
            <Input
              className='mt-1.5'
              placeholder='请输入团队名称'
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <Label>团队类型 <span className='text-destructive'>*</span></Label>
            <Select value={teamType} onValueChange={(v) => setTeamType(v as TeamType)}>
              <SelectTrigger className='mt-1.5'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='TEAM'>协作团队</SelectItem>
                <SelectItem value='PERSONAL'>个人团队</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>所有者用户ID <span className='text-destructive'>*</span></Label>
            <Input
              className='mt-1.5'
              placeholder='请输入用户ID'
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
            />
          </div>
          <div>
            <Label>团队Logo URL</Label>
            <Input
              className='mt-1.5'
              placeholder='请输入Logo URL（可选）'
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>
          <div>
            <Label>团队描述</Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入团队描述（可选）'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            disabled={!name.trim() || !ownerId.trim() || submitting}
          >
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
