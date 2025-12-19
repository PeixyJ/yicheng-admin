import { get, post, patch, del } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  SubscribePlanVO,
  SubscribeVO,
  FeatureVO,
  PlanListParams,
  CreatePlanRequest,
  UpdatePlanRequest,
  AssignFeatureToPlanRequest,
  PlanFeatureListParams,
  PlanSubscribeListParams,
} from '@/types/plan'

/**
 * 分页查询订阅计划列表
 */
export function getPlanList(params: PlanListParams) {
  return get<PageData<SubscribePlanVO>>('/v1/subscribe/plan/pages', {
    page: params.page,
    size: params.size,
    planCode: params.planCode,
    planName: params.planName,
    planLevel: params.planLevel,
    planType: params.planType,
    currency: params.currency,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    minCreateTime: params.minCreateTime,
    maxCreateTime: params.maxCreateTime,
    isDefault: params.isDefault,
    isTrial: params.isTrial,
    isVisible: params.isVisible,
    status: params.status,
  })
}

/**
 * 获取订阅计划详情
 */
export function getPlanDetail(planId: number) {
  return get<SubscribePlanVO>(`/v1/subscribe/plan/${planId}`)
}

/**
 * 创建订阅计划
 */
export function createPlan(data: CreatePlanRequest) {
  return post<void>('/v1/subscribe/plan', data)
}

/**
 * 更新订阅计划
 */
export function updatePlan(planId: number, data: UpdatePlanRequest) {
  return patch<void>(`/v1/subscribe/plan/${planId}`, data)
}

/**
 * 删除订阅计划
 */
export function deletePlan(planId: number) {
  return del<void>(`/v1/subscribe/plan/${planId}`)
}

/**
 * 启用/禁用订阅计划
 */
export function switchPlanStatus(planId: number, enable: boolean) {
  return patch<void>(`/v1/subscribe/plan/${planId}/status?enable=${enable}`)
}

/**
 * 设置默认订阅计划
 */
export function setDefaultPlan(planId: number) {
  return patch<void>(`/v1/subscribe/plan/${planId}/default`)
}

/**
 * 查询计划关联的功能
 */
export function getPlanFeatures(planId: number, params: PlanFeatureListParams) {
  return get<PageData<FeatureVO>>(`/v1/subscribe/plan/${planId}/features`, {
    page: params.page,
    size: params.size,
    featureName: params.featureName,
    featureCode: params.featureCode,
    featureType: params.featureType,
    status: params.status,
  })
}

/**
 * 关联功能到订阅计划
 */
export function assignFeaturesToPlan(planId: number, data: AssignFeatureToPlanRequest) {
  return post<void>(`/v1/subscribe/plan/${planId}/feature/assign`, data)
}

/**
 * 启用/禁用订阅计划功能
 */
export function switchPlanFeatureStatus(planId: number, featureId: number, enable: boolean) {
  return patch<void>(`/v1/subscribe/plan/${planId}/feature/status?featureId=${featureId}&enable=${enable}`)
}

/**
 * 查询计划关联的订阅信息
 */
export function getPlanSubscribes(planId: number, params: PlanSubscribeListParams) {
  return get<PageData<SubscribeVO>>(`/v1/subscribe/plan/${planId}/subscribes`, {
    page: params.page,
    size: params.size,
    teamId: params.teamId,
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
