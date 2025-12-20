import { useEffect, useState } from 'react'

import { StatisticsCards } from './components/statistics-cards'
import { OrderSearch } from './components/order-search'
import { OrderTable } from './components/order-table'
import { OrderDetailSheet } from './components/order-detail-sheet'
import { RefundDialog } from './components/refund-dialog'
import { CancelDialog } from './components/cancel-dialog'
import { Pagination } from '@/components/pagination'
import { getPaymentOrderList, getPaymentStatistics } from '@/services/payment-order'
import type {
  AdminPaymentOrderVO,
  AdminPaymentOrderDetailVO,
  PaymentStatisticsVO,
  PaymentChannel,
  OrderType,
  OrderStatus,
} from '@/types/payment-order'

const PaymentOrdersPage = () => {
  const [loading, setLoading] = useState(false)
  const [statisticsLoading, setStatisticsLoading] = useState(false)
  const [orders, setOrders] = useState<AdminPaymentOrderVO[]>([])
  const [statistics, setStatistics] = useState<PaymentStatisticsVO | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [orderNo, setOrderNo] = useState('')
  const [teamId, setTeamId] = useState('')
  const [userId, setUserId] = useState('')
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel | 'all'>('all')
  const [orderType, setOrderType] = useState<OrderType | 'all'>('all')
  const [orderStatus, setOrderStatus] = useState<OrderStatus | 'all'>('all')
  const [createTimeStart, setCreateTimeStart] = useState('')
  const [createTimeEnd, setCreateTimeEnd] = useState('')

  // 弹窗状态
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<AdminPaymentOrderDetailVO | null>(null)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await getPaymentOrderList({
        page,
        size: pageSize,
        orderNo: orderNo || undefined,
        teamId: teamId ? Number(teamId) : undefined,
        userId: userId ? Number(userId) : undefined,
        paymentChannel: paymentChannel !== 'all' ? paymentChannel : undefined,
        orderType: orderType !== 'all' ? orderType : undefined,
        orderStatus: orderStatus !== 'all' ? orderStatus : undefined,
        createTimeStart: createTimeStart || undefined,
        createTimeEnd: createTimeEnd || undefined,
      })
      if (res.code === 'success') {
        setOrders(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    setStatisticsLoading(true)
    try {
      const res = await getPaymentStatistics()
      if (res.code === 'success') {
        setStatistics(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    } finally {
      setStatisticsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, pageSize])

  useEffect(() => {
    fetchStatistics()
  }, [])

  const handleSearch = () => {
    setPage(1)
    fetchOrders()
  }

  const handleReset = () => {
    setOrderNo('')
    setTeamId('')
    setUserId('')
    setPaymentChannel('all')
    setOrderType('all')
    setOrderStatus('all')
    setCreateTimeStart('')
    setCreateTimeEnd('')
    setPage(1)
    setTimeout(fetchOrders, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleViewDetail = (order: AdminPaymentOrderVO) => {
    setSelectedOrderId(order.id)
    setDetailSheetOpen(true)
  }

  const handleRefund = (order: AdminPaymentOrderDetailVO) => {
    setSelectedOrderForAction(order)
    setDetailSheetOpen(false)
    setRefundDialogOpen(true)
  }

  const handleCancel = (order: AdminPaymentOrderDetailVO) => {
    setSelectedOrderForAction(order)
    setDetailSheetOpen(false)
    setCancelDialogOpen(true)
  }

  const handleActionSuccess = () => {
    fetchOrders()
    fetchStatistics()
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>订单管理</h1>

      <StatisticsCards statistics={statistics} loading={statisticsLoading} />

      <OrderSearch
        orderNo={orderNo}
        teamId={teamId}
        userId={userId}
        paymentChannel={paymentChannel}
        orderType={orderType}
        orderStatus={orderStatus}
        createTimeStart={createTimeStart}
        createTimeEnd={createTimeEnd}
        onOrderNoChange={setOrderNo}
        onTeamIdChange={setTeamId}
        onUserIdChange={setUserId}
        onPaymentChannelChange={setPaymentChannel}
        onOrderTypeChange={setOrderType}
        onOrderStatusChange={setOrderStatus}
        onCreateTimeStartChange={setCreateTimeStart}
        onCreateTimeEndChange={setCreateTimeEnd}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <OrderTable
        orders={orders}
        loading={loading}
        onViewDetail={handleViewDetail}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <OrderDetailSheet
        orderId={selectedOrderId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onRefund={handleRefund}
        onCancel={handleCancel}
      />

      <RefundDialog
        order={selectedOrderForAction}
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        onSuccess={handleActionSuccess}
      />

      <CancelDialog
        order={selectedOrderForAction}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onSuccess={handleActionSuccess}
      />
    </div>
  )
}

export default PaymentOrdersPage
