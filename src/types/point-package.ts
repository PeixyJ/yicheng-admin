/**
 * 货币类型枚举
 */
export type Currency = 'CNY' | 'USD'

/**
 * 点数套餐 VO
 */
export interface PointPackageVO {
  /** 套餐ID */
  id: number
  /** 套餐编码 */
  packCode: string
  /** 套餐名称 */
  packName: string
  /** 套餐描述 */
  description: string | null
  /** 包含点数 */
  points: number
  /** 货币类型 */
  currency: Currency
  /** 售价（最小货币单位） */
  price: number
  /** 原价（划线价） */
  originalPrice: number | null
  /** 有效天数 */
  validDays: number | null
  /** Stripe Price ID */
  stripePriceId: string | null
  /** Stripe Product ID */
  stripeProductId: string | null
  /** 排序序号 */
  sortOrder: number
  /** 角标文案 */
  badge: string | null
  /** 限购次数 */
  purchaseLimit: number | null
  /** 最小购买数量 */
  minQuantity: number
  /** 最大购买数量 */
  maxQuantity: number
  /** 上架状态 */
  status: boolean
  /** 是否可见 */
  visible: boolean
  /** 扩展数据 JSON */
  metadata: string | null
}

/**
 * 点数套餐列表查询参数
 */
export interface PointPackageListParams {
  page: number
  size: number
  packCode?: string
  packName?: string
  minPoints?: number
  maxPoints?: number
  currency?: Currency
  minPrice?: number
  maxPrice?: number
  minValidDays?: number
  maxValidDays?: number
  stripePriceId?: string
  stripeProductId?: string
  minPurchaseCount?: number
  maxPurchaseCount?: number
  status?: boolean
  visible?: boolean
}

/**
 * 创建点数套餐请求
 */
export interface CreatePointPackageRequest {
  packCode: string
  packName: string
  description?: string
  points: number
  currency: Currency
  price: number
  originalPrice?: number
  validDays?: number
  sortOrder?: number
  badge?: string
  purchaseLimit?: number
  minQuantity?: number
  maxQuantity?: number
  metadata?: string
}

/**
 * 更新点数套餐请求
 */
export interface UpdatePointPackageRequest {
  packName: string
  description?: string
  points: number
  currency: Currency
  price: number
  originalPrice?: number
  validDays?: number
  stripePriceId?: string
  stripeProductId?: string
  sortOrder?: number
  badge?: string
  purchaseLimit?: number
  minQuantity?: number
  maxQuantity?: number
  metadata?: string
}
