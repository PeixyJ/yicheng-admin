import { useEffect, useState } from 'react'

import { PlanSearch } from './components/plan-search'
import { PlanTable } from './components/plan-table'
import { PlanDetailSheet } from './components/plan-detail-sheet'
import { CreatePlanDialog } from './components/create-plan-dialog'
import { Pagination } from '@/components/pagination'
import { getPlanList, switchPlanStatus, setDefaultPlan, deletePlan } from '@/services/plan'
import type { SubscribePlanVO, PlanType } from '@/types/plan'

const PlansPage = () => {
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<SubscribePlanVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [planName, setPlanName] = useState('')
  const [planCode, setPlanCode] = useState('')
  const [planType, setPlanType] = useState<PlanType | ''>('')
  const [status, setStatus] = useState<boolean | ''>('')

  // 计划详情
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const res = await getPlanList({
        page,
        size: pageSize,
        planName: planName || undefined,
        planCode: planCode || undefined,
        planType: planType || undefined,
        status: status === '' ? undefined : status,
      })
      if (res.code === 'success') {
        setPlans(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchPlans()
  }

  const handleReset = () => {
    setPlanName('')
    setPlanCode('')
    setPlanType('')
    setStatus('')
    setPage(1)
    setTimeout(fetchPlans, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handlePlanClick = (planId: number) => {
    setSelectedPlanId(planId)
    setDetailSheetOpen(true)
  }

  const handleStatusChange = async (planId: number, newStatus: boolean) => {
    try {
      const res = await switchPlanStatus(planId, newStatus)
      if (res.code === 'success') {
        setPlans((prev) =>
          prev.map((p) => (p.id === planId ? { ...p, status: newStatus } : p))
        )
      }
    } catch (error) {
      console.error('Failed to switch plan status:', error)
    }
  }

  const handleSetDefault = async (planId: number) => {
    try {
      const res = await setDefaultPlan(planId)
      if (res.code === 'success') {
        // 更新本地状态：将所有计划的 isDefault 设为 false，只有当前计划设为 true
        setPlans((prev) =>
          prev.map((p) => ({ ...p, isDefault: p.id === planId }))
        )
      }
    } catch (error) {
      console.error('Failed to set default plan:', error)
    }
  }

  const handleDelete = async (planId: number) => {
    try {
      const res = await deletePlan(planId)
      if (res.code === 'success') {
        fetchPlans()
      }
    } catch (error) {
      console.error('Failed to delete plan:', error)
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>订阅计划管理</h1>
        <CreatePlanDialog onSuccess={fetchPlans} />
      </div>

      <PlanSearch
        planName={planName}
        planCode={planCode}
        planType={planType}
        status={status}
        onPlanNameChange={setPlanName}
        onPlanCodeChange={setPlanCode}
        onPlanTypeChange={setPlanType}
        onStatusChange={setStatus}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <PlanTable
        plans={plans}
        loading={loading}
        onPlanClick={handlePlanClick}
        onStatusChange={handleStatusChange}
        onSetDefault={handleSetDefault}
        onDelete={handleDelete}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <PlanDetailSheet
        planId={selectedPlanId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onPlanUpdated={fetchPlans}
      />
    </div>
  )
}

export default PlansPage
