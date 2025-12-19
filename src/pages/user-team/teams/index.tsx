import { useEffect, useState } from 'react'

import { TeamSearch } from './components/team-search'
import { TeamTable } from './components/team-table'
import { TeamDetailSheet } from './components/team-detail-sheet'
import { CreateTeamDialog } from './components/create-team-dialog'
import { Pagination } from '@/components/pagination'
import { getTeamList } from '@/services/team'
import type { AdminTeamVO, TeamStatus, TeamType } from '@/types/team'

const TeamsPage = () => {
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState<AdminTeamVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [keyword, setKeyword] = useState('')
  const [teamType, setTeamType] = useState<TeamType | ''>('')
  const [status, setStatus] = useState<TeamStatus | ''>('')
  const [ownerId, setOwnerId] = useState('')

  // 团队详情
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  const fetchTeams = async () => {
    setLoading(true)
    try {
      const res = await getTeamList({
        page,
        size: pageSize,
        keyword: keyword || undefined,
        teamType: teamType || undefined,
        status: status || undefined,
        ownerId: ownerId ? Number(ownerId) : undefined,
      })
      if (res.code === 'success') {
        setTeams(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchTeams()
  }

  const handleReset = () => {
    setKeyword('')
    setTeamType('')
    setStatus('')
    setOwnerId('')
    setPage(1)
    setTimeout(fetchTeams, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleTeamClick = (teamId: number) => {
    setSelectedTeamId(teamId)
    setDetailSheetOpen(true)
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>团队管理</h1>
        <CreateTeamDialog onSuccess={fetchTeams} />
      </div>

      <TeamSearch
        keyword={keyword}
        teamType={teamType}
        status={status}
        ownerId={ownerId}
        onKeywordChange={setKeyword}
        onTeamTypeChange={setTeamType}
        onStatusChange={setStatus}
        onOwnerIdChange={setOwnerId}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <TeamTable teams={teams} loading={loading} onTeamClick={handleTeamClick} />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <TeamDetailSheet
        teamId={selectedTeamId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onTeamUpdated={fetchTeams}
      />
    </div>
  )
}

export default TeamsPage
