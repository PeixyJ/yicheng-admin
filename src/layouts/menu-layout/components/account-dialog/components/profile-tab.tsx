import { useState, useRef } from 'react'
import { Camera, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { updateMyProfile, uploadAvatar } from '@/services/admin-me'
import type { AdminMeVO } from '@/types/admin-me'

interface ProfileTabProps {
  adminMe: AdminMeVO
  onUpdate: () => void
}

export function ProfileTab({ adminMe, onUpdate }: ProfileTabProps) {
  const [nickname, setNickname] = useState(adminMe.nickname)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件')
      return
    }

    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB')
      return
    }

    setUploading(true)
    try {
      const res = await uploadAvatar(file)
      if (res.code === 'success') {
        toast.success('头像上传成功')
        onUpdate()
      }
    } catch {
      toast.error('头像上传失败')
    } finally {
      setUploading(false)
      // 清空 input 以便可以再次选择同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSaveNickname = async () => {
    if (!nickname.trim()) {
      toast.error('昵称不能为空')
      return
    }

    if (nickname.trim() === adminMe.nickname) {
      toast.info('昵称未修改')
      return
    }

    setSaving(true)
    try {
      const res = await updateMyProfile({ nickname: nickname.trim() })
      if (res.code === 'success') {
        toast.success('昵称修改成功')
        onUpdate()
      }
    } catch {
      toast.error('昵称修改失败')
    } finally {
      setSaving(false)
    }
  }

  const getAvatarFallback = () => {
    return adminMe.nickname?.slice(0, 2).toUpperCase() || 'AD'
  }

  return (
    <div className='space-y-6'>
      {/* 头像区域 */}
      <div className='flex items-center gap-6'>
        <div className='relative group'>
          <Avatar className='h-20 w-20'>
            <AvatarImage src={adminMe.avatarUrl || undefined} alt={adminMe.nickname} />
            <AvatarFallback className='text-xl'>{getAvatarFallback()}</AvatarFallback>
          </Avatar>
          <button
            className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed'
            onClick={handleAvatarClick}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className='h-6 w-6 text-white animate-spin' />
            ) : (
              <Camera className='h-6 w-6 text-white' />
            )}
          </button>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className='text-sm font-medium'>点击头像更换</p>
          <p className='text-xs text-muted-foreground mt-1'>支持 JPG、PNG 格式，最大 5MB</p>
        </div>
      </div>

      {/* 基本信息表单 */}
      <div className='space-y-4'>
        <div>
          <Label className='text-muted-foreground'>工号</Label>
          <Input
            className='mt-1.5'
            value={adminMe.adminNo}
            disabled
          />
        </div>

        <div>
          <Label>昵称 <span className='text-destructive'>*</span></Label>
          <div className='flex gap-2 mt-1.5'>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder='请输入昵称'
              maxLength={50}
            />
            <Button onClick={handleSaveNickname} disabled={saving}>
              {saving ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Save className='h-4 w-4' />
              )}
              <span className='ml-1'>保存</span>
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label className='text-muted-foreground'>角色</Label>
            <Input
              className='mt-1.5'
              value={adminMe.roleName}
              disabled
            />
          </div>
          <div>
            <Label className='text-muted-foreground'>管理范围</Label>
            <Input
              className='mt-1.5'
              value={adminMe.scopeTypeDesc}
              disabled
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label className='text-muted-foreground'>状态</Label>
            <Input
              className='mt-1.5'
              value={adminMe.statusDesc}
              disabled
            />
          </div>
          <div>
            <Label className='text-muted-foreground'>创建时间</Label>
            <Input
              className='mt-1.5'
              value={adminMe.createTime}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  )
}
