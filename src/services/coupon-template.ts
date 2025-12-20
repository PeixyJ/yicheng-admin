import { get, post, patch, put, del } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  CouponTemplateVO,
  CouponTemplateDetailVO,
  CouponTemplateListParams,
  CreateCouponTemplateRequest,
  UpdateCouponTemplateRequest,
} from '@/types/coupon-template'

/**
 * 分页查询优惠券模板列表
 */
export function getCouponTemplateList(params: CouponTemplateListParams) {
  return get<PageData<CouponTemplateVO>>('/v1/promotion/coupon-templates', params as unknown as Record<string, string | number | boolean | undefined>)
}

/**
 * 获取优惠券模板详情
 */
export function getCouponTemplateDetail(templateId: number) {
  return get<CouponTemplateDetailVO>(`/v1/promotion/coupon-templates/${templateId}`)
}

/**
 * 创建优惠券模板
 */
export function createCouponTemplate(data: CreateCouponTemplateRequest) {
  return post<number>('/v1/promotion/coupon-templates', data)
}

/**
 * 更新优惠券模板
 */
export function updateCouponTemplate(templateId: number, data: UpdateCouponTemplateRequest) {
  return patch<void>(`/v1/promotion/coupon-templates/${templateId}`, data)
}

/**
 * 删除优惠券模板
 */
export function deleteCouponTemplate(templateId: number) {
  return del<void>(`/v1/promotion/coupon-templates/${templateId}`)
}

/**
 * 切换优惠券模板状态
 */
export function toggleCouponTemplateStatus(templateId: number, enable: boolean) {
  return put<void>(`/v1/promotion/coupon-templates/${templateId}/status?enable=${enable}`)
}
