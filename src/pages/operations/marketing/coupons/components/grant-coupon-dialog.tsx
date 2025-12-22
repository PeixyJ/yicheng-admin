import { useState, useEffect } from 'react'
import { Gift, Loader2 } from 'lucide-react'

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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { grantCoupons } from '@/services/coupon'
import { getCouponTemplateList } from '@/services/coupon-template'
import type { CouponSource } from '@/types/coupon'
import type { CouponTemplateVO } from '@/types/coupon-template'

interface GrantCouponDialogProps {
  onSuccess?: () => void
}

export function GrantCouponDialog({ onSuccess }: GrantCouponDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [templates, setTemplates] = useState<CouponTemplateVO[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)

  const [templateId, setTemplateId] = useState('')
  const [targetType, setTargetType] = useState<'team' | 'user'>('team')
  const [teamIds, setTeamIds] = useState('')
  const [userIds, setUserIds] = useState('')
  const [source, setSource] = useState<CouponSource>('SYSTEM_GRANT')
  const [grantReason, setGrantReason] = useState('')

  // 加载优惠券模板列表
  useEffect(() => {
    if (open) {
      setLoadingTemplates(true)
      getCouponTemplateList({ page: 1, size: 100, status: true })
        .then((res) => {
          if (res.code === 'success' && res.data?.records) {
            setTemplates(res.data.records)
          }
        })
        .finally(() => {
          setLoadingTemplates(false)
        })
    }
  }, [open])

  const resetForm = () => {
    setTemplateId('')
    setTargetType('team')
    setTeamIds('')
    setUserIds('')
    setSource('SYSTEM_GRANT')
    setGrantReason('')
  }

  const handleSubmit = async () => {
    if (!templateId.trim()) return

    const teamIdList = teamIds
      .split(/[,，\n]/)
      .map((id) => id.trim())
      .filter((id) => id)
      .map(Number)
      .filter((id) => !isNaN(id))

    const userIdList = userIds
      .split(/[,，\n]/)
      .map((id) => id.trim())
      .filter((id) => id)
      .map(Number)
      .filter((id) => !isNaN(id))

    if (targetType === 'team' && teamIdList.length === 0) return
    if (targetType === 'user' && userIdList.length === 0) return

    setSubmitting(true)
    try {
      const response = await grantCoupons({
        templateId: Number(templateId),
        teamIds: targetType === 'team' ? teamIdList : undefined,
        userIds: targetType === 'user' ? userIdList : undefined,
        source,
        grantReason: grantReason.trim() || undefined,
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

  const isValid =
    templateId.trim() &&
    ((targetType === 'team' && teamIds.trim()) ||
      (targetType === 'user' && userIds.trim()))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Gift className='mr-2 size-4' />
          发放优惠券
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md' onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <Gift className='h-5 w-5 text-primary' />
            </div>
            批量发放优惠券
          </DialogTitle>
          <DialogDescription>选择优惠券模板并指定发放目标</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* 模板选择 */}
          <div>
            <Label>
              优惠券模板 <span className='text-destructive'>*</span>
            </Label>
            <Select value={templateId} onValueChange={setTemplateId} disabled={loadingTemplates}>
              <SelectTrigger className='mt-1.5'>
                {loadingTemplates ? (
                  <span className='flex items-center gap-2 text-muted-foreground'>
                    <Loader2 className='size-4 animate-spin' />
                    加载中...
                  </span>
                ) : (
                  <SelectValue placeholder='请选择优惠券模板' />
                )}
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={String(template.id)}>
                    {template.name}
                    <span className='ml-2 text-muted-foreground'>
                      ({template.discountTypeDesc})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 发放目标类型 */}
          <div>
            <Label>发放目标</Label>
            <RadioGroup
              className='mt-1.5 flex gap-4'
              value={targetType}
              onValueChange={(v) => setTargetType(v as 'team' | 'user')}
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='team' id='team' />
                <Label htmlFor='team' className='font-normal cursor-pointer'>
                  按团队发放
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='user' id='user' />
                <Label htmlFor='user' className='font-normal cursor-pointer'>
                  按用户发放
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 团队ID列表 */}
          {targetType === 'team' && (
            <div>
              <Label>
                团队ID列表 <span className='text-destructive'>*</span>
              </Label>
              <Textarea
                className='mt-1.5'
                placeholder='请输入团队ID，多个ID用逗号或换行分隔'
                value={teamIds}
                onChange={(e) => setTeamIds(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* 用户ID列表 */}
          {targetType === 'user' && (
            <div>
              <Label>
                用户ID列表 <span className='text-destructive'>*</span>
              </Label>
              <Textarea
                className='mt-1.5'
                placeholder='请输入用户ID，多个ID用逗号或换行分隔'
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* 优惠券来源 */}
          <div>
            <Label>
              优惠券来源 <span className='text-destructive'>*</span>
            </Label>
            <Select value={source} onValueChange={(v) => setSource(v as CouponSource)}>
              <SelectTrigger className='mt-1.5'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='SYSTEM_GRANT'>系统发放</SelectItem>
                <SelectItem value='ACTIVITY'>活动</SelectItem>
                <SelectItem value='PROMO_CODE'>优惠码</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 发放原因 */}
          <div>
            <Label>发放原因</Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入发放原因（选填，最多200字）'
              value={grantReason}
              onChange={(e) => setGrantReason(e.target.value.slice(0, 200))}
              rows={2}
            />
            <p className='mt-1 text-xs text-muted-foreground text-right'>
              {grantReason.length}/200
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || submitting}>
            {submitting ? '发放中...' : '确认发放'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
