/**
 * 支付客户 VO
 */
export interface AdminPaymentCustomerVO {
  /** ID */
  id: number
  /** 团队ID */
  teamId: number
  /** 用户ID */
  userId: number
  /** Stripe客户ID */
  stripeCustomerId: string
  /** 邮箱 */
  email: string | null
  /** 名称 */
  name: string | null
  /** 默认支付方式ID */
  defaultPaymentMethod: string | null
  /** 元数据 */
  metadata: string | null
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 客户列表查询参数
 */
export interface PaymentCustomerListParams {
  page: number
  size: number
  teamId?: number
  userId?: number
  stripeCustomerId?: string
  email?: string
  name?: string
}
