import { useEffect, useState } from 'react'

import { FeatureSearch } from './components/feature-search'
import { FeatureTable } from './components/feature-table'
import { CreateFeatureDialog } from './components/create-feature-dialog'
import { EditFeatureDialog } from './components/edit-feature-dialog'
import { Pagination } from '@/components/pagination'
import { getFeatureList, switchFeatureStatus, deleteFeature } from '@/services/feature'
import type { FeatureVO, FeatureType } from '@/types/feature'

const FeaturesPage = () => {
  const [loading, setLoading] = useState(false)
  const [features, setFeatures] = useState<FeatureVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [featureName, setFeatureName] = useState('')
  const [featureCode, setFeatureCode] = useState('')
  const [featureType, setFeatureType] = useState<FeatureType | ''>('')
  const [status, setStatus] = useState<boolean | ''>('')

  // 编辑弹窗
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingFeature, setEditingFeature] = useState<FeatureVO | null>(null)

  const fetchFeatures = async () => {
    setLoading(true)
    try {
      const res = await getFeatureList({
        page,
        size: pageSize,
        featureName: featureName || undefined,
        featureCode: featureCode || undefined,
        featureType: featureType || undefined,
        status: status === '' ? undefined : status,
      })
      if (res.code === 'success') {
        setFeatures(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch features:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatures()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchFeatures()
  }

  const handleReset = () => {
    setFeatureName('')
    setFeatureCode('')
    setFeatureType('')
    setStatus('')
    setPage(1)
    setTimeout(fetchFeatures, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleStatusChange = async (featureId: number, newStatus: boolean) => {
    try {
      const res = await switchFeatureStatus(featureId, newStatus)
      if (res.code === 'success') {
        // 更新本地状态
        setFeatures((prev) =>
          prev.map((f) => (f.id === featureId ? { ...f, status: newStatus } : f))
        )
      }
    } catch (error) {
      console.error('Failed to switch feature status:', error)
    }
  }

  const handleDelete = async (featureId: number) => {
    try {
      const res = await deleteFeature(featureId)
      if (res.code === 'success') {
        fetchFeatures()
      }
    } catch (error) {
      console.error('Failed to delete feature:', error)
    }
  }

  const handleEdit = (feature: FeatureVO) => {
    setEditingFeature(feature)
    setEditDialogOpen(true)
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>功能管理</h1>
        <CreateFeatureDialog onSuccess={fetchFeatures} />
      </div>

      <FeatureSearch
        featureName={featureName}
        featureCode={featureCode}
        featureType={featureType}
        status={status}
        onFeatureNameChange={setFeatureName}
        onFeatureCodeChange={setFeatureCode}
        onFeatureTypeChange={setFeatureType}
        onStatusChange={setStatus}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <FeatureTable
        features={features}
        loading={loading}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <EditFeatureDialog
        feature={editingFeature}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchFeatures}
      />
    </div>
  )
}

export default FeaturesPage
