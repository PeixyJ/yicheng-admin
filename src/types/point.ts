/**
 * 交易类型枚举
 */
export type TransactionType = 'PURCHASE' | 'CONSUME' | 'GRANT' | 'ADJUST' | 'EXPIRE' | 'REFUND'

/**
 * 团队点数账户 VO
 */
export interface PointTeamVO {
  /** 主键ID */
  id: number
  /** 团队ID */
  teamId: number
  /** 历史累计获得的总点数 */
  totalPoints: number
  /** 历史累计消耗的点数 */
  usedPoints: number
  /** 当前可用点数 */
  availablePoints: number
  /** 当前冻结中的点数 */
  frozenPoints: number
}

/**
 * 团队点数列表查询参数
 */
export interface PointTeamListParams {
  page: number
  size: number
  teamId?: number
  minTotalPoints?: number
  maxTotalPoints?: number
  minUsePoints?: number
  maxUsePoints?: number
  minAvailablePoints?: number
  maxAvailablePoints?: number
  minFrozenPoints?: number
  maxFrozenPoints?: number
}

/**
 * 点数交易记录 VO
 */
export interface PointTransactionRecordVO {
  /** 主键ID */
  id: number
  /** 团队ID */
  teamId: number
  /** 交易流水号 */
  transactionNo: string
  /** 交易类型 */
  type: TransactionType
  /** 交易类型描述 */
  typeDesc: string
  /** 点数变动量 */
  points: number
  /** 交易后余额 */
  balanceAfter: number
  /** 关联批次ID */
  batchId: number | null
  /** 功能编码 */
  featureCode: string | null
  /** 关联订单ID */
  orderId: number | null
  /** 业务幂等ID */
  bizId: string | null
  /** 操作人ID */
  operatorId: number | null
  /** 交易备注 */
  remark: string | null
  /** 创建时间 */
  createTime: string
}

/**
 * 交易记录查询参数
 */
export interface TransactionListParams {
  page: number
  size: number
  teamId?: number
  transactionNo?: string
  type?: TransactionType
  startTime?: string
  endTime?: string
  minPoints?: number
  maxPoints?: number
}

/**
 * 点数统计 VO
 */
export interface PointStatisticsVO {
  /** 总团队数 */
  totalTeams: number
  /** 有点数的团队数 */
  teamsWithPoints: number
  /** 累计发放总点数 */
  totalGrantedPoints: number
  /** 累计消耗总点数 */
  totalUsedPoints: number
  /** 当前可用总点数 */
  totalAvailablePoints: number
  /** 当前冻结总点数 */
  totalFrozenPoints: number
  /** 今日发放点数 */
  todayGrantedPoints: number
  /** 今日消耗点数 */
  todayUsedPoints: number
  /** 本月发放点数 */
  monthGrantedPoints: number
  /** 本月消耗点数 */
  monthUsedPoints: number
  /** 购买入账总点数 */
  purchasePoints: number
  /** 赠送入账总点数 */
  grantPoints: number
  /** 人工调整总点数（正数） */
  adjustAddPoints: number
  /** 人工调整总点数（负数） */
  adjustSubPoints: number
  /** 过期作废总点数 */
  expiredPoints: number
  /** 退款返还总点数 */
  refundPoints: number
}

/**
 * 赠送点数请求
 */
export interface GrantPointsRequest {
  /** 目标团队ID */
  teamId: number
  /** 赠送点数数量 */
  points: number
  /** 有效天数，NULL表示永不过期 */
  validDays?: number
  /** 赠送原因 */
  reason: string
}

/**
 * 调整点数请求
 */
export interface AdjustPointsRequest {
  /** 目标团队ID */
  teamId: number
  /** 调整点数数量（正数为增加，负数为扣减） */
  points: number
  /** 调整原因 */
  reason: string
}
