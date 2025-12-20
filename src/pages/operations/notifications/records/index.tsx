import { useEffect, useState } from 'react'

import { NotificationSearch } from './components/notification-search'
import { NotificationTable } from './components/notification-table'
import { NotificationDetailSheet } from './components/notification-detail-sheet'
import { DeleteNotificationDialog } from './components/delete-notification-dialog'
import { Pagination } from '@/components/pagination'
import { getNotificationList } from '@/services/notification'
import type { NotificationVO, NotificationParentType, NotificationStatus } from '@/types/notification'

const NotificationRecordsPage = () => {
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState<NotificationVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [userId, setUserId] = useState('')
  const [teamId, setTeamId] = useState('')
  const [parentType, setParentType] = useState<NotificationParentType | ''>('')
  const [status, setStatus] = useState<NotificationStatus | ''>('')

  // 详情
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // 删除
  const [deleteNotification, setDeleteNotification] = useState<NotificationVO | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await getNotificationList({
        page,
        size: pageSize,
        userId: userId ? Number(userId) : undefined,
        teamId: teamId ? Number(teamId) : undefined,
        parentType: parentType || undefined,
        status: status || undefined,
      })
      if (res.code === 'success') {
        setNotifications(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchNotifications()
  }

  const handleReset = () => {
    setUserId('')
    setTeamId('')
    setParentType('')
    setStatus('')
    setPage(1)
    setTimeout(fetchNotifications, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleNotificationClick = (notificationId: number) => {
    setSelectedNotificationId(notificationId)
    setDetailSheetOpen(true)
  }

  const handleDelete = (notification: NotificationVO) => {
    setDeleteNotification(notification)
    setDeleteDialogOpen(true)
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>通知记录管理</h1>
      </div>

      <NotificationSearch
        userId={userId}
        teamId={teamId}
        parentType={parentType}
        status={status}
        onUserIdChange={setUserId}
        onTeamIdChange={setTeamId}
        onParentTypeChange={setParentType}
        onStatusChange={setStatus}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <NotificationTable
        notifications={notifications}
        loading={loading}
        onNotificationClick={handleNotificationClick}
        onDelete={handleDelete}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <NotificationDetailSheet
        notificationId={selectedNotificationId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />

      <DeleteNotificationDialog
        notification={deleteNotification}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={fetchNotifications}
      />
    </div>
  )
}

export default NotificationRecordsPage
