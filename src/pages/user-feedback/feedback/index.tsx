import { useEffect, useState } from 'react'

import { FeedbackSearch } from './components/feedback-search'
import { FeedbackTable } from './components/feedback-table'
import { FeedbackDetailSheet } from './components/feedback-detail-sheet'
import { Pagination } from '@/components/pagination'
import { getFeedbackList } from '@/services/feedback'
import type { AdminFeedbackVO, FeedbackType, FeedbackStatus, FeedbackPriority } from '@/types/feedback'

const FeedbackPage = () => {
  const [loading, setLoading] = useState(false)
  const [feedbacks, setFeedbacks] = useState<AdminFeedbackVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [keyword, setKeyword] = useState('')
  const [feedbackType, setFeedbackType] = useState<FeedbackType | ''>('')
  const [status, setStatus] = useState<FeedbackStatus | ''>('')
  const [priority, setPriority] = useState<FeedbackPriority | ''>('')
  const [userId, setUserId] = useState('')
  const [handlerId, setHandlerId] = useState('')

  // 反馈详情
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  const fetchFeedbacks = async () => {
    setLoading(true)
    try {
      const res = await getFeedbackList({
        page,
        size: pageSize,
        keyword: keyword || undefined,
        feedbackType: feedbackType || undefined,
        status: status || undefined,
        priority: priority || undefined,
        userId: userId ? Number(userId) : undefined,
        handlerId: handlerId ? Number(handlerId) : undefined,
      })
      if (res.code === 'success') {
        setFeedbacks(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchFeedbacks()
  }

  const handleReset = () => {
    setKeyword('')
    setFeedbackType('')
    setStatus('')
    setPriority('')
    setUserId('')
    setHandlerId('')
    setPage(1)
    setTimeout(fetchFeedbacks, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleFeedbackClick = (feedbackId: number) => {
    setSelectedFeedbackId(feedbackId)
    setDetailSheetOpen(true)
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>用户反馈</h1>
      </div>

      <FeedbackSearch
        keyword={keyword}
        feedbackType={feedbackType}
        status={status}
        priority={priority}
        userId={userId}
        handlerId={handlerId}
        onKeywordChange={setKeyword}
        onFeedbackTypeChange={setFeedbackType}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onUserIdChange={setUserId}
        onHandlerIdChange={setHandlerId}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <FeedbackTable
        feedbacks={feedbacks}
        loading={loading}
        onFeedbackClick={handleFeedbackClick}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <FeedbackDetailSheet
        feedbackId={selectedFeedbackId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onFeedbackUpdated={fetchFeedbacks}
      />
    </div>
  )
}

export default FeedbackPage
