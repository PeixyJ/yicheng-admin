/**
 * 支付渠道
 */
export type PaymentChannel = 'STRIPE' | 'ALIPAY' | 'WECHAT_PAY'

/**
 * 订单类型
 */
export type OrderType = 'NEW' | 'UPGRADE' | 'RENEW' | 'POINT_PURCHASE'

/**
 * 订单状态
 */
export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIAL_REFUNDED'

/**
 * 订单列表项 VO
 */
export interface AdminPaymentOrderVO {
  /** 订单ID */
  id: number
  /** 订单号 */
  orderNo: string
  /** 团队ID */
  teamId: number
  /** 团队名称 */
  teamName: string | null
  /** 团队Logo */
  teamLogoUrl: string | null
  /** 用户ID */
  userId: number
  /** 用户昵称 */
  userNickname: string | null
  /** 用户头像 */
  userAvatarUrl: string | null
  /** 支付渠道 */
  paymentChannel: string
  /** 支付渠道描述 */
  paymentChannelDesc: string
  /** 订单类型 */
  orderType: string
  /** 订单类型描述 */
  orderTypeDesc: string
  /** 订单状态 */
  orderStatus: OrderStatus
  /** 订单状态描述 */
  orderStatusDesc: string
  /** 货币类型 */
  currency: string
  /** 订单金额（格式化后） */
  amountFormatted: string
  /** 订单金额（分） */
  amount: number
  /** 实付金额（分） */
  amountPaid: number
  /** 已退款金额（分） */
  amountRefunded: number
  /** 产品类型 */
  productType: string
  /** 产品类型描述 */
  productTypeDesc: string
  /** 支付方式 */
  paymentMethod: string
  /** 支付方式描述 */
  paymentMethodDesc: string
  /** 银行卡信息 */
  cardInfo: string | null
  /** 支付时间 */
  paidTime: string | null
  /** 创建时间 */
  createTime: string
}

/**
 * 订单详情 VO
 */
export interface AdminPaymentOrderDetailVO {
  /** 订单ID */
  id: number
  /** 订单号 */
  orderNo: string
  /** 团队ID */
  teamId: number
  /** 团队名称 */
  teamName: string | null
  /** 团队Logo */
  teamLogoUrl: string | null
  /** 用户ID */
  userId: number
  /** 用户昵称 */
  userNickname: string | null
  /** 用户头像 */
  userAvatarUrl: string | null
  /** 支付渠道 */
  paymentChannel: string
  /** 支付渠道描述 */
  paymentChannelDesc: string
  /** 渠道订单号 */
  channelOrderNo: string | null
  /** 渠道客户ID */
  channelCustomerId: string | null
  /** 订单类型 */
  orderType: string
  /** 订单类型描述 */
  orderTypeDesc: string
  /** 订单状态 */
  orderStatus: OrderStatus
  /** 订单状态描述 */
  orderStatusDesc: string
  /** 是否可退款 */
  canRefund: boolean
  /** 是否可取消 */
  canCancel: boolean
  /** 货币类型 */
  currency: string
  /** 货币符号 */
  currencySymbol: string
  /** 订单金额（分） */
  amount: number
  /** 订单金额（格式化） */
  amountFormatted: string
  /** 实付金额（分） */
  amountPaid: number
  /** 实付金额（格式化） */
  amountPaidFormatted: string
  /** 已退款金额（分） */
  amountRefunded: number
  /** 已退款金额（格式化） */
  amountRefundedFormatted: string
  /** 可退金额（分） */
  refundableAmount: number
  /** 产品类型 */
  productType: string
  /** 产品类型描述 */
  productTypeDesc: string
  /** 产品ID */
  productId: number | null
  /** 计划编码 */
  planCode: string | null
  /** 购买数量 */
  quantity: number
  /** 支付方式 */
  paymentMethod: string | null
  /** 支付方式描述 */
  paymentMethodDesc: string | null
  /** 银行卡后4位 */
  cardLast4: string | null
  /** 银行卡品牌 */
  cardBrand: string | null
  /** 支付时间 */
  paidTime: string | null
  /** 订单过期时间 */
  expireTime: string | null
  /** Stripe客户ID */
  stripeCustomerId: string | null
  /** Stripe支付意图ID */
  stripePaymentIntentId: string | null
  /** Stripe发票ID */
  stripeInvoiceId: string | null
  /** Stripe订阅ID */
  stripeSubscriptionId: string | null
  /** Stripe扣款ID */
  stripeChargeId: string | null
  /** Stripe会话ID */
  stripeSessionId: string | null
  /** 扩展数据 */
  metadata: string | null
  /** 失败原因 */
  failureReason: string | null
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 订单列表查询参数
 */
export interface PaymentOrderListParams {
  page: number
  size: number
  orderNo?: string
  teamId?: number
  userId?: number
  paymentChannel?: PaymentChannel
  orderType?: OrderType
  orderStatus?: OrderStatus
  productType?: string
  channelOrderNo?: string
  createTimeStart?: string
  createTimeEnd?: string
  paidTimeStart?: string
  paidTimeEnd?: string
  amountMin?: number
  amountMax?: number
}

/**
 * 退款请求
 */
export interface RefundOrderRequest {
  /** 订单ID */
  orderId: number
  /** 退款金额（分），为空时全额退款 */
  refundAmount?: number
  /** 退款原因 */
  reason?: string
}

/**
 * 渠道统计
 */
export interface ChannelStatistics {
  /** 渠道编码 */
  channel: string
  /** 渠道名称 */
  channelName: string
  /** 订单数 */
  orderCount: number
  /** 交易金额 */
  amount: number
  /** 交易金额（格式化） */
  amountFormatted: string
  /** 占比 */
  percentage: number
}

/**
 * 支付统计 VO
 */
export interface PaymentStatisticsVO {
  /** 订单总数 */
  totalOrders: number
  /** 待支付订单数 */
  pendingOrders: number
  /** 已支付订单数 */
  paidOrders: number
  /** 支付失败订单数 */
  failedOrders: number
  /** 已取消订单数 */
  cancelledOrders: number
  /** 已退款订单数 */
  refundedOrders: number
  /** 总交易金额 */
  totalAmount: number
  /** 总交易金额（格式化） */
  totalAmountFormatted: string
  /** 总实收金额 */
  totalAmountPaid: number
  /** 总实收金额（格式化） */
  totalAmountPaidFormatted: string
  /** 总退款金额 */
  totalAmountRefunded: number
  /** 总退款金额（格式化） */
  totalAmountRefundedFormatted: string
  /** 各渠道订单统计 */
  channelStatistics: ChannelStatistics[]
  /** 今日订单数 */
  todayOrders: number
  /** 今日成功订单数 */
  todayPaidOrders: number
  /** 今日交易金额 */
  todayAmount: number
  /** 今日交易金额（格式化） */
  todayAmountFormatted: string
}
