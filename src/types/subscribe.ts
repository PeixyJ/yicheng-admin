import type { SubscribeStatus, SubscribeSource } from './plan'

/**
 * 订阅信息 VO（扩展版，包含关联信息）
 */
export interface AdminSubscribeVO {
  /** 主键ID */
  id: number
  /** 团队ID */
  teamId: number
  /** 团队名称 */
  teamName: string | null
  /** 团队Logo */
  teamLogoUrl: string | null
  /** 计划ID */
  planId: number
  /** 计划编码 */
  planCode: string | null
  /** 计划名称 */
  planName: string | null
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
  /** 赠送操作人编号 */
  grantUserNo: string | null
  /** 赠送操作人昵称 */
  grantUserNickname: string | null
  /** 赠送原因 */
  grantReason: string | null
}

/**
 * 订阅列表查询参数
 */
export interface SubscribeListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 团队ID */
  teamId?: number
  /** 计划ID */
  planId?: number
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

/**
 * 赠送订阅请求
 */
export interface GiftSubscribeRequest {
  /** 订阅计划ID */
  subscribePlanId: number
  /** 团队ID */
  teamId: number
  /** 赠送座位数 */
  seats: number
  /** 赠送理由 */
  reason: string
}

/**
 * 升级订阅请求
 */
export interface UpgradeSubscribeRequest {
  /** 订阅ID */
  subscribeId: number
  /** 新的订阅计划ID */
  newSubscribePlanId: number
  /** 升级理由 */
  reason: string
}

/**
 * 取消订阅请求
 */
export interface CancelSubscribeRequest {
  /** 订阅ID */
  subscribeId: number
}

// 重新导出常用类型
export type { SubscribeStatus, SubscribeSource } from './plan'
