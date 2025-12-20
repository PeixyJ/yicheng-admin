import { useEffect, useState } from 'react'

import { CouponSearch } from './components/coupon-search'
import { CouponTable } from './components/coupon-table'
import { CouponDetailSheet } from './components/coupon-detail-sheet'
import { GrantCouponDialog } from './components/grant-coupon-dialog'
import { Pagination } from '@/components/pagination'
import { getCouponList } from '@/services/coupon'
import type { CouponVO, CouponStatus, CouponSource } from '@/types/coupon'

const CouponsPage = () => {
  const [loading, setLoading] = useState(false)
  const [coupons, setCoupons] = useState<CouponVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [couponNo, setCouponNo] = useState('')
  const [templateId, setTemplateId] = useState('')
  const [teamId, setTeamId] = useState('')
  const [userId, setUserId] = useState('')
  const [status, setStatus] = useState<CouponStatus | ''>('')
  const [source, setSource] = useState<CouponSource | ''>('')

  // 优惠券详情
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const res = await getCouponList({
        page,
        size: pageSize,
        couponNo: couponNo || undefined,
        templateId: templateId ? Number(templateId) : undefined,
        teamId: teamId ? Number(teamId) : undefined,
        userId: userId ? Number(userId) : undefined,
        status: status || undefined,
        source: source || undefined,
      })
      if (res.code === 'success') {
        setCoupons(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchCoupons()
  }

  const handleReset = () => {
    setCouponNo('')
    setTemplateId('')
    setTeamId('')
    setUserId('')
    setStatus('')
    setSource('')
    setPage(1)
    setTimeout(fetchCoupons, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleCouponClick = (couponId: number) => {
    setSelectedCouponId(couponId)
    setDetailSheetOpen(true)
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>优惠券管理</h1>
        <GrantCouponDialog onSuccess={fetchCoupons} />
      </div>

      <CouponSearch
        couponNo={couponNo}
        templateId={templateId}
        teamId={teamId}
        userId={userId}
        status={status}
        source={source}
        onCouponNoChange={setCouponNo}
        onTemplateIdChange={setTemplateId}
        onTeamIdChange={setTeamId}
        onUserIdChange={setUserId}
        onStatusChange={setStatus}
        onSourceChange={setSource}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <CouponTable
        coupons={coupons}
        loading={loading}
        onCouponClick={handleCouponClick}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <CouponDetailSheet
        couponId={selectedCouponId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onCouponUpdated={fetchCoupons}
      />
    </div>
  )
}

export default CouponsPage
