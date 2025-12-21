import { get, post, put, upload, del } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  AdminTeamVO,
  AdminTeamDetailVO,
  AdminTeamQuotaVO,
  AdminTeamInvitationVO,
  AdminTeamTransferVO,
  AdminTeamMemberVO,
  TeamListParams,
  SuspendTeamRequest,
  DisbandTeamRequest,
  TransferTeamRequest,
  CreateTeamRequest,
  InvitationStatus,
} from '@/types/team'

/**
 * 分页查询团队列表
 */
export function getTeamList(params: TeamListParams) {
  return get<PageData<AdminTeamVO>>('/v1/team', {
    page: params.page,
    size: params.size,
    keyword: params.keyword,
    teamType: params.teamType,
    status: params.status,
    planCode: params.planCode,
    ownerId: params.ownerId,
  })
}

/**
 * 获取团队详情
 */
export function getTeamDetail(id: number) {
  return get<AdminTeamDetailVO>(`/v1/team/${id}`)
}

/**
 * 冻结团队
 */
export function suspendTeam(id: number, data: SuspendTeamRequest) {
  return put<void>(`/v1/team/${id}/suspend`, data)
}

/**
 * 解冻团队
 */
export function unsuspendTeam(id: number) {
  return put<void>(`/v1/team/${id}/unsuspend`)
}

/**
 * 解散团队
 */
export function disbandTeam(id: number, data: DisbandTeamRequest) {
  return put<void>(`/v1/team/${id}/disband`, data)
}

/**
 * 获取团队当月配额
 */
export function getTeamMonthlyQuota(id: number) {
  return get<AdminTeamQuotaVO>(`/v1/team/${id}/quota/monthly`)
}

/**
 * 获取团队今日配额
 */
export function getTeamDailyQuota(id: number) {
  return get<AdminTeamQuotaVO>(`/v1/team/${id}/quota/daily`)
}

/**
 * 分页查询团队邀请列表
 */
export function getTeamInvitations(id: number, page: number, size: number, status?: InvitationStatus) {
  return get<PageData<AdminTeamInvitationVO>>(`/v1/team/${id}/invitations`, {
    page,
    size,
    status,
  })
}

/**
 * 分页查询团队转让记录
 */
export function getTeamTransfers(id: number, page: number, size: number) {
  return get<PageData<AdminTeamTransferVO>>(`/v1/team/${id}/transfers`, {
    page,
    size,
  })
}

/**
 * 管理员直接转让团队
 */
export function transferTeam(id: number, data: TransferTeamRequest) {
  return put<void>(`/v1/team/${id}/transfer`, data)
}

/**
 * 创建团队
 */
export function createTeam(data: CreateTeamRequest) {
  return post<AdminTeamDetailVO>('/v1/team', data)
}

/**
 * 上传并更新团队头像
 */
export function uploadTeamLogo(id: number, file: File) {
  return upload<string>(`/v1/team/${id}/logo`, file)
}

/**
 * 查询团队成员列表
 */
export function getTeamMembers(id: number) {
  return get<AdminTeamMemberVO[]>(`/v1/team/${id}/members`)
}

/**
 * 邀请用户加入团队
 */
export function inviteTeamMember(id: number, userId: number) {
  return post<void>(`/v1/team/${id}/members`, { userId })
}

/**
 * 移除团队成员
 */
export function removeTeamMember(id: number, memberId: number) {
  return del<void>(`/v1/team/${id}/members/${memberId}`)
}
