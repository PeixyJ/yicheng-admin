import { get, post, put, patch } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  PointPackageVO,
  PointPackageListParams,
  CreatePointPackageRequest,
  UpdatePointPackageRequest,
} from '@/types/point-package'

/**
 * 分页查询点数套餐列表
 */
export function getPointPackageList(params: PointPackageListParams) {
  return get<PageData<PointPackageVO>>('/v1/point/packages', {
    page: params.page,
    size: params.size,
    packCode: params.packCode,
    packName: params.packName,
    minPoints: params.minPoints,
    maxPoints: params.maxPoints,
    currency: params.currency,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    minValidDays: params.minValidDays,
    maxValidDays: params.maxValidDays,
    stripePriceId: params.stripePriceId,
    stripeProductId: params.stripeProductId,
    minPurchaseCount: params.minPurchaseCount,
    maxPurchaseCount: params.maxPurchaseCount,
    status: params.status,
    visible: params.visible,
  })
}

/**
 * 创建点数套餐
 */
export function createPointPackage(data: CreatePointPackageRequest) {
  return post<void>('/v1/point/packages', data)
}

/**
 * 更新点数套餐
 */
export function updatePointPackage(packageId: number, data: UpdatePointPackageRequest) {
  return patch<void>(`/v1/point/packages/${packageId}`, data)
}

/**
 * 更新上架状态
 */
export function updatePointPackageStatus(packageId: number, status: boolean) {
  return put<void>(`/v1/point/packages/${packageId}/status?status=${status}`)
}

/**
 * 更新可见状态
 */
export function updatePointPackageVisible(packageId: number, visible: boolean) {
  return put<void>(`/v1/point/packages/${packageId}/visible?visible=${visible}`)
}

/**
 * 同步到 Stripe
 */
export function syncPointPackageToStripe(packageId: number) {
  return post<void>(`/v1/point/packages/${packageId}/sync-stripe`)
}
