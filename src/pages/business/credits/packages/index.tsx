import { useEffect, useState } from 'react'

import { PackageSearch } from './components/package-search'
import { PackageTable } from './components/package-table'
import { PackageDetailSheet } from './components/package-detail-sheet'
import { CreatePackageDialog } from './components/create-package-dialog'
import { Pagination } from '@/components/pagination'
import {
  getPointPackageList,
  updatePointPackageStatus,
  updatePointPackageVisible,
  syncPointPackageToStripe,
} from '@/services/point-package'
import type { PointPackageVO, Currency } from '@/types/point-package'

const CreditPackagesPage = () => {
  const [loading, setLoading] = useState(false)
  const [packages, setPackages] = useState<PointPackageVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [keyword, setKeyword] = useState('')
  const [currency, setCurrency] = useState<Currency | ''>('')
  const [status, setStatus] = useState<string>('all')
  const [visible, setVisible] = useState<string>('all')

  // 套餐详情
  const [selectedPackage, setSelectedPackage] = useState<PointPackageVO | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await getPointPackageList({
        page,
        size: pageSize,
        packName: keyword || undefined,
        currency: currency || undefined,
        status: status === 'all' ? undefined : status === 'true',
        visible: visible === 'all' ? undefined : visible === 'true',
      })
      if (res.code === 'success') {
        setPackages(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchPackages()
  }

  const handleReset = () => {
    setKeyword('')
    setCurrency('')
    setStatus('all')
    setVisible('all')
    setPage(1)
    setTimeout(fetchPackages, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handlePackageClick = (pkg: PointPackageVO) => {
    setSelectedPackage(pkg)
    setDetailSheetOpen(true)
  }

  const handleStatusChange = async (pkg: PointPackageVO, newStatus: boolean) => {
    try {
      const res = await updatePointPackageStatus(pkg.id, newStatus)
      if (res.code === 'success') {
        fetchPackages()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleVisibleChange = async (pkg: PointPackageVO, newVisible: boolean) => {
    try {
      const res = await updatePointPackageVisible(pkg.id, newVisible)
      if (res.code === 'success') {
        fetchPackages()
      }
    } catch (error) {
      console.error('Failed to update visible:', error)
    }
  }

  const handleSyncStripe = async (pkg: PointPackageVO) => {
    try {
      const res = await syncPointPackageToStripe(pkg.id)
      if (res.code === 'success') {
        fetchPackages()
      }
    } catch (error) {
      console.error('Failed to sync to Stripe:', error)
    }
  }

  const handlePackageUpdated = () => {
    fetchPackages()
    // 更新选中的套餐数据
    if (selectedPackage) {
      const updated = packages.find((p) => p.packCode === selectedPackage.packCode)
      if (updated) {
        setSelectedPackage(updated)
      }
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>点数套餐管理</h1>
        <CreatePackageDialog onSuccess={fetchPackages} />
      </div>

      <PackageSearch
        keyword={keyword}
        currency={currency}
        status={status}
        visible={visible}
        onKeywordChange={setKeyword}
        onCurrencyChange={setCurrency}
        onStatusChange={setStatus}
        onVisibleChange={setVisible}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <PackageTable
        packages={packages}
        loading={loading}
        onPackageClick={handlePackageClick}
        onStatusChange={handleStatusChange}
        onVisibleChange={handleVisibleChange}
        onSyncStripe={handleSyncStripe}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <PackageDetailSheet
        pkg={selectedPackage}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onPackageUpdated={handlePackageUpdated}
      />
    </div>
  )
}

export default CreditPackagesPage
