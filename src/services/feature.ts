import { get, post, patch, del } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  FeatureVO,
  FeatureListParams,
  CreateFeatureRequest,
  UpdateFeatureRequest,
} from '@/types/feature'

/**
 * 分页查询功能列表
 */
export function getFeatureList(params: FeatureListParams) {
  return get<PageData<FeatureVO>>('/v1/subscribe/feature/page', {
    page: params.page,
    size: params.size,
    featureName: params.featureName,
    featureCode: params.featureCode,
    featureType: params.featureType,
    status: params.status,
  })
}

/**
 * 创建功能
 */
export function createFeature(data: CreateFeatureRequest) {
  return post<void>('/v1/subscribe/feature', data)
}

/**
 * 删除功能
 */
export function deleteFeature(featureId: number) {
  return del<void>(`/v1/subscribe/feature/${featureId}`)
}

/**
 * 开关功能状态
 */
export function switchFeatureStatus(featureId: number, enable: boolean) {
  return patch<boolean>(`/v1/subscribe/feature/${featureId}/switch?enable=${enable}`)
}

/**
 * 检查功能编码是否重复
 */
export function checkFeatureCodeDuplicate(featureCode: string) {
  return get<boolean>('/v1/subscribe/feature/check-duplicate', { featureCode })
}

/**
 * 获取功能详情
 */
export function getFeatureDetail(featureId: number) {
  return get<FeatureVO>(`/v1/subscribe/feature/${featureId}`)
}

/**
 * 更新功能
 */
export function updateFeature(featureId: number, data: UpdateFeatureRequest) {
  return patch<void>(`/v1/subscribe/feature/${featureId}`, data)
}
