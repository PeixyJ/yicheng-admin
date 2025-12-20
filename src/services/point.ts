import { get, post } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  PointTeamVO,
  PointTeamListParams,
  PointTransactionRecordVO,
  TransactionListParams,
  PointStatisticsVO,
  GrantPointsRequest,
  AdjustPointsRequest,
} from '@/types/point'

/**
 * 获取团队点数分页列表
 */
export function getPointTeamList(params: PointTeamListParams) {
  return get<PageData<PointTeamVO>>('/v1/point/team/page', {
    page: params.page,
    size: params.size,
    teamId: params.teamId,
    minTotalPoints: params.minTotalPoints,
    maxTotalPoints: params.maxTotalPoints,
    minUsePoints: params.minUsePoints,
    maxUsePoints: params.maxUsePoints,
    minAvailablePoints: params.minAvailablePoints,
    maxAvailablePoints: params.maxAvailablePoints,
    minFrozenPoints: params.minFrozenPoints,
    maxFrozenPoints: params.maxFrozenPoints,
  })
}

/**
 * 获取团队点数详情
 */
export function getPointTeamDetail(teamId: number) {
  return get<PointTeamVO>(`/v1/point/team/${teamId}`)
}

/**
 * 赠送点数给团队
 */
export function grantPoints(data: GrantPointsRequest) {
  return post<void>('/v1/point/team/grant', data)
}

/**
 * 人工调整团队点数
 */
export function adjustPoints(data: AdjustPointsRequest) {
  return post<void>('/v1/point/team/adjust', data)
}

/**
 * 分页查询交易记录
 */
export function getTransactionList(params: TransactionListParams) {
  return get<PageData<PointTransactionRecordVO>>('/v1/point/team/transaction/page', {
    page: params.page,
    size: params.size,
    teamId: params.teamId,
    transactionNo: params.transactionNo,
    type: params.type,
    startTime: params.startTime,
    endTime: params.endTime,
    minPoints: params.minPoints,
    maxPoints: params.maxPoints,
  })
}

/**
 * 获取交易记录详情
 */
export function getTransactionDetail(transactionId: number) {
  return get<PointTransactionRecordVO>(`/v1/point/team/transaction/${transactionId}`)
}

/**
 * 获取点数统计报表
 */
export function getPointStatistics() {
  return get<PointStatisticsVO>('/v1/point/team/statistics')
}
