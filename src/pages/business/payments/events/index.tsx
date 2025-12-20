import { useEffect, useState } from 'react'

import { EventSearch } from './components/event-search'
import { EventTable } from './components/event-table'
import { EventDetailSheet } from './components/event-detail-sheet'
import { RetryDialog } from './components/retry-dialog'
import { Pagination } from '@/components/pagination'
import { getPaymentEventList } from '@/services/payment-event'
import type { AdminPaymentEventVO, EventProcessStatus } from '@/types/payment-event'

const PaymentEventsPage = () => {
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<AdminPaymentEventVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [stripeEventId, setStripeEventId] = useState('')
  const [eventType, setEventType] = useState('')
  const [processStatus, setProcessStatus] = useState<EventProcessStatus | ''>('')
  const [createTimeStart, setCreateTimeStart] = useState('')
  const [createTimeEnd, setCreateTimeEnd] = useState('')
  const [retryCountMin, setRetryCountMin] = useState('')

  // 详情弹窗
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // 重试弹窗
  const [retryEventId, setRetryEventId] = useState<number | null>(null)
  const [retryDialogOpen, setRetryDialogOpen] = useState(false)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await getPaymentEventList({
        page,
        size: pageSize,
        stripeEventId: stripeEventId || undefined,
        eventType: eventType || undefined,
        processStatus: processStatus || undefined,
        createTimeStart: createTimeStart || undefined,
        createTimeEnd: createTimeEnd || undefined,
        retryCountMin: retryCountMin ? Number(retryCountMin) : undefined,
      })
      if (res.code === 'success') {
        setEvents(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchEvents()
  }

  const handleReset = () => {
    setStripeEventId('')
    setEventType('')
    setProcessStatus('')
    setCreateTimeStart('')
    setCreateTimeEnd('')
    setRetryCountMin('')
    setPage(1)
    setTimeout(fetchEvents, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleViewDetail = (event: AdminPaymentEventVO) => {
    setSelectedEventId(event.id)
    setDetailSheetOpen(true)
  }

  const handleRetryFromSheet = (eventId: number) => {
    setRetryEventId(eventId)
    setRetryDialogOpen(true)
  }

  const handleRetrySuccess = () => {
    fetchEvents()
    // 如果详情面板打开，也刷新详情
    if (detailSheetOpen && selectedEventId === retryEventId) {
      setSelectedEventId(null)
      setTimeout(() => setSelectedEventId(retryEventId), 0)
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>Webhook事件</h1>

      <EventSearch
        stripeEventId={stripeEventId}
        eventType={eventType}
        processStatus={processStatus}
        createTimeStart={createTimeStart}
        createTimeEnd={createTimeEnd}
        retryCountMin={retryCountMin}
        onStripeEventIdChange={setStripeEventId}
        onEventTypeChange={setEventType}
        onProcessStatusChange={setProcessStatus}
        onCreateTimeStartChange={setCreateTimeStart}
        onCreateTimeEndChange={setCreateTimeEnd}
        onRetryCountMinChange={setRetryCountMin}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <EventTable
        events={events}
        loading={loading}
        onViewDetail={handleViewDetail}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <EventDetailSheet
        eventId={selectedEventId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onRetry={handleRetryFromSheet}
      />

      <RetryDialog
        eventId={retryEventId}
        open={retryDialogOpen}
        onOpenChange={setRetryDialogOpen}
        onSuccess={handleRetrySuccess}
      />
    </div>
  )
}

export default PaymentEventsPage
