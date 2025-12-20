import { get, post } from '@/utils/request'
import type { PageData } from '@/types/api'
import type { AdminPaymentEventVO, PaymentEventListParams } from '@/types/payment-event'

/**
 * 分页查询Webhook事件
 */
export function getPaymentEventList(params: PaymentEventListParams) {
  return get<PageData<AdminPaymentEventVO>>('/v1/payment/event/pages', params as unknown as Record<string, string | number | boolean | undefined>)
}

/**
 * 获取事件详情
 */
export function getPaymentEventDetail(eventId: number) {
  return get<AdminPaymentEventVO>(`/v1/payment/event/${eventId}`)
}

/**
 * 重试处理失败的事件
 */
export function retryPaymentEvent(eventId: number) {
  return post<void>(`/v1/payment/event/${eventId}/retry`)
}
