/**
 * 团队类型枚举
 */
export type TeamType = 'PERSONAL' | 'TEAM'

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
  /** 所有者头像 */
  ownerAvatarUrl: string | null
  /** 当前可用点数 */
  availablePoints: number | null
  /** 当日已用配额 */
  dailyQuotaUsed: number | null
  /** 当日总配额 */
  dailyQuotaTotal: number | null
  /** 当月已用配额 */
  monthlyQuotaUsed: number | null
  /** 当月总配额 */
  monthlyQuotaTotal: number | null
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

/**
 * 团队详情 VO
 */
export interface AdminTeamDetailVO {
  /** 团队ID */
  id: number
  /** 团队编码 */
  teamCode: string
  /** 团队名称 */
  name: string
  /** 团队Logo */
  logoUrl: string | null
  /** 团队描述 */
  description: string | null
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
  /** Stripe客户ID */
  stripeCustomerId: string | null
  /** 所有者用户ID */
  ownerId: number
  /** 所有者昵称 */
  ownerNickname: string
  /** 所有者头像 */
  ownerAvatarUrl: string | null
  /** 团队成员数量 */
  memberCount: number
  /** 解散时间 */
  disbandedAt: string | null
  /** 解散操作人ID */
  disbandedBy: number | null
  /** 解散操作人昵称 */
  disbandedByNickname: string | null
  /** 解散原因 */
  disbandReason: string | null
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 团队配额 VO
 */
export interface AdminTeamQuotaVO {
  /** 配额ID */
  id: number
  /** 团队ID */
  teamId: number
  /** 用户ID（为空表示团队整体配额） */
  userId: number | null
  /** 配额类型：MONTHLY-月度, DAILY-每日 */
  quotaType: string
  /** 配额所属月份（仅月度配额） */
  quotaPeriod: string | null
  /** 配额所属日期（仅每日配额） */
  quotaDate: string | null
  /** 计划配额 */
  planQuota: number
  /** 额外配额 */
  extraQuota: number
  /** 总配额 */
  totalQuota: number
  /** 已使用配额 */
  usedQuota: number
  /** 可用配额 */
  availableQuota: number
}

/**
 * 团队邀请状态
 */
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED'

/**
 * 团队邀请 VO
 */
export interface AdminTeamInvitationVO {
  /** 邀请ID */
  id: number
  /** 团队ID */
  teamId: number
  /** 邀请人用户ID */
  fromUserId: number
  /** 邀请人昵称 */
  fromUserNickname: string
  /** 邀请人头像 */
  fromUserAvatarUrl: string | null
  /** 被邀请人用户ID */
  toUserId: number
  /** 被邀请人昵称 */
  toUserNickname: string
  /** 被邀请人头像 */
  toUserAvatarUrl: string | null
  /** 邀请状态 */
  status: InvitationStatus
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 转让后原所有者角色
 */
export type TransferSelfRole = 'ADMIN' | 'MEMBER' | 'LEAVE'

/**
 * 团队转让记录 VO
 */
export interface AdminTeamTransferVO {
  /** 转让ID */
  id: number
  /** 团队ID */
  teamId: number
  /** 原所有者用户ID */
  fromUserId: number
  /** 原所有者昵称 */
  fromUserNickname: string
  /** 原所有者头像 */
  fromUserAvatarUrl: string | null
  /** 新所有者用户ID */
  toUserId: number
  /** 新所有者昵称 */
  toUserNickname: string
  /** 新所有者头像 */
  toUserAvatarUrl: string | null
  /** 转让后原所有者角色 */
  selfRole: TransferSelfRole
  /** 创建时间（转让发起时间） */
  createTime: string
  /** 更新时间（转让完成时间） */
  updateTime: string
}

/**
 * 冻结团队请求
 */
export interface SuspendTeamRequest {
  /** 冻结原因 */
  reason: string
}

/**
 * 解散团队请求
 */
export interface DisbandTeamRequest {
  /** 解散原因 */
  reason: string
}

/**
 * 转让团队请求
 */
export interface TransferTeamRequest {
  /** 新所有者用户ID */
  toUserId: number
  /** 转让后原所有者角色 */
  selfRole?: TransferSelfRole
}

/**
 * 创建团队请求
 */
export interface CreateTeamRequest {
  /** 团队名称 */
  name: string
  /** 团队类型：PERSONAL-个人, TEAM-协作团队 */
  teamType: TeamType
  /** 所有者用户ID */
  ownerId: number
  /** 团队Logo URL */
  logoUrl?: string
  /** 团队描述 */
  description?: string
}

/**
 * 团队成员 VO
 */
export interface AdminTeamMemberVO {
  /** 成员记录ID */
  id: number
  /** 团队ID */
  teamId: number
  /** 用户ID */
  userId: number
  /** 用户昵称 */
  userNickname: string
  /** 用户头像 */
  userAvatarUrl: string | null
  /** 成员角色 */
  role: string
  /** 角色描述 */
  roleDesc: string
  /** 成员备注 */
  description: string | null
  /** 邀请人ID */
  inviteUserId: number | null
  /** 邀请人昵称 */
  inviterNickname: string | null
  /** 邀请时间 */
  inviteTime: string | null
  /** 加入时间 */
  joinedTime: string | null
  /** 创建时间 */
  createTime: string
}
