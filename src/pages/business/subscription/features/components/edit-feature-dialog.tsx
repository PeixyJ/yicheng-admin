import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { updateFeature } from '@/services/feature'
import type { FeatureVO, FeatureType } from '@/types/feature'

interface EditFeatureDialogProps {
  feature: FeatureVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditFeatureDialog({
  feature,
  open,
  onOpenChange,
  onSuccess,
}: EditFeatureDialogProps) {
  const [submitting, setSubmitting] = useState(false)

  const [featureName, setFeatureName] = useState('')
  const [featureType, setFeatureType] = useState<FeatureType>('BOOLEAN')
  const [description, setDescription] = useState('')
  const [pointsCost, setPointsCost] = useState('')
  const [sortOrder, setSortOrder] = useState('0')

  // 当 feature 变化时，初始化表单
  useEffect(() => {
    if (feature) {
      setFeatureName(feature.featureName)
      setFeatureType(feature.featureType)
      setDescription(feature.description || '')
      setPointsCost(feature.pointsCost?.toString() || '')
      setSortOrder(feature.sortOrder.toString())
    }
  }, [feature])

  const handleSubmit = async () => {
    if (!feature || !featureName.trim()) return

    setSubmitting(true)
    try {
      const response = await updateFeature(feature.id, {
        featureName: featureName.trim(),
        featureType,
        description: description.trim() || undefined,
        pointsCost: featureType === 'POINTS' && pointsCost ? Number(pointsCost) : undefined,
        sortOrder: sortOrder ? Number(sortOrder) : undefined,
      })
      if (response.code === 'success') {
        onOpenChange(false)
        onSuccess?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <Pencil className='h-5 w-5 text-primary' />
            </div>
            编辑功能
          </DialogTitle>
          <DialogDescription>
            修改功能配置信息，功能编码不可修改
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label>功能编码</Label>
            <Input
              className='mt-1.5'
              value={feature?.featureCode || ''}
              disabled
            />
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
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!featureName.trim() || submitting}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
