import { get } from '@/utils/request'
import type { DashboardStatisticsVO } from '@/types/dashboard'

/**
 * 获取仪表板统计数据
 */
export function getDashboardStatistics() {
  return get<DashboardStatisticsVO>('/v1/dashboard/statistics')
}
