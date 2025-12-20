import { useEffect, useState } from 'react'
import { RefreshCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ConfigSearch } from './components/config-search'
import { ConfigTable } from './components/config-table'
import { ConfigDetailSheet } from './components/config-detail-sheet'
import { CreateConfigDialog } from './components/create-config-dialog'
import { Pagination } from '@/components/pagination'
import { getSystemConfigList, refreshSystemConfigCache } from '@/services/system-config'
import type { SystemConfigVO } from '@/types/system-config'

const SettingsPage = () => {
  const [loading, setLoading] = useState(false)
  const [configs, setConfigs] = useState<SystemConfigVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 搜索条件
  const [keyword, setKeyword] = useState('')
  const [configGroup, setConfigGroup] = useState('')

  // 配置详情
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // 刷新缓存
  const [refreshing, setRefreshing] = useState(false)

  const fetchConfigs = async () => {
    setLoading(true)
    try {
      const res = await getSystemConfigList({
        page,
        size: pageSize,
        keyword: keyword || undefined,
        configGroup: configGroup || undefined,
      })
      if (res.code === 'success') {
        setConfigs(res.data.records)
        setTotal(res.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch configs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [page, pageSize])

  const handleSearch = () => {
    setPage(1)
    fetchConfigs()
  }

  const handleReset = () => {
    setKeyword('')
    setConfigGroup('')
    setPage(1)
    setTimeout(fetchConfigs, 0)
  }

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleConfigClick = (configId: number) => {
    setSelectedConfigId(configId)
    setDetailSheetOpen(true)
  }

  const handleRefreshCache = async () => {
    setRefreshing(true)
    try {
      const res = await refreshSystemConfigCache()
      if (res.code === 'success') {
        fetchConfigs()
      }
    } catch (error) {
      console.error('Failed to refresh cache:', error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>系统配置</h1>
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={handleRefreshCache} disabled={refreshing}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            刷新缓存
          </Button>
          <CreateConfigDialog onSuccess={fetchConfigs} />
        </div>
      </div>

      <ConfigSearch
        keyword={keyword}
        configGroup={configGroup}
        onKeywordChange={setKeyword}
        onConfigGroupChange={setConfigGroup}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <ConfigTable configs={configs} loading={loading} onConfigClick={handleConfigClick} />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />

      <ConfigDetailSheet
        configId={selectedConfigId}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onConfigUpdated={fetchConfigs}
      />
    </div>
  )
}

export default SettingsPage
