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
  const [points, setPoints] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setPoints('')
      setReason('')
    }
  }, [open])

  const handleSubmit = async () => {
    if (!team || !points || !reason.trim()) return

    setSubmitting(true)
    try {
      const response = await adjustPoints({
        teamId: team.teamId,
        points: Number(points),
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

  const pointsNum = Number(points)
  const isValid = points && pointsNum !== 0 && reason.trim()

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
            调整团队 {team?.teamId} 的点数（正数增加，负数扣减）
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label>团队ID</Label>
            <Input
              className='mt-1.5'
              value={team?.teamId ?? ''}
              disabled
            />
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
            <Label>调整点数 <span className='text-destructive'>*</span></Label>
            <Input
              className='mt-1.5'
              type='number'
              placeholder='正数增加，负数扣减'
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
            {points && pointsNum !== 0 && (
              <p className={`mt-1 text-sm ${pointsNum > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {pointsNum > 0 ? `增加 ${pointsNum.toLocaleString()} 点` : `扣减 ${Math.abs(pointsNum).toLocaleString()} 点`}
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
            variant={pointsNum < 0 ? 'destructive' : 'default'}
          >
            确认调整
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
