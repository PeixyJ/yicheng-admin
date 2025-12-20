import { useEffect, useState } from 'react'

import { PackageSearch } from './components/package-search'
import { PackageTable } from './components/package-table'
import { CreatePackageDialog } from './components/create-package-dialog'
import { PackageDetailSheet } from './components/package-detail-sheet'
import { Pagination } from '@/components/pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getResourcePackageList, switchResourcePackageStatus } from '@/services/resource-pack'
import type { SubscribeResourcePackageVO, ResourceType } from '@/types/resource-pack'

const ResourcePacksPage = () => {
  const [loading, setLoading] = useState(false)
  const [packages, setPackages] = useState<SubscribeResourcePackageVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [packCode, setPackCode] = useState('')
  const [packName, setPackName] = useState('')
  const [resourceType, setResourceType] = useState<ResourceType | ''>('')
  const [status, setStatus] = useState<boolean | ''>('')

  // 详情面板
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null)

  // 状态切换确认
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusPackage, setStatusPackage] = useState<SubscribeResourcePackageVO | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await getResourcePackageList({
        page,
        size: pageSize,
        packCode: packCode || undefined,
        packName: packName || undefined,
        resourceType: resourceType || undefined,
        status: status === '' ? undefined : status,
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
    setPackCode('')
    setPackName('')
    setResourceType('')
    setStatus('')
    setPage(1)
    setTimeout(fetchPackages, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleView = (pkg: SubscribeResourcePackageVO) => {
    setSelectedPackageId(pkg.id)
    setDetailOpen(true)
  }

  const handleToggleStatus = (pkg: SubscribeResourcePackageVO) => {
    setStatusPackage(pkg)
    setStatusDialogOpen(true)
  }

  const confirmToggleStatus = async () => {
    if (!statusPackage) return
    setSubmitting(true)
    try {
      const res = await switchResourcePackageStatus(statusPackage.id, !statusPackage.status)
      if (res.code === 'success') {
        setStatusDialogOpen(false)
        setStatusPackage(null)
        fetchPackages()
      }
    } catch (error) {
      console.error('Failed to toggle status:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>订阅资源包管理</h1>
        <CreatePackageDialog onSuccess={fetchPackages} />
      </div>

      <PackageSearch
        packCode={packCode}
        packName={packName}
        resourceType={resourceType}
        status={status}
        onPackCodeChange={setPackCode}
        onPackNameChange={setPackName}
        onResourceTypeChange={setResourceType}
        onStatusChange={setStatus}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <PackageTable
        packages={packages}
        loading={loading}
        onView={handleView}
        onToggleStatus={handleToggleStatus}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <PackageDetailSheet
        packageId={selectedPackageId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSuccess={fetchPackages}
      />

      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              确认{statusPackage?.status ? '下架' : '上架'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              确定要{statusPackage?.status ? '下架' : '上架'}资源包「{statusPackage?.packName}」吗？
              {statusPackage?.status && (
                <span className='block mt-2 text-destructive'>
                  下架后用户将无法购买此资源包
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleStatus}
              disabled={submitting}
              className={statusPackage?.status ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {submitting ? '处理中...' : '确认'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ResourcePacksPage
