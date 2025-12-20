/**
 * Webhook事件处理状态
 */
export type EventProcessStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'SKIPPED'
  | 'PERMANENTLY_FAILED'

/**
 * Webhook事件VO (Admin端)
 */
export interface AdminPaymentEventVO {
  /** ID */
  id: number
  /** Stripe事件ID */
  stripeEventId: string
  /** 事件类型 */
  eventType: string
  /** API版本 */
  apiVersion: string
  /** 处理状态 */
  processStatus: EventProcessStatus
  /** 处理状态描述 */
  processStatusDesc: string
  /** 处理消息 */
  processMessage: string | null
  /** 处理时间 */
  processTime: string | null
  /** 重试次数 */
  retryCount: number
  /** 是否可重试 */
  canRetry: boolean
  /** 事件数据（JSON） */
  payload: string
  /** 创建时间 */
  createTime: string
}

/**
 * 事件列表查询参数
 */
export interface PaymentEventListParams {
  /** 页码 */
  page: number
  /** 每页大小 */
  size: number
  /** Stripe事件ID */
  stripeEventId?: string
  /** 事件类型（支持模糊查询） */
  eventType?: string
  /** 处理状态 */
  processStatus?: EventProcessStatus
  /** 创建时间开始 */
  createTimeStart?: string
  /** 创建时间结束 */
  createTimeEnd?: string
  /** 最小重试次数 */
  retryCountMin?: number
}
