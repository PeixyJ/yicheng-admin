import { useEffect, useState } from 'react'

import { AdminSearch } from './components/admin-search'
import { AdminTable } from './components/admin-table'
import { AdminDetailSheet } from './components/admin-detail-sheet'
import { CreateAdminDialog } from './components/create-admin-dialog'
import { Pagination } from '@/components/pagination'
import { getAdminList } from '@/services/admin'
import type { AdminVO, AdminRoleCode, AdminStatus } from '@/types/admin'

const AdminsPage = () => {
  const [loading, setLoading] = useState(false)
  const [admins, setAdmins] = useState<AdminVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [keyword, setKeyword] = useState('')
  const [roleCode, setRoleCode] = useState<AdminRoleCode | ''>('')
  const [status, setStatus] = useState<AdminStatus | ''>('')

  // 管理员详情
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const res = await getAdminList({
        page,
        size: pageSize,
        keyword: keyword || undefined,
        roleCode: roleCode || undefined,
        status: status || undefined,
      })
      if (res.code === 'success') {
        setAdmins(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchAdmins()
  }

  const handleReset = () => {
    setKeyword('')
    setRoleCode('')
    setStatus('')
    setPage(1)
    setTimeout(fetchAdmins, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleAdminClick = (adminId: number) => {
    setSelectedAdminId(adminId)
    setDetailSheetOpen(true)
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>管理员管理</h1>
        <CreateAdminDialog onSuccess={fetchAdmins} />
      </div>

      <AdminSearch
        keyword={keyword}
        roleCode={roleCode}
        status={status}
        onKeywordChange={setKeyword}
        onRoleCodeChange={setRoleCode}
        onStatusChange={setStatus}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <AdminTable admins={admins} loading={loading} onAdminClick={handleAdminClick} />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <AdminDetailSheet
        adminId={selectedAdminId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onAdminUpdated={fetchAdmins}
      />
    </div>
  )
}

export default AdminsPage
