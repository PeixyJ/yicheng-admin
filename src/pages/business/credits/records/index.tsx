import { useEffect, useState } from 'react'

import { PointTeamSearch } from './components/point-team-search'
import { PointTeamTable } from './components/point-team-table'
import { GrantPointsDialog } from './components/grant-points-dialog'
import { AdjustPointsDialog } from './components/adjust-points-dialog'
import { Pagination } from '@/components/pagination'
import { getPointTeamList } from '@/services/point'
import type { PointTeamVO } from '@/types/point'

const CreditRecordsPage = () => {
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState<PointTeamVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [teamId, setTeamId] = useState('')
  const [minAvailablePoints, setMinAvailablePoints] = useState('')
  const [maxAvailablePoints, setMaxAvailablePoints] = useState('')

  // 弹窗状态
  const [selectedTeam, setSelectedTeam] = useState<PointTeamVO | null>(null)
  const [grantDialogOpen, setGrantDialogOpen] = useState(false)
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)

  const fetchTeams = async () => {
    setLoading(true)
    try {
      const res = await getPointTeamList({
        page,
        size: pageSize,
        teamId: teamId ? Number(teamId) : undefined,
        minAvailablePoints: minAvailablePoints ? Number(minAvailablePoints) : undefined,
        maxAvailablePoints: maxAvailablePoints ? Number(maxAvailablePoints) : undefined,
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
    setTeamId('')
    setMinAvailablePoints('')
    setMaxAvailablePoints('')
    setPage(1)
    setTimeout(fetchTeams, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleGrant = (team: PointTeamVO) => {
    setSelectedTeam(team)
    setGrantDialogOpen(true)
  }

  const handleAdjust = (team: PointTeamVO) => {
    setSelectedTeam(team)
    setAdjustDialogOpen(true)
  }

  const handleSuccess = () => {
    fetchTeams()
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>点数管理</h1>


      <PointTeamSearch
        teamId={teamId}
        minAvailablePoints={minAvailablePoints}
        maxAvailablePoints={maxAvailablePoints}
        onTeamIdChange={setTeamId}
        onMinAvailablePointsChange={setMinAvailablePoints}
        onMaxAvailablePointsChange={setMaxAvailablePoints}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <PointTeamTable
        teams={teams}
        loading={loading}
        onGrant={handleGrant}
        onAdjust={handleAdjust}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <GrantPointsDialog
        team={selectedTeam}
        open={grantDialogOpen}
        onOpenChange={setGrantDialogOpen}
        onSuccess={handleSuccess}
      />

      <AdjustPointsDialog
        team={selectedTeam}
        open={adjustDialogOpen}
        onOpenChange={setAdjustDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

export default CreditRecordsPage
