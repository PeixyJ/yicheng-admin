import { useEffect, useState } from 'react'

import { SubscribeSearch } from './components/subscribe-search'
import { SubscribeTable } from './components/subscribe-table'
import { GiftSubscribeDialog } from './components/gift-subscribe-dialog'
import { UpgradeSubscribeDialog } from './components/upgrade-subscribe-dialog'
import { CancelSubscribeDialog } from './components/cancel-subscribe-dialog'
import { Pagination } from '@/components/pagination'
import { getSubscribeList } from '@/services/subscribe'
import type { AdminSubscribeVO, SubscribeStatus, SubscribeSource } from '@/types/subscribe'

const SubscriptionsPage = () => {
  const [loading, setLoading] = useState(false)
  const [subscribes, setSubscribes] = useState<AdminSubscribeVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [teamId, setTeamId] = useState('')
  const [planId, setPlanId] = useState('')
  const [status, setStatus] = useState<SubscribeStatus | ''>('')
  const [source, setSource] = useState<SubscribeSource | ''>('')

  // 升级订阅对话框
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [upgradeSubscribe, setUpgradeSubscribe] = useState<AdminSubscribeVO | null>(null)

  // 取消订阅对话框
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelSubscribe, setCancelSubscribe] = useState<AdminSubscribeVO | null>(null)

  const fetchSubscribes = async () => {
    setLoading(true)
    try {
      const res = await getSubscribeList({
        page,
        size: pageSize,
        teamId: teamId ? Number(teamId) : undefined,
        planId: planId ? Number(planId) : undefined,
        status: status || undefined,
        source: source || undefined,
      })
      if (res.code === 'success') {
        setSubscribes(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch subscribes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribes()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchSubscribes()
  }

  const handleReset = () => {
    setTeamId('')
    setPlanId('')
    setStatus('')
    setSource('')
    setPage(1)
    setTimeout(fetchSubscribes, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleUpgrade = (subscribe: AdminSubscribeVO) => {
    setUpgradeSubscribe(subscribe)
    setUpgradeDialogOpen(true)
  }

  const handleCancel = (subscribe: AdminSubscribeVO) => {
    setCancelSubscribe(subscribe)
    setCancelDialogOpen(true)
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>订阅管理</h1>
        <GiftSubscribeDialog onSuccess={fetchSubscribes} />
      </div>

      <SubscribeSearch
        teamId={teamId}
        planId={planId}
        status={status}
        source={source}
        onTeamIdChange={setTeamId}
        onPlanIdChange={setPlanId}
        onStatusChange={setStatus}
        onSourceChange={setSource}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <SubscribeTable
        subscribes={subscribes}
        loading={loading}
        onUpgrade={handleUpgrade}
        onCancel={handleCancel}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <UpgradeSubscribeDialog
        subscribe={upgradeSubscribe}
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        onSuccess={fetchSubscribes}
      />

      <CancelSubscribeDialog
        subscribe={cancelSubscribe}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onSuccess={fetchSubscribes}
      />
    </div>
  )
}

export default SubscriptionsPage
