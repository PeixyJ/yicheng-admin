import { get, post, put, del } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  NotificationTemplateVO,
  TemplateListParams,
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from '@/types/notification-template'

/**
 * 分页查询模板列表
 */
export function getTemplateList(params: TemplateListParams) {
  return get<PageData<NotificationTemplateVO>>('/v1/notification/templates', {
    page: params.page,
    size: params.size,
    code: params.code,
    name: params.name,
    parentType: params.parentType,
    status: params.status,
  })
}

/**
 * 获取模板详情
 */
export function getTemplateDetail(id: number) {
  return get<NotificationTemplateVO>(`/v1/notification/templates/${id}`)
}

/**
 * 创建模板
 */
export function createTemplate(data: CreateTemplateRequest) {
  return post<number>('/v1/notification/templates', data)
}

/**
 * 更新模板
 */
export function updateTemplate(id: number, data: UpdateTemplateRequest) {
  return put<void>(`/v1/notification/templates/${id}`, data)
}

/**
 * 删除模板
 */
export function deleteTemplate(id: number) {
  return del<void>(`/v1/notification/templates/${id}`)
}

/**
 * 更新模板状态
 */
export function updateTemplateStatus(id: number, status: boolean) {
  return put<void>(`/v1/notification/templates/${id}/status?status=${status}`)
}
