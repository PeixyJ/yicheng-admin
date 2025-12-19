import { get } from '@/utils/request'
import type { PageData } from '@/types/api'
import type { AdminUserVO, UserListParams } from '@/types/user'

/**
 * 分页查询用户列表
 */
export function getUserList(params: UserListParams) {
  return get<PageData<AdminUserVO>>('/user', {
    page: params.page,
    size: params.size,
    keyword: params.keyword,
    status: params.status,
    invitedByUserId: params.invitedByUserId,
  })
}
