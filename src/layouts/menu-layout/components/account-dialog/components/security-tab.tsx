import { useState } from 'react'
import { Key, Shield, ShieldCheck, ShieldOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { changePassword, setupMfa, setMfa } from '@/services/admin-me'
import type { AdminMeVO } from '@/types/admin-me'
import type { MfaSetupVO } from '@/types/admin'

interface SecurityTabProps {
  adminMe: AdminMeVO
  onUpdate: () => void
}

export function SecurityTab({ adminMe, onUpdate }: SecurityTabProps) {
  // 修改密码相关状态
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // MFA 相关状态
  const [mfaDialogOpen, setMfaDialogOpen] = useState(false)
  const [mfaSetupData, setMfaSetupData] = useState<MfaSetupVO | null>(null)
  const [mfaVerifyCode, setMfaVerifyCode] = useState('')
  const [settingMfa, setSettingMfa] = useState(false)
  const [loadingMfaSetup, setLoadingMfaSetup] = useState(false)

  // 处理修改密码
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('请填写所有密码字段')
      return
    }

    if (newPassword.length < 8) {
      toast.error('新密码长度至少 8 位')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('两次输入的新密码不一致')
      return
    }

    setChangingPassword(true)
    try {
      const res = await changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      })
      if (res.code === 'success') {
        toast.success('密码修改成功')
        setPasswordDialogOpen(false)
        resetPasswordForm()
      }
    } catch {
      toast.error('密码修改失败')
    } finally {
      setChangingPassword(false)
    }
  }

  const resetPasswordForm = () => {
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  // 处理启用 MFA
  const handleEnableMfa = async () => {
    setLoadingMfaSetup(true)
    try {
      const res = await setupMfa()
      if (res.code === 'success') {
        setMfaSetupData(res.data)
        setMfaDialogOpen(true)
      }
    } catch {
      toast.error('获取 MFA 设置失败')
    } finally {
      setLoadingMfaSetup(false)
    }
  }

  // 处理禁用 MFA
  const handleDisableMfa = () => {
    setMfaSetupData(null)
    setMfaDialogOpen(true)
  }

  // 确认 MFA 设置
  const handleConfirmMfa = async () => {
    if (!mfaVerifyCode || mfaVerifyCode.length !== 6) {
      toast.error('请输入 6 位验证码')
      return
    }

    setSettingMfa(true)
    try {
      const res = await setMfa({
        mfaEnabled: !adminMe.mfaEnabled,
        verifyCode: mfaVerifyCode,
      })
      if (res.code === 'success') {
        toast.success(adminMe.mfaEnabled ? 'MFA 已禁用' : 'MFA 已启用')
        setMfaDialogOpen(false)
        setMfaVerifyCode('')
        setMfaSetupData(null)
        onUpdate()
      }
    } catch {
      toast.error('MFA 设置失败')
    } finally {
      setSettingMfa(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* 密码设置 */}
      <div>
        <div className='flex items-center gap-2 mb-3'>
          <Key className='h-5 w-5 text-muted-foreground' />
          <h3 className='font-medium'>登录密码</h3>
        </div>
        <p className='text-sm text-muted-foreground mb-4'>
          定期更换密码可以提高账户安全性
        </p>
        <Button variant='outline' onClick={() => setPasswordDialogOpen(true)}>
          修改密码
        </Button>
      </div>

      <Separator />

      {/* MFA 设置 */}
      <div>
        <div className='flex items-center gap-2 mb-3'>
          <Shield className='h-5 w-5 text-muted-foreground' />
          <h3 className='font-medium'>两步验证 (2FA)</h3>
          {adminMe.mfaEnabled ? (
            <Badge variant='default' className='bg-green-500 hover:bg-green-600'>
              <ShieldCheck className='h-3 w-3 mr-1' />
              已启用
            </Badge>
          ) : (
            <Badge variant='secondary'>
              <ShieldOff className='h-3 w-3 mr-1' />
              未启用
            </Badge>
          )}
        </div>
        <p className='text-sm text-muted-foreground mb-4'>
          启用两步验证后，登录时需要输入 Authenticator App 生成的验证码
        </p>
        {adminMe.mfaEnabled ? (
          <Button variant='outline' onClick={handleDisableMfa}>
            禁用两步验证
          </Button>
        ) : (
          <Button onClick={handleEnableMfa} disabled={loadingMfaSetup}>
            {loadingMfaSetup && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
            启用两步验证
          </Button>
        )}
      </div>

      {/* 修改密码 Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                <Key className='h-5 w-5 text-primary' />
              </div>
              修改密码
            </DialogTitle>
            <DialogDescription>
              请输入当前密码和新密码
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>当前密码 <span className='text-destructive'>*</span></Label>
              <Input
                className='mt-1.5'
                type='password'
                placeholder='请输入当前密码'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div>
              <Label>新密码 <span className='text-destructive'>*</span></Label>
              <Input
                className='mt-1.5'
                type='password'
                placeholder='请输入新密码（至少 8 位）'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label>确认新密码 <span className='text-destructive'>*</span></Label>
              <Input
                className='mt-1.5'
                type='password'
                placeholder='请再次输入新密码'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setPasswordDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
              确认修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MFA 设置 Dialog */}
      <Dialog open={mfaDialogOpen} onOpenChange={setMfaDialogOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                <Shield className='h-5 w-5 text-primary' />
              </div>
              {adminMe.mfaEnabled ? '禁用两步验证' : '启用两步验证'}
            </DialogTitle>
            <DialogDescription>
              {adminMe.mfaEnabled
                ? '请输入 Authenticator App 中的验证码以确认身份'
                : '使用 Google Authenticator 或其他身份验证器扫描二维码'}
            </DialogDescription>
          </DialogHeader>

          {!adminMe.mfaEnabled && mfaSetupData && (
            <div className='space-y-4'>
              <div className='flex justify-center'>
                <img
                  src={mfaSetupData.qrCodeDataUri}
                  alt='MFA QR Code'
                  className='w-48 h-48 border rounded-lg'
                />
              </div>
              <div className='text-center'>
                <p className='text-sm text-muted-foreground mb-2'>
                  或手动输入密钥：
                </p>
                <code className='px-3 py-1.5 bg-muted rounded text-sm font-mono'>
                  {mfaSetupData.secret}
                </code>
              </div>
            </div>
          )}

          <div>
            <Label>验证码 <span className='text-destructive'>*</span></Label>
            <Input
              className='mt-1.5'
              placeholder='请输入 6 位验证码'
              value={mfaVerifyCode}
              onChange={(e) => setMfaVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
            />
            <p className='mt-1 text-xs text-muted-foreground'>
              请输入 Authenticator App 显示的 6 位数字验证码
            </p>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setMfaDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmMfa} disabled={settingMfa || mfaVerifyCode.length !== 6}>
              {settingMfa && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
              {adminMe.mfaEnabled ? '确认禁用' : '确认启用'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
