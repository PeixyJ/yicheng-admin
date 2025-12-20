import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { AdminTeamVO, TeamStatus, TeamType } from '@/types/team'

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

interface TeamTableProps {
  teams: AdminTeamVO[]
  loading: boolean
  onTeamClick?: (teamId: number) => void
}

function getStatusBadge(status: TeamStatus) {
  switch (status) {
    case 'PENDING':
      return <Badge variant='secondary'>待激活</Badge>
    case 'ACTIVE':
      return <Badge variant='default'>正常</Badge>
    case 'SUSPENDED':
      return <Badge variant='destructive'>已冻结</Badge>
    case 'DISBANDED':
      return <Badge variant='outline'>已解散</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

function getTeamTypeBadge(type: TeamType) {
  switch (type) {
    case 'PERSONAL':
      return <Badge variant='outline'>个人团队</Badge>
    case 'TEAM':
      return <Badge variant='secondary'>协作团队</Badge>
    default:
      return <Badge variant='outline'>{type}</Badge>
  }
}

export function TeamTable({ teams, loading, onTeamClick }: TeamTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>团队</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>团队编码</TableHead>
            <TableHead>计划编码</TableHead>
            <TableHead>所有者</TableHead>
            <TableHead>可用点数</TableHead>
            <TableHead>当日配额</TableHead>
            <TableHead>当月配额</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className='h-4 w-8' />
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='size-8 rounded-full' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-16' />
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='size-6 rounded-full' />
                    <Skeleton className='h-4 w-16' />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-14' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>
              </TableRow>
            ))
          ) : teams.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className='font-medium'>
                  <div className='group flex items-center gap-1'>
                    <span>{team.id}</span>
                    <CopyButton text={String(team.id)} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-2'>
                    <div
                      className='flex items-center gap-2 cursor-pointer hover:text-primary transition-colors'
                      onClick={() => onTeamClick?.(team.id)}
                    >
                      <Avatar className='size-8'>
                        <AvatarImage src={team.logoUrl || undefined} />
                        <AvatarFallback>{team.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{team.name}</span>
                    </div>
                    <CopyButton text={team.name} />
                  </div>
                </TableCell>
                <TableCell>{getTeamTypeBadge(team.teamType)}</TableCell>
                <TableCell>
                  <div className='group flex items-center gap-1'>
                    <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                      {team.teamCode}
                    </code>
                    <CopyButton text={team.teamCode} />
                  </div>
                </TableCell>
                <TableCell>
                  {team.currentPlanCode ? (
                    <div className='group flex items-center gap-1'>
                      <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                        {team.currentPlanCode}
                      </code>
                      <CopyButton text={team.currentPlanCode} />
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <div className='group flex items-center gap-2'>
                    <Avatar className='size-6'>
                      <AvatarImage src={team.ownerAvatarUrl || undefined} />
                      <AvatarFallback className='text-xs'>{team.ownerNickname.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span>{team.ownerNickname}</span>
                    <CopyButton text={team.ownerNickname} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className='font-medium'>{team.availablePoints?.toLocaleString() ?? '-'}</span>
                </TableCell>
                <TableCell>
                  {team.dailyQuotaTotal != null ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='h-2 w-16 rounded-full bg-muted cursor-default'>
                          <div
                            className='h-full rounded-full bg-primary transition-all'
                            style={{ width: `${team.dailyQuotaTotal > 0 ? Math.min(((team.dailyQuotaUsed ?? 0) / team.dailyQuotaTotal) * 100, 100) : 0}%` }}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {(team.dailyQuotaUsed ?? 0).toLocaleString()}/{team.dailyQuotaTotal.toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {team.monthlyQuotaTotal != null ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='h-2 w-16 rounded-full bg-muted cursor-default'>
                          <div
                            className='h-full rounded-full bg-primary transition-all'
                            style={{ width: `${team.monthlyQuotaTotal > 0 ? Math.min(((team.monthlyQuotaUsed ?? 0) / team.monthlyQuotaTotal) * 100, 100) : 0}%` }}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {(team.monthlyQuotaUsed ?? 0).toLocaleString()}/{team.monthlyQuotaTotal.toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  ) : '-'}
                </TableCell>
                <TableCell>{getStatusBadge(team.status)}</TableCell>
                <TableCell>{team.createTime}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
