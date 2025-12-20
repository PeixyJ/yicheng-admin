import { get, put, upload, del } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  AdminUserVO,
  AdminUserDetailVO,
  AdminUserDeviceVO,
  AdminUserLoginRecordVO,
  AdminUserOperationLogVO,
  AdminUserTeamVO,
  UserAccountVO,
  UserListParams,
  SuspendUserRequest,
  UpdateUserRemarkRequest,
} from '@/types/user'

/**
 * 分页查询用户列表
 */
export function getUserList(params: UserListParams) {
  return get<PageData<AdminUserVO>>('v1/user', {
    page: params.page,
    size: params.size,
    keyword: params.keyword,
    status: params.status,
    invitedByUserId: params.invitedByUserId,
  })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: number) {
  return get<AdminUserDetailVO>(`/v1/user/${id}`)
}

/**
 * 封禁用户
 */
export function suspendUser(id: number, data: SuspendUserRequest) {
  return put<void>(`/v1/user/${id}/suspend`, data)
}

/**
 * 解封用户
 */
export function unsuspendUser(id: number) {
  return put<void>(`/v1/user/${id}/unsuspend`)
}

/**
 * 更新管理员备注
 */
export function updateUserRemark(id: number, data: UpdateUserRemarkRequest) {
  return put<void>(`/v1/user/${id}/remark`, data)
}

/**
 * 获取用户设备列表
 */
export function getUserDevices(id: number) {
  return get<AdminUserDeviceVO[]>(`/v1/user/${id}/devices`)
}

/**
 * 获取用户登录记录
 */
export function getUserLoginRecords(id: number, page: number, size: number) {
  return get<PageData<AdminUserLoginRecordVO>>(`/v1/user/${id}/login-records`, { page, size })
}

/**
 * 获取用户操作日志
 */
export function getUserOperationLogs(id: number, page: number, size: number) {
  return get<PageData<AdminUserOperationLogVO>>(`/v1/user/${id}/operation-logs`, { page, size })
}

/**
 * 上传并更新用户头像
 */
export function uploadUserAvatar(id: number, file: File) {
  return upload<string>(`/v1/user/${id}/avatar`, file)
}

/**
 * 获取用户的团队列表
 */
export function getUserTeams(id: number) {
  return get<AdminUserTeamVO[]>(`/v1/user/${id}/teams`)
}

/**
 * 删除用户
 */
export function deleteUser(id: number) {
  return del<void>(`/v1/user/${id}`)
}

/**
 * 获取用户账户列表
 */
export function getUserAccounts(id: number) {
  return get<UserAccountVO[]>(`/v1/user/${id}/accounts`)
}
