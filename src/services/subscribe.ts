import { get, post } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  AdminSubscribeVO,
  SubscribeListParams,
  GiftSubscribeRequest,
  UpgradeSubscribeRequest,
  CancelSubscribeRequest,
} from '@/types/subscribe'

/**
 * 分页查询订阅列表
 */
export function getSubscribeList(params: SubscribeListParams) {
  return get<PageData<AdminSubscribeVO>>('/v1/subscribe/pages', {
    page: params.page,
    size: params.size,
    teamId: params.teamId,
    planId: params.planId,
    status: params.status,
    source: params.source,
    minStartTime: params.minStartTime,
    maxStartTime: params.maxStartTime,
    minEndTime: params.minEndTime,
    maxEndTime: params.maxEndTime,
    minSeats: params.minSeats,
    maxSeats: params.maxSeats,
    orderId: params.orderId,
    grantUserId: params.grantUserId,
  })
}

/**
 * 赠送订阅
 */
export function giftSubscribe(data: GiftSubscribeRequest) {
  return post<void>('/v1/subscribe/gift', data)
}

/**
 * 升级订阅
 */
export function upgradeSubscribe(data: UpgradeSubscribeRequest) {
  return post<void>('/v1/subscribe/upgrade', data)
}

/**
 * 取消订阅
 */
export function cancelSubscribe(data: CancelSubscribeRequest) {
  return post<void>('/v1/subscribe/cancel', data)
}
