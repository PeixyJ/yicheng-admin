/**
 * 优惠券状态
 */
export type CouponStatus = 'UNUSED' | 'USED' | 'EXPIRED' | 'REVOKED'

/**
 * 优惠券来源
 */
export type CouponSource = 'PROMO_CODE' | 'SYSTEM_GRANT' | 'ACTIVITY'

/**
 * 优惠券列表 VO
 */
export interface CouponVO {
  /** 主键ID */
  id: number
  /** 优惠券编号 */
  couponNo: string
  /** 优惠券模板ID */
  templateId: number
  /** 模板名称 */
  templateName: string
  /** 优惠描述 */
  description: string
  /** 折扣类型 */
  discountType: string
  /** 折扣类型描述 */
  discountTypeDesc: string
  /** 折扣值 */
  discountValue: number
  /** 货币类型 */
  currency: string
  /** 所属团队ID */
  teamId: number
  /** 所属用户ID */
  userId: number
  /** 状态 */
  status: CouponStatus
  /** 状态描述 */
  statusDesc: string
  /** 来源 */
  source: CouponSource
  /** 来源描述 */
  sourceDesc: string
  /** 过期时间 */
  expireTime: string
  /** 使用时间 */
  usedTime: string | null
  /** 创建时间 */
  createTime: string
}

/**
 * 优惠券详情 VO
 */
export interface CouponDetailVO {
  /** 主键ID */
  id: number
  /** 优惠券编号 */
  couponNo: string
  /** 优惠券模板ID */
  templateId: number
  /** 模板名称 */
  templateName: string
  /** 优惠描述 */
  description: string
  /** 折扣类型 */
  discountType: string
  /** 折扣类型描述 */
  discountTypeDesc: string
  /** 折扣值 */
  discountValue: number
  /** 货币类型 */
  currency: string
  /** 最大折扣金额 */
  maxDiscountAmount: number | null
  /** 最低订单金额（分） */
  minOrderAmount: number | null
  /** 适用产品类型 */
  applicableProductType: string
  /** 适用产品类型描述 */
  applicableProductTypeDesc: string
  /** 适用产品ID列表 */
  applicableProductIds: number[]
  /** 关联优惠码ID */
  promoCodeId: number | null
  /** 所属团队ID */
  teamId: number
  /** 所属用户ID */
  userId: number
  /** 状态 */
  status: CouponStatus
  /** 状态描述 */
  statusDesc: string
  /** 来源 */
  source: CouponSource
  /** 来源描述 */
  sourceDesc: string
  /** 过期时间 */
  expireTime: string
  /** 使用时间 */
  usedTime: string | null
  /** 使用的订单ID */
  usedOrderId: number | null
  /** 发放原因 */
  grantReason: string | null
  /** 撤销原因 */
  revokeReason: string | null
  /** 扩展数据 */
  metadata: string | null
  /** 创建时间 */
  createTime: string
}

/**
 * 优惠券列表查询参数
 */
export interface CouponListParams {
  /** 页码 */
  page: number
  /** 每页大小 */
  size: number
  /** 优惠券编号（模糊搜索） */
  couponNo?: string
  /** 优惠券模板ID */
  templateId?: number
  /** 所属团队ID */
  teamId?: number
  /** 所属用户ID */
  userId?: number
  /** 优惠券状态 */
  status?: CouponStatus
  /** 优惠券来源 */
  source?: CouponSource
}

/**
 * 批量发放优惠券请求
 */
export interface GrantCouponRequest {
  /** 优惠券模板ID */
  templateId: number
  /** 发放目标团队ID列表 */
  teamIds?: number[]
  /** 发放目标用户ID列表 */
  userIds?: number[]
  /** 优惠券来源 */
  source: CouponSource
  /** 发放原因 */
  grantReason?: string
}
