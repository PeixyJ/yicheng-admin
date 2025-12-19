/**
 * 团队类型枚举
 */
export type TeamType = 'PERSONAL' | 'ENTERPRISE'

/**
 * 团队状态枚举
 */
export type TeamStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DISBANDED'

/**
 * 团队信息 VO
 */
export interface AdminTeamVO {
  /** 团队ID */
  id: number
  /** 团队编码 */
  teamCode: string
  /** 团队名称 */
  name: string
  /** 团队Logo */
  logoUrl: string | null
  /** 团队类型 */
  teamType: TeamType
  /** 团队状态 */
  status: TeamStatus
  /** 状态描述 */
  statusDesc: string
  /** 当前订阅计划编码 */
  currentPlanCode: string | null
  /** 当前计划中文名称 */
  currentPlanNameZh: string | null
  /** 当前计划英文名称 */
  currentPlanNameEn: string | null
  /** 订阅到期时间 */
  subscriptionEndTime: string | null
  /** 所有者用户ID */
  ownerId: number
  /** 所有者昵称 */
  ownerNickname: string
  /** 创建时间 */
  createTime: string
}

/**
 * 团队列表查询参数
 */
export interface TeamListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 关键词（团队名称/团队编码） */
  keyword?: string
  /** 团队类型 */
  teamType?: TeamType
  /** 团队状态 */
  status?: TeamStatus
  /** 订阅计划编码 */
  planCode?: string
  /** 所有者用户ID */
  ownerId?: number
}
