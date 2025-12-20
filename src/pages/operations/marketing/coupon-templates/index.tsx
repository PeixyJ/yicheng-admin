import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { TemplateSearch } from './components/template-search.tsx'
import { TemplateTable } from './components/template-table.tsx'
import { TemplateDetailSheet } from './components/template-detail-sheet.tsx'
import { TemplateFormDialog } from './components/template-form-dialog.tsx'
import { DeleteDialog } from './components/delete-dialog.tsx'
import { Pagination } from '@/components/pagination.tsx'
import { getCouponTemplateList } from '@/services/coupon-template.ts'
import type { CouponTemplateVO, DiscountType } from '@/types/coupon-template.ts'

const CouponTemplatesPage = () => {
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<CouponTemplateVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [name, setName] = useState('')
  const [discountType, setDiscountType] = useState<DiscountType | ''>('')
  const [status, setStatus] = useState('')

  // 详情弹窗
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // 表单弹窗
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editTemplateId, setEditTemplateId] = useState<number | undefined>(undefined)
  const [formDialogOpen, setFormDialogOpen] = useState(false)

  // 删除弹窗
  const [deleteTemplateId, setDeleteTemplateId] = useState<number | null>(null)
  const [deleteTemplateName, setDeleteTemplateName] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const res = await getCouponTemplateList({
        page,
        size: pageSize,
        name: name || undefined,
        discountType: discountType || undefined,
        status: status === 'true' ? true : status === 'false' ? false : undefined,
      })
      if (res.code === 'success') {
        setTemplates(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchTemplates()
  }

  const handleReset = () => {
    setName('')
    setDiscountType('')
    setStatus('')
    setPage(1)
    setTimeout(fetchTemplates, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleViewDetail = (template: CouponTemplateVO) => {
    setSelectedTemplateId(template.id)
    setDetailSheetOpen(true)
  }

  const handleCreate = () => {
    setFormMode('create')
    setEditTemplateId(undefined)
    setFormDialogOpen(true)
  }

  const handleEdit = (template: CouponTemplateVO) => {
    setFormMode('edit')
    setEditTemplateId(template.id)
    setFormDialogOpen(true)
  }

  const handleDelete = (template: CouponTemplateVO) => {
    setDeleteTemplateId(template.id)
    setDeleteTemplateName(template.name)
    setDeleteDialogOpen(true)
  }

  const handleFormSuccess = () => {
    fetchTemplates()
  }

  const handleDeleteSuccess = () => {
    fetchTemplates()
  }

  const handleStatusChange = () => {
    fetchTemplates()
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>优惠券模板</h1>
        <Button onClick={handleCreate}>
          <Plus className='mr-2 size-4' />
          创建模板
        </Button>
      </div>

      <TemplateSearch
        name={name}
        discountType={discountType}
        status={status}
        onNameChange={setName}
        onDiscountTypeChange={setDiscountType}
        onStatusChange={setStatus}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <TemplateTable
        templates={templates}
        loading={loading}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <TemplateDetailSheet
        templateId={selectedTemplateId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />

      <TemplateFormDialog
        mode={formMode}
        templateId={editTemplateId}
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
      />

      <DeleteDialog
        templateId={deleteTemplateId}
        templateName={deleteTemplateName}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

export default CouponTemplatesPage
