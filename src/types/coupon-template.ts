/**
 * 折扣类型
 */
export type DiscountType = 'FIXED_AMOUNT' | 'PERCENT' | 'FREE_TRIAL'

/**
 * 适用产品类型
 */
export type ApplicableProductType = 'ALL' | 'SUBSCRIPTION' | 'POINT'

/**
 * 优惠券模板列表VO
 */
export interface CouponTemplateVO {
  /** 主键ID */
  id: number
  /** 模板名称 */
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
  /** 有效天数 */
  validDays: number
  /** 总发放数量限制 */
  totalQuantity: number | null
  /** 已发放数量 */
  issuedQuantity: number
  /** 启用状态 */
  status: boolean
  /** 启用状态描述 */
  statusDesc: string
  /** 创建时间 */
  createTime: string
}

/**
 * 优惠券模板详情VO
 */
export interface CouponTemplateDetailVO {
  /** 主键ID */
  id: number
  /** 模板名称 */
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
  /** 有效天数 */
  validDays: number
  /** 总发放数量限制 */
  totalQuantity: number | null
  /** 已发放数量 */
  issuedQuantity: number
  /** 每团队领取限制 */
  perTeamLimit: number | null
  /** 每用户领取限制 */
  perUserLimit: number | null
  /** 启用状态 */
  status: boolean
  /** 启用状态描述 */
  statusDesc: string
  /** 扩展数据 */
  metadata: string | null
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 创建优惠券模板请求
 */
export interface CreateCouponTemplateRequest {
  /** 模板名称（内部管理用） */
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
  /** 有效天数（发放后N天内有效） */
  validDays: number
  /** 总发放数量限制（NULL表示不限） */
  totalQuantity?: number
  /** 每团队领取限制（NULL表示不限） */
  perTeamLimit?: number
  /** 每用户领取限制（NULL表示不限） */
  perUserLimit?: number
  /** 扩展数据（JSON） */
  metadata?: string
}

/**
 * 更新优惠券模板请求
 */
export interface UpdateCouponTemplateRequest {
  /** 模板名称（内部管理用） */
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
  /** 有效天数（发放后N天内有效） */
  validDays?: number
  /** 总发放数量限制（NULL表示不限） */
  totalQuantity?: number
  /** 每团队领取限制（NULL表示不限） */
  perTeamLimit?: number
  /** 每用户领取限制（NULL表示不限） */
  perUserLimit?: number
  /** 扩展数据（JSON） */
  metadata?: string
}

/**
 * 列表查询参数
 */
export interface CouponTemplateListParams {
  /** 页码 */
  page: number
  /** 每页大小 */
  size: number
  /** 模板名称（模糊搜索） */
  name?: string
  /** 折扣类型 */
  discountType?: DiscountType
  /** 启用状态 */
  status?: boolean
}
