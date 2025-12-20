import { get, post, patch, del } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  PromoCodeVO,
  PromoCodeDetailVO,
  PromoCodeListParams,
  CreatePromoCodeRequest,
  UpdatePromoCodeRequest,
  PromoCodeUsageVO,
} from '@/types/promo-code'

/**
 * 分页查询优惠码列表
 */
export function getPromoCodeList(params: PromoCodeListParams) {
  return get<PageData<PromoCodeVO>>('/v1/promotion/promo-codes', params as unknown as Record<string, string | number | boolean | undefined>)
}

/**
 * 获取优惠码详情
 */
export function getPromoCodeDetail(promoCodeId: number) {
  return get<PromoCodeDetailVO>(`/v1/promotion/promo-codes/${promoCodeId}`)
}

/**
 * 创建优惠码
 */
export function createPromoCode(data: CreatePromoCodeRequest) {
  return post<number>('/v1/promotion/promo-codes', data)
}

/**
 * 更新优惠码
 */
export function updatePromoCode(promoCodeId: number, data: UpdatePromoCodeRequest) {
  return patch<void>(`/v1/promotion/promo-codes/${promoCodeId}`, data)
}

/**
 * 删除优惠码
 */
export function deletePromoCode(promoCodeId: number) {
  return del<void>(`/v1/promotion/promo-codes/${promoCodeId}`)
}

/**
 * 分页查询优惠码使用记录
 */
export function getPromoCodeUsages(promoCodeId: number, params: { page: number; size: number }) {
  return get<PageData<PromoCodeUsageVO>>(`/v1/promotion/promo-codes/${promoCodeId}/usages`, params)
}
