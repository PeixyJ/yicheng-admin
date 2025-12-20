import { get, post } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  AdminPaymentOrderVO,
  AdminPaymentOrderDetailVO,
  PaymentOrderListParams,
  RefundOrderRequest,
  PaymentStatisticsVO,
} from '@/types/payment-order'

/**
 * 分页查询订单
 */
export function getPaymentOrderList(params: PaymentOrderListParams) {
  return get<PageData<AdminPaymentOrderVO>>('/v1/payment/order/pages', params as unknown as Record<string, string | number | boolean | undefined>)
}

/**
 * 获取订单详情
 */
export function getPaymentOrderDetail(orderId: number) {
  return get<AdminPaymentOrderDetailVO>(`/v1/payment/order/${orderId}`)
}

/**
 * 根据订单号获取订单
 */
export function getPaymentOrderByNo(orderNo: string) {
  return get<AdminPaymentOrderDetailVO>(`/v1/payment/order/no/${orderNo}`)
}

/**
 * 订单退款
 */
export function refundOrder(data: RefundOrderRequest) {
  return post<void>('/v1/payment/order/refund', data)
}

/**
 * 取消订单
 */
export function cancelOrder(orderId: number, reason?: string) {
  const url = reason
    ? `/v1/payment/order/${orderId}/cancel?reason=${encodeURIComponent(reason)}`
    : `/v1/payment/order/${orderId}/cancel`
  return post<void>(url)
}

/**
 * 获取支付统计数据
 */
export function getPaymentStatistics() {
  return get<PaymentStatisticsVO>('/v1/payment/order/statistics')
}
