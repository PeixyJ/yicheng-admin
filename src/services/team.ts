import { get } from '@/utils/request'
import type { PageData } from '@/types/user'
import type { AdminTeamVO, TeamListParams } from '@/types/team'

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
