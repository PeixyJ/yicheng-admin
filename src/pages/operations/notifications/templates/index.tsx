import { useEffect, useState } from 'react'

import { TemplateSearch } from './components/template-search'
import { TemplateTable } from './components/template-table'
import { TemplateDetailSheet } from './components/template-detail-sheet'
import { CreateTemplateDialog } from './components/create-template-dialog'
import { EditTemplateDialog } from './components/edit-template-dialog'
import { DeleteTemplateDialog } from './components/delete-template-dialog'
import { Pagination } from '@/components/pagination'
import { getTemplateList, updateTemplateStatus } from '@/services/notification-template'
import type { NotificationTemplateVO, NotificationParentType } from '@/types/notification-template'

const NotificationTemplatesPage = () => {
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<NotificationTemplateVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [parentType, setParentType] = useState<NotificationParentType | ''>('')
  const [status, setStatus] = useState('')

  // 详情
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // 编辑/删除
  const [editTemplate, setEditTemplate] = useState<NotificationTemplateVO | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteTemplate, setDeleteTemplate] = useState<NotificationTemplateVO | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const res = await getTemplateList({
        page,
        size: pageSize,
        code: code || undefined,
        name: name || undefined,
        parentType: parentType || undefined,
        status: status === '' ? undefined : status === 'true',
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
    setCode('')
    setName('')
    setParentType('')
    setStatus('')
    setPage(1)
    setTimeout(fetchTemplates, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleTemplateClick = (templateId: number) => {
    setSelectedTemplateId(templateId)
    setDetailSheetOpen(true)
  }

  const handleEdit = (template: NotificationTemplateVO) => {
    setEditTemplate(template)
    setEditDialogOpen(true)
  }

  const handleDelete = (template: NotificationTemplateVO) => {
    setDeleteTemplate(template)
    setDeleteDialogOpen(true)
  }

  const handleStatusChange = async (templateId: number, newStatus: boolean) => {
    try {
      const res = await updateTemplateStatus(templateId, newStatus)
      if (res.code === 'success') {
        // 更新本地状态
        setTemplates((prev) =>
          prev.map((t) => (t.id === templateId ? { ...t, status: newStatus } : t))
        )
      }
    } catch (error) {
      console.error('Failed to update template status:', error)
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>通知模板管理</h1>
        <CreateTemplateDialog onSuccess={fetchTemplates} />
      </div>

      <TemplateSearch
        code={code}
        name={name}
        parentType={parentType}
        status={status}
        onCodeChange={setCode}
        onNameChange={setName}
        onParentTypeChange={setParentType}
        onStatusChange={setStatus}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <TemplateTable
        templates={templates}
        loading={loading}
        onTemplateClick={handleTemplateClick}
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

      <EditTemplateDialog
        template={editTemplate}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchTemplates}
      />

      <DeleteTemplateDialog
        template={deleteTemplate}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={fetchTemplates}
      />
    </div>
  )
}

export default NotificationTemplatesPage
