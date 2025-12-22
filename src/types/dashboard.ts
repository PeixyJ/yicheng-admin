/**
 * 用户统计
 */
export interface UserStatistics {
  /** 用户总数 */
  totalUsers: number
  /** 今日新增用户 */
  todayNewUsers: number
  /** 待激活用户数 */
  pendingUsers: number
  /** 正常用户数 */
  activeUsers: number
  /** 已封禁用户数 */
  suspendedUsers: number
  /** 已注销用户数 */
  deletedUsers: number
}

/**
 * 订阅计划分布
 */
export interface PlanDistribution {
  /** 计划ID */
  planId: number
  /** 计划名称 */
  planName: string
  /** 订阅数量 */
  subscriptionCount: number
  /** 占比百分比 */
  percentage: number
}

/**
 * 团队/订阅统计
 */
export interface TeamSubscribeStatistics {
  /** 团队总数 */
  totalTeams: number
  /** 活跃团队数 */
  activeTeams: number
  /** 活跃订阅数 */
  activeSubscriptions: number
  /** 订阅计划分布 */
  planDistribution: PlanDistribution[]
  /** MRR（月经常性收入，单位：分） */
  mrr: number
  /** MRR 格式化显示 */
  mrrFormatted: string
}

/**
 * 支付渠道分布
 */
export interface ChannelDistribution {
  /** 渠道编码 */
  channel: string
  /** 渠道名称 */
  channelName: string
  /** 订单数量 */
  orderCount: number
  /** 交易金额（单位：分） */
  amount: number
  /** 占比百分比 */
  percentage: number
}

/**
 * 支付统计
 */
export interface PaymentStatistics {
  /** 总交易额（单位：分） */
  totalRevenue: number
  /** 总交易额格式化显示 */
  totalRevenueFormatted: string
  /** 今日交易额（单位：分） */
  todayRevenue: number
  /** 今日交易额格式化显示 */
  todayRevenueFormatted: string
  /** 订单总数 */
  totalOrders: number
  /** 今日订单数 */
  todayOrders: number
  /** 支付成功率（百分比） */
  successRate: number
  /** 支付渠道分布 */
  channelDistribution: ChannelDistribution[]
}

/**
 * 点数统计
 */
export interface PointStatistics {
  /** 总可用点数 */
  totalAvailable: number
  /** 今日消费点数 */
  todayConsumption: number
  /** 7天内即将过期点数 */
  expiringIn7Days: number
  /** 总冻结点数 */
  totalFrozen: number
}

/**
 * 仪表板统计数据
 */
export interface DashboardStatisticsVO {
  /** 用户统计 */
  user: UserStatistics
  /** 团队/订阅统计 */
  team: TeamSubscribeStatistics
  /** 支付统计 */
  payment: PaymentStatistics
  /** 点数统计 */
  point: PointStatistics
  /** 最后更新时间 */
  lastUpdateTime: string
}
