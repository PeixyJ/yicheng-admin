/**
 * 计划类型枚举
 */
export type PlanType = 'FREE' | 'TRIAL' | 'PAID'

/**
 * 订阅状态枚举
 */
export type SubscribeStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'UPGRADED'

/**
 * 订阅来源枚举
 */
export type SubscribeSource = 'PURCHASE' | 'GRANT' | 'SYSTEM'

/**
 * 功能类型枚举
 */
export type FeatureType = 'BOOLEAN' | 'POINTS'

/**
 * 功能 VO
 */
export interface FeatureVO {
  /** 主键ID */
  id: number
  /** 功能编码 */
  featureCode: string
  /** 功能名称 */
  featureName: string
  /** 功能类型 */
  featureType: FeatureType
  /** 功能类型名称 */
  featureTypeName: string
  /** 功能描述 */
  description: string | null
  /** 每次使用消耗的点数 */
  pointsCost: number | null
  /** 排序序号 */
  sortOrder: number
  /** 启用状态 */
  status: boolean
}

/**
 * 订阅计划 VO
 */
export interface SubscribePlanVO {
  /** 主键ID */
  id: number
  /** 计划编码 */
  planCode: string
  /** 计划名称 */
  planName: string
  /** 计划等级 */
  planLevel: number
  /** 计划类型 */
  planType: PlanType
  /** 计划描述 */
  description: string | null
  /** 销售价格 */
  price: number
  /** 原价 */
  originalPrice: number | null
  /** 货币类型 */
  currency: string
  /** 订阅有效天数 */
  durationDays: number | null
  /** 每日配额限制 */
  dailyQuota: number | null
  /** 每月配额限制 */
  monthlyQuota: number | null
  /** 资源上限配置JSON */
  resourceLimits: string | null
  /** 最小席位数 */
  minSeats: number | null
  /** 最大席位数 */
  maxSeats: number | null
  /** 每席位月付单价 */
  seatPrice: number | null
  /** 每席位年付单价 */
  seatPriceYearly: number | null
  /** 每个团队最大购买次数 */
  maxPurchaseCount: number | null
  /** 管理员最大赠送次数 */
  maxGrantCount: number | null
  /** 是否默认计划 */
  isDefault: boolean
  /** 是否试用计划 */
  isTrial: boolean
  /** 是否可见 */
  isVisible: boolean
  /** 排序序号 */
  sortOrder: number
  /** 启用状态 */
  status: boolean
  /** 关联的功能列表 */
  features: FeatureVO[]
}

/**
 * 订阅信息 VO
 */
export interface SubscribeVO {
  /** 主键ID */
  id: number
  /** 团队ID */
  teamId: number
  /** 计划ID */
  planId: number
  /** 订阅状态 */
  status: SubscribeStatus
  /** 订阅来源 */
  source: SubscribeSource
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string | null
  /** 席位数 */
  seats: number
  /** 订单ID */
  orderId: number | null
  /** 前一个订阅ID */
  previousSubscriptionId: number | null
  /** 赠送操作的管理员ID */
  grantUserId: number | null
  /** 赠送原因 */
  grantReason: string | null
}

/**
 * 订阅计划列表查询参数
 */
export interface PlanListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 计划编码 */
  planCode?: string
  /** 计划名称 */
  planName?: string
  /** 计划等级 */
  planLevel?: number
  /** 计划类型 */
  planType?: PlanType
  /** 货币类型 */
  currency?: string
  /** 最低价格 */
  minPrice?: string
  /** 最高价格 */
  maxPrice?: string
  /** 创建时间起始 */
  minCreateTime?: string
  /** 创建时间结束 */
  maxCreateTime?: string
  /** 是否默认计划 */
  isDefault?: boolean
  /** 是否试用计划 */
  isTrial?: boolean
  /** 是否可见 */
  isVisible?: boolean
  /** 启用状态 */
  status?: boolean
}

/**
 * 创建订阅计划请求
 */
export interface CreatePlanRequest {
  /** 计划编码 */
  planCode: string
  /** 计划名称 */
  planName: string
  /** 计划等级 */
  planLevel: number
  /** 计划类型 */
  planType: PlanType
  /** 计划描述 */
  description?: string
  /** 销售价格 */
  price: number
  /** 原价 */
  originalPrice?: number
  /** 货币类型 */
  currency: string
  /** 订阅有效天数 */
  durationDays?: number
  /** 每日配额限制 */
  dailyQuota?: number
  /** 每月配额限制 */
  monthlyQuota?: number
  /** 资源上限配置JSON */
  resourceLimits?: string
  /** 最小席位数 */
  minSeats?: number
  /** 最大席位数 */
  maxSeats?: number
  /** 每席位月付单价 */
  seatPrice?: number
  /** 每席位年付单价 */
  seatPriceYearly?: number
  /** 每个团队最大购买次数 */
  maxPurchaseCount?: number
  /** 管理员最大赠送次数 */
  maxGrantCount?: number
  /** 是否试用计划 */
  isTrial?: boolean
  /** 是否可见 */
  isVisible?: boolean
  /** 排序序号 */
  sortOrder?: number
  /** 启用状态 */
  status?: boolean
}

/**
 * 更新订阅计划请求
 */
export interface UpdatePlanRequest {
  /** 计划名称 */
  planName?: string
  /** 计划等级 */
  planLevel?: number
  /** 计划类型 */
  planType?: PlanType
  /** 计划描述 */
  description?: string
  /** 销售价格 */
  price?: number
  /** 原价 */
  originalPrice?: number
  /** 货币类型 */
  currency?: string
  /** 订阅有效天数 */
  durationDays?: number
  /** 每日配额限制 */
  dailyQuota?: number
  /** 每月配额限制 */
  monthlyQuota?: number
  /** 资源上限配置JSON */
  resourceLimits?: string
  /** 最小席位数 */
  minSeats?: number
  /** 最大席位数 */
  maxSeats?: number
  /** 每席位月付单价 */
  seatPrice?: number
  /** 每席位年付单价 */
  seatPriceYearly?: number
  /** 每个团队最大购买次数 */
  maxPurchaseCount?: number
  /** 管理员最大赠送次数 */
  maxGrantCount?: number
  /** 是否默认计划 */
  isDefault?: boolean
  /** 是否试用计划 */
  isTrial?: boolean
  /** 是否可见 */
  isVisible?: boolean
  /** 排序序号 */
  sortOrder?: number
}

/**
 * 关联功能请求
 */
export interface AssignFeatureToPlanRequest {
  /** 功能ID列表 */
  featureIds: number[]
}

/**
 * 计划关联功能查询参数
 */
export interface PlanFeatureListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 功能名称 */
  featureName?: string
  /** 功能编码 */
  featureCode?: string
  /** 功能类型 */
  featureType?: FeatureType
  /** 启用状态 */
  status?: boolean
}

/**
 * 计划关联订阅查询参数
 */
export interface PlanSubscribeListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 团队ID */
  teamId?: number
  /** 订阅状态 */
  status?: SubscribeStatus
  /** 订阅来源 */
  source?: SubscribeSource
  /** 开始时间起始 */
  minStartTime?: string
  /** 开始时间结束 */
  maxStartTime?: string
  /** 结束时间起始 */
  minEndTime?: string
  /** 结束时间结束 */
  maxEndTime?: string
  /** 最小席位数 */
  minSeats?: number
  /** 最大席位数 */
  maxSeats?: number
  /** 订单ID */
  orderId?: number
  /** 赠送操作的管理员ID */
  grantUserId?: number
}
