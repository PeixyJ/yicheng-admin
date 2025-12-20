import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { PromoCodeSearch } from './components/promo-code-search.tsx'
import { PromoCodeTable } from './components/promo-code-table.tsx'
import { PromoCodeDetailSheet } from './components/promo-code-detail-sheet.tsx'
import { PromoCodeFormDialog } from './components/promo-code-form-dialog.tsx'
import { DeleteDialog } from './components/delete-dialog.tsx'
import { Pagination } from '@/components/pagination.tsx'
import { getPromoCodeList } from '@/services/promo-code.ts'
import type { PromoCodeVO, DiscountType } from '@/types/promo-code.ts'

const PromoCodesPage = () => {
  const [loading, setLoading] = useState(false)
  const [promoCodes, setPromoCodes] = useState<PromoCodeVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [discountType, setDiscountType] = useState<DiscountType | ''>('')
  const [status, setStatus] = useState('')
  const [isActive, setIsActive] = useState('')

  // 详情弹窗
  const [selectedPromoCodeId, setSelectedPromoCodeId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // 表单弹窗
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editPromoCodeId, setEditPromoCodeId] = useState<number | undefined>(undefined)
  const [formDialogOpen, setFormDialogOpen] = useState(false)

  // 删除弹窗
  const [deletePromoCodeId, setDeletePromoCodeId] = useState<number | null>(null)
  const [deletePromoCode, setDeletePromoCode] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const fetchPromoCodes = async () => {
    setLoading(true)
    try {
      const res = await getPromoCodeList({
        page,
        size: pageSize,
        code: code || undefined,
        name: name || undefined,
        discountType: discountType || undefined,
        status: status === 'true' ? true : status === 'false' ? false : undefined,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      })
      if (res.code === 'success') {
        setPromoCodes(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch promo codes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromoCodes()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchPromoCodes()
  }

  const handleReset = () => {
    setCode('')
    setName('')
    setDiscountType('')
    setStatus('')
    setIsActive('')
    setPage(1)
    setTimeout(fetchPromoCodes, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleViewDetail = (promoCode: PromoCodeVO) => {
    setSelectedPromoCodeId(promoCode.id)
    setDetailSheetOpen(true)
  }

  const handleCreate = () => {
    setFormMode('create')
    setEditPromoCodeId(undefined)
    setFormDialogOpen(true)
  }

  const handleEdit = (promoCode: PromoCodeVO) => {
    setFormMode('edit')
    setEditPromoCodeId(promoCode.id)
    setFormDialogOpen(true)
  }

  const handleDelete = (promoCode: PromoCodeVO) => {
    setDeletePromoCodeId(promoCode.id)
    setDeletePromoCode(promoCode.code)
    setDeleteDialogOpen(true)
  }

  const handleFormSuccess = () => {
    fetchPromoCodes()
  }

  const handleDeleteSuccess = () => {
    fetchPromoCodes()
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>优惠码管理</h1>
        <Button onClick={handleCreate}>
          <Plus className='mr-2 size-4' />
          创建优惠码
        </Button>
      </div>

      <PromoCodeSearch
        code={code}
        name={name}
        discountType={discountType}
        status={status}
        isActive={isActive}
        onCodeChange={setCode}
        onNameChange={setName}
        onDiscountTypeChange={setDiscountType}
        onStatusChange={setStatus}
        onIsActiveChange={setIsActive}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <PromoCodeTable
        promoCodes={promoCodes}
        loading={loading}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <PromoCodeDetailSheet
        promoCodeId={selectedPromoCodeId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />

      <PromoCodeFormDialog
        mode={formMode}
        promoCodeId={editPromoCodeId}
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
      />

      <DeleteDialog
        promoCodeId={deletePromoCodeId}
        promoCode={deletePromoCode}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

export default PromoCodesPage
