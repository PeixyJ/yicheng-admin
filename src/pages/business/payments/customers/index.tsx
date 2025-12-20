import { useEffect, useState } from 'react'

import { CustomerSearch } from './components/customer-search'
import { CustomerTable } from './components/customer-table'
import { CustomerDetailSheet } from './components/customer-detail-sheet'
import { Pagination } from '@/components/pagination'
import { getPaymentCustomerList } from '@/services/payment-customer'
import type { AdminPaymentCustomerVO } from '@/types/payment-customer'

const PaymentCustomersPage = () => {
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<AdminPaymentCustomerVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [teamId, setTeamId] = useState('')
  const [userId, setUserId] = useState('')
  const [stripeCustomerId, setStripeCustomerId] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  // 详情弹窗
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await getPaymentCustomerList({
        page,
        size: pageSize,
        teamId: teamId ? Number(teamId) : undefined,
        userId: userId ? Number(userId) : undefined,
        stripeCustomerId: stripeCustomerId || undefined,
        email: email || undefined,
        name: name || undefined,
      })
      if (res.code === 'success') {
        setCustomers(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchCustomers()
  }

  const handleReset = () => {
    setTeamId('')
    setUserId('')
    setStripeCustomerId('')
    setEmail('')
    setName('')
    setPage(1)
    setTimeout(fetchCustomers, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleViewDetail = (customer: AdminPaymentCustomerVO) => {
    setSelectedCustomerId(customer.id)
    setDetailSheetOpen(true)
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>客户管理</h1>

      <CustomerSearch
        teamId={teamId}
        userId={userId}
        stripeCustomerId={stripeCustomerId}
        email={email}
        name={name}
        onTeamIdChange={setTeamId}
        onUserIdChange={setUserId}
        onStripeCustomerIdChange={setStripeCustomerId}
        onEmailChange={setEmail}
        onNameChange={setName}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <CustomerTable
        customers={customers}
        loading={loading}
        onViewDetail={handleViewDetail}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <CustomerDetailSheet
        customerId={selectedCustomerId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  )
}

export default PaymentCustomersPage
