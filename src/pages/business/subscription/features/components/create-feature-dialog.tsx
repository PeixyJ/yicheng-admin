import { useState, useEffect, useRef } from 'react'
import { Plus, Zap } from 'lucide-react'

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
import { Switch } from '@/components/ui/switch'

import { createFeature, checkFeatureCodeDuplicate } from '@/services/feature'
import type { FeatureType } from '@/types/feature'

interface CreateFeatureDialogProps {
  onSuccess?: () => void
}

export function CreateFeatureDialog({ onSuccess }: CreateFeatureDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [featureCode, setFeatureCode] = useState('')
  const [featureName, setFeatureName] = useState('')
  const [featureType, setFeatureType] = useState<FeatureType>('BOOLEAN')
  const [description, setDescription] = useState('')
  const [pointsCost, setPointsCost] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [status, setStatus] = useState(true)

  const [codeError, setCodeError] = useState('')
  const [checkingCode, setCheckingCode] = useState(false)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetForm = () => {
    setFeatureCode('')
    setFeatureName('')
    setFeatureType('BOOLEAN')
    setDescription('')
    setPointsCost('')
    setSortOrder('0')
    setStatus(true)
    setCodeError('')
  }

  useEffect(() => {
    if (!featureCode.trim()) {
      setCodeError('')
      return
    }

    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 设置新的定时器
    debounceTimerRef.current = setTimeout(async () => {
      setCheckingCode(true)
      try {
        const response = await checkFeatureCodeDuplicate(featureCode)
        if (response.code === 'success' && response.data) {
          setCodeError('功能编码已存在')
        } else {
          setCodeError('')
        }
      } catch {
        // Ignore error
      } finally {
        setCheckingCode(false)
      }
    }, 500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [featureCode])

  const handleSubmit = async () => {
    if (!featureCode.trim() || !featureName.trim() || codeError) return

    setSubmitting(true)
    try {
      const response = await createFeature({
        featureCode: featureCode.trim(),
        featureName: featureName.trim(),
        featureType,
        description: description.trim() || undefined,
        pointsCost: featureType === 'POINTS' && pointsCost ? Number(pointsCost) : undefined,
        sortOrder: sortOrder ? Number(sortOrder) : undefined,
        status,
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
          创建功能
        </Button>
      </DialogTrigger>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <Zap className='h-5 w-5 text-primary' />
            </div>
            创建功能
          </DialogTitle>
          <DialogDescription>创建一个新的功能配置</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label>功能编码 <span className='text-destructive'>*</span></Label>
            <Input
              className='mt-1.5'
              placeholder='如：AI_CHAT、FILE_EXPORT'
              value={featureCode}
              onChange={(e) => setFeatureCode(e.target.value.toUpperCase())}
              maxLength={50}
            />
            {checkingCode && (
              <p className='mt-1 text-xs text-muted-foreground'>检查中...</p>
            )}
            {codeError && (
              <p className='mt-1 text-xs text-destructive'>{codeError}</p>
            )}
          </div>
          <div>
            <Label>功能名称 <span className='text-destructive'>*</span></Label>
            <Input
              className='mt-1.5'
              placeholder='如：AI对话、文件导出'
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <Label>功能类型 <span className='text-destructive'>*</span></Label>
            <Select value={featureType} onValueChange={(v) => setFeatureType(v as FeatureType)}>
              <SelectTrigger className='mt-1.5'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='BOOLEAN'>开关型（有/无）</SelectItem>
                <SelectItem value='POINTS'>计量型（按次消耗点数）</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {featureType === 'POINTS' && (
            <div>
              <Label>每次消耗点数</Label>
              <Input
                className='mt-1.5'
                type='number'
                min={0}
                placeholder='请输入每次消耗的点数'
                value={pointsCost}
                onChange={(e) => setPointsCost(e.target.value)}
              />
            </div>
          )}
          <div>
            <Label>排序序号</Label>
            <Input
              className='mt-1.5'
              type='number'
              min={0}
              placeholder='数值越小排序越靠前'
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
          <div>
            <Label>功能描述</Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入功能描述（可选）'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label>启用状态</Label>
            <Switch checked={status} onCheckedChange={setStatus} />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!featureCode.trim() || !featureName.trim() || !!codeError || submitting}
          >
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
