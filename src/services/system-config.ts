import { get, post, put, del } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  SystemConfigVO,
  SystemConfigDetailVO,
  SystemConfigLogVO,
  SystemConfigListParams,
  CreateSystemConfigRequest,
  UpdateSystemConfigRequest,
  SystemConfigLogParams,
} from '@/types/system-config'

/**
 * 分页查询配置
 */
export function getSystemConfigList(params: SystemConfigListParams) {
  return get<PageData<SystemConfigVO>>('/v1/system/configs', {
    page: params.page,
    size: params.size,
    configKey: params.configKey,
    configGroup: params.configGroup,
    keyword: params.keyword,
  })
}

/**
 * 获取配置详情
 */
export function getSystemConfigDetail(id: number) {
  return get<SystemConfigDetailVO>(`/v1/system/configs/${id}`)
}

/**
 * 根据配置键获取配置
 */
export function getSystemConfigByKey(configKey: string) {
  return get<SystemConfigDetailVO>(`/v1/system/configs/key/${configKey}`)
}

/**
 * 创建配置
 */
export function createSystemConfig(data: CreateSystemConfigRequest) {
  return post<number>('/v1/system/configs', data)
}

/**
 * 更新配置
 */
export function updateSystemConfig(id: number, data: UpdateSystemConfigRequest, changeReason?: string) {
  const url = changeReason
    ? `/v1/system/configs/${id}?changeReason=${encodeURIComponent(changeReason)}`
    : `/v1/system/configs/${id}`
  return put<void>(url, data)
}

/**
 * 根据配置键更新配置值
 */
export function updateSystemConfigByKey(configKey: string, value: string, changeReason?: string) {
  let url = `/v1/system/configs/key/${configKey}?value=${encodeURIComponent(value)}`
  if (changeReason) {
    url += `&changeReason=${encodeURIComponent(changeReason)}`
  }
  return put<void>(url)
}

/**
 * 删除配置
 */
export function deleteSystemConfig(id: number) {
  return del<void>(`/v1/system/configs/${id}`)
}

/**
 * 刷新缓存
 */
export function refreshSystemConfigCache() {
  return post<void>('/v1/system/configs/cache/refresh')
}

/**
 * 查询配置变更日志
 */
export function getSystemConfigLogs(id: number, params: SystemConfigLogParams) {
  return get<PageData<SystemConfigLogVO>>(`/v1/system/configs/${id}/logs`, {
    page: params.page,
    size: params.size,
  })
}
