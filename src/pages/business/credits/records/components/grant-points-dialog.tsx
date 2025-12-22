import { useState, useEffect } from 'react'
import { Gift } from 'lucide-react'

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

import { grantPoints } from '@/services/point'
import type { PointTeamVO } from '@/types/point'

interface GrantPointsDialogProps {
  team: PointTeamVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function GrantPointsDialog({
  team,
  open,
  onOpenChange,
  onSuccess,
}: GrantPointsDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [points, setPoints] = useState<number | null>(null)
  const [validDays, setValidDays] = useState<number | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setPoints(null)
      setValidDays(null)
      setReason('')
    }
  }, [open])

  const handleSubmit = async () => {
    if (!team || !points || !reason.trim()) return

    setSubmitting(true)
    try {
      const response = await grantPoints({
        teamId: team.teamId,
        points: points,
        validDays: validDays ?? undefined,
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

  const isValid = points && points > 0 && reason.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10'>
              <Gift className='h-5 w-5 text-green-500' />
            </div>
            赠送点数
          </DialogTitle>
          <DialogDescription>
            向团队 {team?.teamName} 赠送点数
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
          <NumberInputStacked
            label='赠送点数'
            placeholder='请输入赠送点数'
            required
            value={points ?? undefined}
            onChange={setPoints}
            minValue={1}
          />
          <NumberInputStacked
            label='有效天数'
            placeholder='留空表示永不过期'
            value={validDays ?? undefined}
            onChange={setValidDays}
            minValue={1}
          />
          <div>
            <Label>赠送原因 <span className='text-destructive'>*</span></Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入赠送原因'
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
          >
            确认赠送
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
