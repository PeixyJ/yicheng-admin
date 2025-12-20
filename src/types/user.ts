import type { PageParams } from './api'

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
  /** 管理员备注 */
  remark: string | null
  /** 创建时间 */
  createTime: string
}

/**
 * 用户列表查询参数
 */
export interface UserListParams extends PageParams {
  /** 关键词（昵称/邀请码） */
  keyword?: string
  /** 用户状态 */
  status?: UserStatus
  /** 邀请人用户ID */
  invitedByUserId?: number
}

/**
 * 用户详情 VO
 */
export interface AdminUserDetailVO {
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
  /** 个人简介 */
  bio: string | null
  /** 个人空间团队ID */
  personalTeamId: number
  /** 默认团队ID */
  defaultTeamId: number
  /** 邀请码 */
  inviteCode: string
  /** 邀请人用户ID */
  invitedByUserId: number | null
  /** 邀请人昵称 */
  inviterNickname: string | null
  /** 被邀请时间 */
  invitedAt: string | null
  /** 用户状态 */
  status: UserStatus
  /** 状态描述 */
  statusDesc: string
  /** 封禁时间 */
  suspendedAt: string | null
  /** 封禁原因 */
  suspendedReason: string | null
  /** 封禁截止时间 */
  suspendedUntil: string | null
  /** 语言偏好 */
  locale: string | null
  /** 时区 */
  timezone: string | null
  /** 管理员备注 */
  remark: string | null
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 数据版本 */
  dataVersion: number
}

/**
 * 封禁用户请求
 */
export interface SuspendUserRequest {
  /** 封禁原因 */
  reason: string
  /** 封禁截止时间（为空表示永久封禁） */
  suspendedUntil?: string
}

/**
 * 更新管理员备注请求
 */
export interface UpdateUserRemarkRequest {
  /** 管理员备注 */
  remark?: string
}

/**
 * 用户设备 VO
 */
export interface AdminUserDeviceVO {
  /** 主键ID */
  id: number
  /** 设备唯一标识 */
  deviceId: string
  /** 设备名称 */
  deviceName: string
  /** 设备类型 */
  deviceType: string
  /** 设备类型描述 */
  deviceTypeDesc: string
  /** 操作系统 */
  os: string
  /** 操作系统版本 */
  osVersion: string
  /** 浏览器 */
  browser: string
  /** APP版本号 */
  appVersion: string | null
  /** 设备状态 */
  status: string
  /** 状态描述 */
  statusDesc: string
  /** 是否可信设备 */
  isTrusted: boolean
  /** 设为可信设备的时间 */
  trustedAt: string | null
  /** 首次登录时间 */
  firstLoginTime: string
  /** 最后登录时间 */
  lastLoginTime: string
  /** 最后登录IP */
  lastLoginIp: string
  /** 累计登录次数 */
  loginCount: number
  /** 创建时间 */
  createTime: string
}

/**
 * 用户登录记录 VO
 */
export interface AdminUserLoginRecordVO {
  /** 主键ID */
  id: number
  /** 登录方式 */
  loginType: string
  /** 登录方式描述 */
  loginTypeDesc: string
  /** 登录账号标识 */
  identifier: string
  /** 登录状态 */
  status: string
  /** 状态描述 */
  statusDesc: string
  /** 失败原因 */
  failReason: string | null
  /** 客户端IP */
  clientIp: string
  /** IP地理位置 */
  ipLocation: string | null
  /** 设备类型 */
  deviceType: string
  /** 设备类型描述 */
  deviceTypeDesc: string
  /** 操作系统 */
  os: string
  /** 浏览器 */
  browser: string
  /** 设备ID */
  deviceId: string
  /** 是否新设备 */
  isNewDevice: boolean
  /** 是否异常登录 */
  isAbnormal: boolean
  /** 异常原因 */
  abnormalReason: string | null
  /** 风险等级 */
  riskLevel: string | null
  /** 登录时间 */
  loginTime: string
  /** 登出时间 */
  logoutTime: string | null
  /** 登出方式 */
  logoutType: string | null
}

/**
 * 用户操作日志 VO
 */
export interface AdminUserOperationLogVO {
  /** 主键ID */
  id: number
  /** 操作所在团队ID */
  teamId: number
  /** 操作模块 */
  module: string
  /** 模块描述 */
  moduleDesc: string
  /** 操作动作 */
  action: string
  /** 操作描述 */
  actionDesc: string
  /** 操作目标类型 */
  targetType: string | null
  /** 操作目标ID */
  targetId: string | null
  /** 操作目标名称 */
  targetName: string | null
  /** 请求方法 */
  requestMethod: string
  /** 请求URL */
  requestUrl: string
  /** 操作状态 */
  status: string
  /** 状态描述 */
  statusDesc: string
  /** 错误信息 */
  errorMsg: string | null
  /** 操作耗时(毫秒) */
  durationMs: number
  /** 客户端IP */
  clientIp: string
  /** 创建时间 */
  createTime: string
}

/**
 * 用户团队 VO
 */
export interface AdminUserTeamVO {
  /** 团队ID */
  teamId: number
  /** 团队编码 */
  teamCode: string
  /** 团队名称 */
  teamName: string
  /** 团队Logo */
  logoUrl: string | null
  /** 团队状态 */
  status: string
  /** 状态描述 */
  statusDesc: string | null
  /** 当前订阅计划编码 */
  currentPlanCode: string | null
  /** 当前计划名称 */
  currentPlanName: string | null
  /** 订阅到期时间 */
  subscriptionEndTime: string | null
  /** 成员角色 */
  role: string
  /** 角色描述 */
  roleDesc: string
  /** 加入时间 */
  joinedTime: string
  /** 团队创建时间 */
  teamCreateTime: string
}

/**
 * 用户账户 VO
 */
export interface UserAccountVO {
  /** 主键ID */
  id: number
  /** 账号类型 */
  accountType: string
  /** 账号类型描述 */
  accountTypeDesc: string
  /** 账号标识（邮箱/手机号，脱敏显示） */
  identifier: string
  /** 是否已验证 */
  verified: boolean
  /** 验证时间 */
  verifiedAt: string | null
  /** 是否已设置密码 */
  hasPassword: boolean
  /** 最后登录时间 */
  lastLoginTime: string | null
  /** 账号状态 */
  status: boolean
  /** 创建时间 */
  createTime: string
}
