import { useState, useEffect } from 'react'
import { Settings2 } from 'lucide-react'

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
import { NumberInputStacked } from '@/components/shadcn-studio/input/input-42'

import { adjustPoints } from '@/services/point'
import type { PointTeamVO } from '@/types/point'

interface AdjustPointsDialogProps {
  team: PointTeamVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AdjustPointsDialog({
  team,
  open,
  onOpenChange,
  onSuccess,
}: AdjustPointsDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [points, setPoints] = useState<number | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setPoints(null)
      setReason('')
    }
  }, [open])

  const handleSubmit = async () => {
    if (!team || points === null || points === 0 || !reason.trim()) return

    setSubmitting(true)
    try {
      const response = await adjustPoints({
        teamId: team.teamId,
        points: points,
        reason: reason.trim(),
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

  const isValid = points !== null && points !== 0 && reason.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <Settings2 className='h-5 w-5 text-primary' />
            </div>
            调整点数
          </DialogTitle>
          <DialogDescription>
            调整团队 {team?.teamName} 的点数（正数增加，负数扣减）
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>团队名称</Label>
              <Input
                className='mt-1.5'
                value={team?.teamName ?? ''}
                disabled
              />
            </div>
            <div>
              <Label>团队类型</Label>
              <Input
                className='mt-1.5'
                value={team?.teamTypeDesc ?? ''}
                disabled
              />
            </div>
          </div>
          <div>
            <Label>当前可用点数</Label>
            <Input
              className='mt-1.5'
              value={team?.availablePoints?.toLocaleString() ?? '0'}
              disabled
            />
          </div>
          <div>
            <NumberInputStacked
              label='调整点数'
              placeholder='正数增加，负数扣减'
              required
              value={points ?? undefined}
              onChange={setPoints}
            />
            {points !== null && points !== 0 && (
              <p className={`mt-1 text-sm ${points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {points > 0 ? `增加 ${points.toLocaleString()} 点` : `扣减 ${Math.abs(points).toLocaleString()} 点`}
              </p>
            )}
          </div>
          <div>
            <Label>调整原因 <span className='text-destructive'>*</span></Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入调整原因'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
            disabled={!isValid || submitting}
            variant={points !== null && points < 0 ? 'destructive' : 'default'}
          >
            确认调整
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
