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
import type { AdminTeamVO, TeamStatus, TeamType } from '@/types/team'

interface TeamTableProps {
  teams: AdminTeamVO[]
  loading: boolean
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
      return <Badge variant='outline'>个人</Badge>
    case 'ENTERPRISE':
      return <Badge variant='secondary'>企业</Badge>
    default:
      return <Badge variant='outline'>{type}</Badge>
  }
}

export function TeamTable({ teams, loading }: TeamTableProps) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-16'>ID</TableHead>
            <TableHead>团队</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>团队编码</TableHead>
            <TableHead>订阅计划</TableHead>
            <TableHead>所有者</TableHead>
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
              <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className='font-medium'>{team.id}</TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Avatar className='size-8'>
                      <AvatarImage src={team.logoUrl || undefined} />
                      <AvatarFallback>{team.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{team.name}</span>
                  </div>
                </TableCell>
                <TableCell>{getTeamTypeBadge(team.teamType)}</TableCell>
                <TableCell>
                  <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                    {team.teamCode}
                  </code>
                </TableCell>
                <TableCell>{team.currentPlanNameZh || '-'}</TableCell>
                <TableCell>{team.ownerNickname}</TableCell>
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
