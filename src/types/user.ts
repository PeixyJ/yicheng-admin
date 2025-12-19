/**
 * 用户状态枚举
 */
export type UserStatus = 'ACTIVE' | 'SUSPENDED'

/**
 * 用户信息 VO
 */
export interface AdminUserVO {
  /** 用户ID */
  id: number
  /** 用户昵称 */
  nickname: string
  /** 头像URL */
  avatarUrl: string | null
  /** 性别 */
  gender: number
  /** 性别描述 */
  genderDesc: string
  /** 邀请码 */
  inviteCode: string
  /** 邀请人昵称 */
  inviterNickname: string | null
  /** 用户状态 */
  status: UserStatus
  /** 状态描述 */
  statusDesc: string
  /** 封禁时间 */
  suspendedAt: string | null
  /** 封禁截止时间 */
  suspendedUntil: string | null
  /** 创建时间 */
  createTime: string
}

/**
 * 用户列表查询参数
 */
export interface UserListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 关键词（昵称/邀请码） */
  keyword?: string
  /** 用户状态 */
  status?: UserStatus
  /** 邀请人用户ID */
  invitedByUserId?: number
}

/**
 * 分页数据结构
 */
export interface PageData<T> {
  /** 数据列表 */
  records: T[]
  /** 总数 */
  total: number
  /** 每页数量 */
  size: number
  /** 当前页码 */
  current: number
  /** 总页数 */
  pages: number
}

/**
 * API 响应结构
 */
export interface ApiResponse<T> {
  code: string
  message: string
  data: T
  date: number
}
