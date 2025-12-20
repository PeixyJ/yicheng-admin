import { get } from '@/utils/request'
import type { PageData } from '@/types/api'
import type { AdminPaymentCustomerVO, PaymentCustomerListParams } from '@/types/payment-customer'
import type { AdminPaymentOrderVO } from '@/types/payment-order'

/**
 * 分页查询客户
 */
export function getPaymentCustomerList(params: PaymentCustomerListParams) {
  return get<PageData<AdminPaymentCustomerVO>>('/v1/payment/customer/pages', params as unknown as Record<string, string | number | boolean | undefined>)
}

/**
 * 获取客户详情
 */
export function getPaymentCustomerDetail(customerId: number) {
  return get<AdminPaymentCustomerVO>(`/v1/payment/customer/${customerId}`)
}

/**
 * 根据团队ID获取客户
 */
export function getPaymentCustomerByTeam(teamId: number) {
  return get<AdminPaymentCustomerVO>(`/v1/payment/customer/team/${teamId}`)
}

/**
 * 获取客户的订单列表
 */
export function getCustomerOrders(customerId: number, params: { page: number; size: number }) {
  return get<PageData<AdminPaymentOrderVO>>(`/v1/payment/customer/${customerId}/orders`, params)
}
