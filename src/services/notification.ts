import { get, del } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  NotificationVO,
  NotificationDetailVO,
  NotificationListParams,
} from '@/types/notification'

/**
 * 获取通知列表
 */
export function getNotificationList(params: NotificationListParams) {
  return get<PageData<NotificationVO>>('/v1/notification/notifications', {
    page: params.page,
    size: params.size,
    userId: params.userId,
    teamId: params.teamId,
    parentType: params.parentType,
    status: params.status,
  })
}

/**
 * 获取通知详情
 */
export function getNotificationDetail(id: number) {
  return get<NotificationDetailVO>(`/v1/notification/notifications/${id}`)
}

/**
 * 删除通知
 */
export function deleteNotification(id: number) {
  return del<void>(`/v1/notification/notifications/${id}`)
}
