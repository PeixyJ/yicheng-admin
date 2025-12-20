import { get, post, put, del, upload } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  AdminVO,
  AdminDetailVO,
  AdminRoleVO,
  AdminAccountVO,
  AdminLoginRecordVO,
  AdminOperationLogVO,
  MfaSetupVO,
  AdminListParams,
  CreateAdminRequest,
  UpdateAdminRequest,
  SetAdminRoleRequest,
  SetAdminScopeRequest,
  SetAdminMfaRequest,
  SetAdminIpWhitelistRequest,
  UpdateAdminAccountRequest,
  AdminLogParams,
} from '@/types/admin'

/**
 * 获取角色列表
 */
export function getAdminRoles() {
  return get<AdminRoleVO[]>('/v1/admin/roles')
}

/**
 * 分页查询管理员列表
 */
export function getAdminList(params: AdminListParams) {
  return get<PageData<AdminVO>>('/v1/admin', {
    page: params.page,
    size: params.size,
    keyword: params.keyword,
    status: params.status,
    roleCode: params.roleCode,
  })
}

/**
 * 获取管理员详情
 */
export function getAdminDetail(id: number) {
  return get<AdminDetailVO>(`/v1/admin/${id}`)
}

/**
 * 创建管理员
 */
export function createAdmin(data: CreateAdminRequest) {
  return post<number>('/v1/admin', data)
}

/**
 * 更新管理员
 */
export function updateAdmin(id: number, data: UpdateAdminRequest) {
  return put<void>(`/v1/admin/${id}`, data)
}

/**
 * 删除管理员
 */
export function deleteAdmin(id: number) {
  return del<void>(`/v1/admin/${id}`)
}

/**
 * 禁用/启用管理员
 */
export function toggleAdminStatus(id: number, enabled: boolean, reason?: string) {
  const url = `/v1/admin/${id}/status?enabled=${enabled}${reason ? `&reason=${encodeURIComponent(reason)}` : ''}`
  return put<void>(url)
}

/**
 * 设置管理员角色
 */
export function setAdminRole(id: number, data: SetAdminRoleRequest) {
  return put<void>(`/v1/admin/${id}/role`, data)
}

/**
 * 设置管理范围
 */
export function setAdminScope(id: number, data: SetAdminScopeRequest) {
  return put<void>(`/v1/admin/${id}/scope`, data)
}

/**
 * 上传管理员头像
 */
export function uploadAdminAvatar(id: number, file: File) {
  return upload<string>(`/v1/admin/${id}/avatar`, file)
}

/**
 * 重置管理员密码
 */
export function resetAdminPassword(id: number) {
  return post<string>(`/v1/admin/${id}/password/reset`)
}

/**
 * 初始化MFA设置
 */
export function setupAdminMfa(id: number) {
  return post<MfaSetupVO>(`/v1/admin/${id}/mfa/setup`)
}

/**
 * 设置MFA（启用/禁用）
 */
export function setAdminMfa(id: number, data: SetAdminMfaRequest) {
  return put<void>(`/v1/admin/${id}/mfa`, data)
}

/**
 * 设置登录IP白名单
 */
export function setAdminIpWhitelist(id: number, data: SetAdminIpWhitelistRequest) {
  return put<void>(`/v1/admin/${id}/ip-whitelist`, data)
}

/**
 * 更新管理员账号信息
 */
export function updateAdminAccount(id: number, data: UpdateAdminAccountRequest) {
  return put<void>(`/v1/admin/${id}/account`, data)
}

/**
 * 获取管理员账号列表
 */
export function getAdminAccounts(id: number) {
  return get<AdminAccountVO[]>(`/v1/admin/${id}/accounts`)
}

/**
 * 获取管理员登录日志
 */
export function getAdminLoginLogs(id: number, params: AdminLogParams) {
  return get<PageData<AdminLoginRecordVO>>(`/v1/admin/${id}/login-logs`, {
    page: params.page,
    size: params.size,
    startTime: params.startTime,
    endTime: params.endTime,
    keyword: params.keyword,
    status: params.status,
  })
}

/**
 * 获取管理员操作日志
 */
export function getAdminOperationLogs(id: number, params: AdminLogParams) {
  return get<PageData<AdminOperationLogVO>>(`/v1/admin/${id}/operation-logs`, {
    page: params.page,
    size: params.size,
    startTime: params.startTime,
    endTime: params.endTime,
    keyword: params.keyword,
    status: params.status,
  })
}
