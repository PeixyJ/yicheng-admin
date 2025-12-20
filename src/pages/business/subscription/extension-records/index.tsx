import { useEffect, useState } from 'react'

import { RecordSearch } from './components/record-search'
import { RecordTable } from './components/record-table'
import { GrantResourceDialog } from './components/grant-resource-dialog'
import { RecordDetailSheet } from './components/record-detail-sheet'
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
import { getExtensionRecordList, revokeExtensionRecord } from '@/services/resource-pack'
import type { ResourceExtensionRecordVO, ResourceType, ExtensionSource, ExtensionStatus } from '@/types/resource-pack'

const ExtensionRecordsPage = () => {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<ResourceExtensionRecordVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [teamId, setTeamId] = useState('')
  const [resourceType, setResourceType] = useState<ResourceType | ''>('')
  const [source, setSource] = useState<ExtensionSource | ''>('')
  const [status, setStatus] = useState<ExtensionStatus | ''>('')

  // 详情面板
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null)

  // 撤销确认
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [revokeRecord, setRevokeRecord] = useState<ResourceExtensionRecordVO | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const res = await getExtensionRecordList({
        page,
        size: pageSize,
        teamId: teamId ? Number(teamId) : undefined,
        resourceType: resourceType || undefined,
        source: source || undefined,
        status: status || undefined,
      })
      if (res.code === 'success') {
        setRecords(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch records:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchRecords()
  }

  const handleReset = () => {
    setTeamId('')
    setResourceType('')
    setSource('')
    setStatus('')
    setPage(1)
    setTimeout(fetchRecords, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleView = (record: ResourceExtensionRecordVO) => {
    setSelectedRecordId(record.id)
    setDetailOpen(true)
  }

  const handleRevoke = (record: ResourceExtensionRecordVO) => {
    setRevokeRecord(record)
    setRevokeDialogOpen(true)
  }

  const confirmRevoke = async () => {
    if (!revokeRecord) return
    setSubmitting(true)
    try {
      const res = await revokeExtensionRecord(revokeRecord.id)
      if (res.code === 'success') {
        setRevokeDialogOpen(false)
        setRevokeRecord(null)
        fetchRecords()
      }
    } catch (error) {
      console.error('Failed to revoke record:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>资源扩展记录</h1>
        <GrantResourceDialog onSuccess={fetchRecords} />
      </div>

      <RecordSearch
        teamId={teamId}
        resourceType={resourceType}
        source={source}
        status={status}
        onTeamIdChange={setTeamId}
        onResourceTypeChange={setResourceType}
        onSourceChange={setSource}
        onStatusChange={setStatus}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <RecordTable
        records={records}
        loading={loading}
        onView={handleView}
        onRevoke={handleRevoke}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <RecordDetailSheet
        recordId={selectedRecordId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认撤销赠送</AlertDialogTitle>
            <AlertDialogDescription>
              确定要撤销赠送记录 #{revokeRecord?.id} 吗？
              <div className='mt-2 rounded-lg border bg-muted/50 p-3 text-sm'>
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <span className='text-muted-foreground'>团队：</span>
                    <span className='font-medium'>{revokeRecord?.teamName || revokeRecord?.teamId}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>资源类型：</span>
                    <span className='font-medium'>{revokeRecord?.resourceTypeDesc || revokeRecord?.resourceType}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>资源数量：</span>
                    <span className='font-medium'>{revokeRecord?.amount}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>赠送原因：</span>
                    <span className='font-medium truncate'>{revokeRecord?.grantReason || '-'}</span>
                  </div>
                </div>
              </div>
              <span className='block mt-2 text-destructive'>
                撤销后该团队将失去这部分资源配额
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRevoke}
              disabled={submitting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {submitting ? '撤销中...' : '确认撤销'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ExtensionRecordsPage
