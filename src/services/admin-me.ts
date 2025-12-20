import { get, post, put, upload } from '@/utils/request'
import { encryptPassword } from '@/utils/crypto'
import type { PageData } from '@/types/api'
import type { AdminMeVO, UpdateMyProfileRequest, ChangePasswordRequest } from '@/types/admin-me'
import type {
  AdminAccountVO,
  AdminLoginRecordVO,
  AdminOperationLogVO,
  MfaSetupVO,
  SetAdminMfaRequest,
  AdminLogParams,
} from '@/types/admin'

/**
 * 获取当前管理员信息
 */
export function getAdminMe() {
  return get<AdminMeVO>('/v1/admin/me')
}

/**
 * 更新个人信息
 */
export function updateMyProfile(data: UpdateMyProfileRequest) {
  return put<void>('/v1/admin/me', data)
}

/**
 * 上传头像
 */
export function uploadAvatar(file: File) {
  return upload<string>('/v1/admin/me/avatar', file)
}

/**
 * 修改密码
 */
export async function changePassword(data: ChangePasswordRequest) {
  const encryptedData = {
    oldPassword: await encryptPassword(data.oldPassword),
    newPassword: await encryptPassword(data.newPassword),
    confirmPassword: await encryptPassword(data.confirmPassword),
  }
  return put<void>('/v1/admin/me/password', encryptedData)
}

/**
 * 初始化 MFA 设置
 */
export function setupMfa() {
  return post<MfaSetupVO>('/v1/admin/me/mfa/setup')
}

/**
 * 设置 MFA（启用/禁用）
 */
export function setMfa(data: SetAdminMfaRequest) {
  return put<void>('/v1/admin/me/mfa', data)
}

/**
 * 获取账号列表
 */
export function getMyAccounts() {
  return get<AdminAccountVO[]>('/v1/admin/me/accounts')
}

/**
 * 获取登录日志
 */
export function getMyLoginLogs(params: AdminLogParams) {
  return get<PageData<AdminLoginRecordVO>>('/v1/admin/me/login-logs', {
    page: params.page,
    size: params.size,
    startTime: params.startTime,
    endTime: params.endTime,
    keyword: params.keyword,
    status: params.status,
  })
}

/**
 * 获取操作日志
 */
export function getMyOperationLogs(params: AdminLogParams) {
  return get<PageData<AdminOperationLogVO>>('/v1/admin/me/operation-logs', {
    page: params.page,
    size: params.size,
    startTime: params.startTime,
    endTime: params.endTime,
    keyword: params.keyword,
    status: params.status,
  })
}
