import { get, put } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  AdminFeedbackVO,
  AdminFeedbackDetailVO,
  FeedbackListParams,
  AssignFeedbackRequest,
  ResolveFeedbackRequest,
  CloseFeedbackRequest,
  SetFeedbackPriorityRequest,
} from '@/types/feedback'

/**
 * 分页查询反馈列表
 */
export function getFeedbackList(params: FeedbackListParams) {
  return get<PageData<AdminFeedbackVO>>('/v1/user/feedback', {
    page: params.page,
    size: params.size,
    feedbackType: params.feedbackType,
    status: params.status,
    priority: params.priority,
    handlerId: params.handlerId,
    userId: params.userId,
    keyword: params.keyword,
  })
}

/**
 * 获取反馈详情
 */
export function getFeedbackDetail(id: number) {
  return get<AdminFeedbackDetailVO>(`/v1/user/feedback/${id}`)
}

/**
 * 领取/分配反馈
 */
export function assignFeedback(id: number, data?: AssignFeedbackRequest) {
  return put<void>(`/v1/user/feedback/${id}/assign`, data || {})
}

/**
 * 处理反馈
 */
export function resolveFeedback(id: number, data: ResolveFeedbackRequest) {
  return put<void>(`/v1/user/feedback/${id}/resolve`, data)
}

/**
 * 关闭反馈
 */
export function closeFeedback(id: number, data?: CloseFeedbackRequest) {
  return put<void>(`/v1/user/feedback/${id}/close`, data || {})
}

/**
 * 设置优先级
 */
export function setFeedbackPriority(id: number, data: SetFeedbackPriorityRequest) {
  return put<void>(`/v1/user/feedback/${id}/priority`, data)
}
