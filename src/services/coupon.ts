import { get, post, put } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  CouponVO,
  CouponDetailVO,
  CouponListParams,
  GrantCouponRequest,
  CouponStatus,
} from '@/types/coupon'

/**
 * 分页查询优惠券列表
 */
export function getCouponList(params: CouponListParams) {
  return get<PageData<CouponVO>>('/v1/promotion/coupons', {
    page: params.page,
    size: params.size,
    couponNo: params.couponNo,
    templateId: params.templateId,
    teamId: params.teamId,
    userId: params.userId,
    status: params.status,
    source: params.source,
  })
}

/**
 * 获取优惠券详情
 */
export function getCouponDetail(couponId: number) {
  return get<CouponDetailVO>(`/v1/promotion/coupons/${couponId}`)
}

/**
 * 批量发放优惠券
 */
export function grantCoupons(data: GrantCouponRequest) {
  return post<number[]>('/v1/promotion/coupons/grant', data)
}

/**
 * 撤销优惠券
 */
export function revokeCoupon(couponId: number, reason: string) {
  return put<void>(`/v1/promotion/coupons/${couponId}/revoke?reason=${encodeURIComponent(reason)}`)
}

/**
 * 查询团队的优惠券列表
 */
export function getTeamCoupons(
  teamId: number,
  page: number,
  size: number,
  status?: CouponStatus
) {
  return get<PageData<CouponVO>>(`/v1/promotion/coupons/team/${teamId}`, {
    page,
    size,
    status,
  })
}
