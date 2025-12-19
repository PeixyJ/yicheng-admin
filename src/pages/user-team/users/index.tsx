import { useEffect, useState } from 'react'

import { UserSearch } from './components/user-search'
import { UserTable } from './components/user-table'
import { Pagination } from '@/components/pagination'
import { getUserList } from '@/services/user'
import type { AdminUserVO, UserStatus } from '@/types/user'

const UsersPage = () => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<AdminUserVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<UserStatus | ''>('')
  const [invitedByUserId, setInvitedByUserId] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await getUserList({
        page,
        size: pageSize,
        keyword: keyword || undefined,
        status: status || undefined,
        invitedByUserId: invitedByUserId ? Number(invitedByUserId) : undefined,
      })
      if (res.code === 'success') {
        setUsers(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchUsers()
  }

  const handleReset = () => {
    setKeyword('')
    setStatus('')
    setInvitedByUserId('')
    setPage(1)
    setTimeout(fetchUsers, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>用户管理</h1>

      <UserSearch
        keyword={keyword}
        status={status}
        invitedByUserId={invitedByUserId}
        onKeywordChange={setKeyword}
        onStatusChange={setStatus}
        onInvitedByUserIdChange={setInvitedByUserId}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <UserTable users={users} loading={loading} />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />
    </div>
  )
}

export default UsersPage
