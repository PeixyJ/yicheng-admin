/**
 * 折扣类型
 */
export type DiscountType = 'FIXED_AMOUNT' | 'PERCENT' | 'FREE_TRIAL'

/**
 * 适用产品类型
 */
export type ApplicableProductType = 'ALL' | 'SUBSCRIPTION' | 'POINT'

/**
 * 优惠码列表VO
 */
export interface PromoCodeVO {
  /** 主键ID */
  id: number
  /** 优惠码 */
  code: string
  /** 优惠码名称 */
  name: string
  /** 优惠描述 */
  description: string | null
  /** 折扣类型 */
  discountType: DiscountType
  /** 折扣类型描述 */
  discountTypeDesc: string
  /** 折扣值 */
  discountValue: number
  /** 货币类型 */
  currency: string | null
  /** 已使用次数 */
  usedCount: number
  /** 总使用次数限制 */
  totalLimit: number | null
  /** 生效开始时间 */
  startTime: string
  /** 生效结束时间 */
  endTime: string
  /** 启用状态 */
  status: boolean
  /** 启用状态描述 */
  statusDesc: string
  /** 是否在有效期内 */
  isActive: boolean
  /** 创建时间 */
  createTime: string
}

/**
 * 优惠码详情VO
 */
export interface PromoCodeDetailVO {
  /** 主键ID */
  id: number
  /** 优惠码 */
  code: string
  /** 优惠码名称 */
  name: string
  /** 优惠描述 */
  description: string | null
  /** 折扣类型 */
  discountType: DiscountType
  /** 折扣类型描述 */
  discountTypeDesc: string
  /** 折扣值 */
  discountValue: number
  /** 货币类型 */
  currency: string | null
  /** 最大折扣金额 */
  maxDiscountAmount: number | null
  /** 最低订单金额（分） */
  minOrderAmount: number | null
  /** 适用产品类型 */
  applicableProductType: ApplicableProductType
  /** 适用产品类型描述 */
  applicableProductTypeDesc: string
  /** 适用产品ID列表 */
  applicableProductIds: number[] | null
  /** 总使用次数限制 */
  totalLimit: number | null
  /** 每用户使用次数限制 */
  perUserLimit: number | null
  /** 每团队使用次数限制 */
  perTeamLimit: number | null
  /** 已使用次数 */
  usedCount: number
  /** 生效开始时间 */
  startTime: string
  /** 生效结束时间 */
  endTime: string
  /** 是否仅限首单使用 */
  isFirstOrderOnly: boolean
  /** 是否仅限新用户 */
  isNewUserOnly: boolean
  /** 启用状态 */
  status: boolean
  /** 启用状态描述 */
  statusDesc: string
  /** 是否在有效期内 */
  isActive: boolean
  /** 扩展数据 */
  metadata: string | null
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 创建优惠码请求
 */
export interface CreatePromoCodeRequest {
  /** 优惠码（大写字母+数字） */
  code: string
  /** 优惠码名称（内部管理用） */
  name: string
  /** 优惠描述（用户可见） */
  description?: string
  /** 折扣类型 */
  discountType: DiscountType
  /** 折扣值（金额或百分比） */
  discountValue: number
  /** 货币类型（仅FIXED_AMOUNT有效） */
  currency?: string
  /** 最大折扣金额（仅PERCENT有效） */
  maxDiscountAmount?: number
  /** 最低订单金额（分） */
  minOrderAmount?: number
  /** 适用产品类型 */
  applicableProductType: ApplicableProductType
  /** 适用产品ID列表 */
  applicableProductIds?: number[]
  /** 总使用次数限制（NULL表示不限） */
  totalLimit?: number
  /** 每用户使用次数限制（NULL表示不限） */
  perUserLimit?: number
  /** 每团队使用次数限制（NULL表示不限） */
  perTeamLimit?: number
  /** 生效开始时间 */
  startTime: string
  /** 生效结束时间 */
  endTime: string
  /** 是否仅限首单使用 */
  isFirstOrderOnly?: boolean
  /** 是否仅限新用户 */
  isNewUserOnly?: boolean
  /** 扩展数据（JSON） */
  metadata?: string
}

/**
 * 更新优惠码请求
 */
export interface UpdatePromoCodeRequest {
  /** 优惠码名称（内部管理用） */
  name?: string
  /** 优惠描述（用户可见） */
  description?: string
  /** 折扣类型 */
  discountType?: DiscountType
  /** 折扣值（金额或百分比） */
  discountValue?: number
  /** 货币类型（仅FIXED_AMOUNT有效） */
  currency?: string
  /** 最大折扣金额（仅PERCENT有效） */
  maxDiscountAmount?: number
  /** 最低订单金额（分） */
  minOrderAmount?: number
  /** 适用产品类型 */
  applicableProductType?: ApplicableProductType
  /** 适用产品ID列表 */
  applicableProductIds?: number[]
  /** 总使用次数限制（NULL表示不限） */
  totalLimit?: number
  /** 每用户使用次数限制（NULL表示不限） */
  perUserLimit?: number
  /** 每团队使用次数限制（NULL表示不限） */
  perTeamLimit?: number
  /** 生效开始时间 */
  startTime?: string
  /** 生效结束时间 */
  endTime?: string
  /** 是否仅限首单使用 */
  isFirstOrderOnly?: boolean
  /** 是否仅限新用户 */
  isNewUserOnly?: boolean
  /** 扩展数据（JSON） */
  metadata?: string
}

/**
 * 列表查询参数
 */
export interface PromoCodeListParams {
  /** 页码 */
  page: number
  /** 每页大小 */
  size: number
  /** 优惠码（模糊搜索） */
  code?: string
  /** 优惠码名称（模糊搜索） */
  name?: string
  /** 折扣类型 */
  discountType?: DiscountType
  /** 启用状态 */
  status?: boolean
  /** 是否在有效期内 */
  isActive?: boolean
}

/**
 * 使用记录VO
 */
export interface PromoCodeUsageVO {
  /** 记录ID */
  id: number
  /** 优惠码ID */
  promoCodeId: number
  /** 优惠码 */
  promoCode: string
  /** 使用团队ID */
  teamId: number
  /** 使用用户ID */
  userId: number
  /** 关联订单ID */
  orderId: number
  /** 生成的优惠券ID */
  couponId: number
  /** 实际折扣金额（分） */
  discountAmount: number
  /** 使用时间 */
  usedTime: string
}
