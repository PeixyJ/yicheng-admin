import { useEffect, useState } from 'react'

import { TransactionSearch } from './components/transaction-search'
import { TransactionTable } from './components/transaction-table'
import { TransactionDetailSheet } from './components/transaction-detail-sheet'
import { Pagination } from '@/components/pagination'
import { getTransactionList } from '@/services/point'
import type { PointTransactionRecordVO, TransactionType } from '@/types/point'

const CreditTransactionsPage = () => {
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<PointTransactionRecordVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [teamId, setTeamId] = useState('')
  const [transactionNo, setTransactionNo] = useState('')
  const [type, setType] = useState<TransactionType | 'all'>('all')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  // 详情弹窗
  const [selectedTransaction, setSelectedTransaction] = useState<PointTransactionRecordVO | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const res = await getTransactionList({
        page,
        size: pageSize,
        teamId: teamId ? Number(teamId) : undefined,
        transactionNo: transactionNo || undefined,
        type: type !== 'all' ? type : undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
      })
      if (res.code === 'success') {
        setTransactions(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchTransactions()
  }

  const handleReset = () => {
    setTeamId('')
    setTransactionNo('')
    setType('all')
    setStartTime('')
    setEndTime('')
    setPage(1)
    setTimeout(fetchTransactions, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleViewDetail = (transaction: PointTransactionRecordVO) => {
    setSelectedTransaction(transaction)
    setDetailSheetOpen(true)
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>点数交易记录</h1>

      <TransactionSearch
        teamId={teamId}
        transactionNo={transactionNo}
        type={type}
        startTime={startTime}
        endTime={endTime}
        onTeamIdChange={setTeamId}
        onTransactionNoChange={setTransactionNo}
        onTypeChange={setType}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <TransactionTable
        transactions={transactions}
        loading={loading}
        onViewDetail={handleViewDetail}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <TransactionDetailSheet
        transaction={selectedTransaction}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  )
}

export default CreditTransactionsPage
