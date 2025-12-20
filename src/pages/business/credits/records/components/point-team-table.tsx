import { useState } from 'react'
import { Check, Copy, Gift, Settings2 } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { PointTeamVO } from '@/types/point'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-6 opacity-0 group-hover:opacity-100 transition-opacity'
      onClick={handleCopy}
    >
      {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
    </Button>
  )
}

interface PointTeamTableProps {
  teams: PointTeamVO[]
  loading: boolean
  onGrant?: (team: PointTeamVO) => void
  onAdjust?: (team: PointTeamVO) => void
}

export function PointTeamTable({
  teams,
  loading,
  onGrant,
  onAdjust,
}: PointTeamTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-24'>团队ID</TableHead>
            <TableHead className='w-32'>总点数</TableHead>
            <TableHead className='w-32'>已用点数</TableHead>
            <TableHead className='w-32'>可用点数</TableHead>
            <TableHead className='w-32'>冻结点数</TableHead>
            <TableHead className='w-40'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                <TableCell><Skeleton className='h-8 w-32' /></TableCell>
              </TableRow>
            ))
          ) : teams.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <span className='font-medium'>{team.teamId}</span>
                    <CopyButton text={String(team.teamId)} />
                  </div>
                </TableCell>
                <TableCell>
                  <span>{team.totalPoints.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <span className='text-muted-foreground'>{team.usedPoints.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <span className='font-semibold text-primary'>{team.availablePoints.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  {team.frozenPoints > 0 ? (
                    <span className='text-amber-600'>{team.frozenPoints.toLocaleString()}</span>
                  ) : (
                    <span className='text-muted-foreground'>0</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onGrant?.(team)}
                    >
                      <Gift className='mr-1 size-3.5' />
                      赠送
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onAdjust?.(team)}
                    >
                      <Settings2 className='mr-1 size-3.5' />
                      调整
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
