/**
 * 管理员角色编码枚举
 */
export type AdminRoleCode = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'SUPPORT' | 'VIEWER'

/**
 * 管理员状态枚举
 */
export type AdminStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'RESIGNED'

/**
 * 管理范围类型枚举
 */
export type AdminScopeType = 'ALL' | 'ASSIGNED'

/**
 * 角色信息 VO
 */
export interface AdminRoleVO {
  /** 角色编码 */
  code: string
  /** 角色名称 */
  name: string
}

/**
 * 管理员列表 VO
 */
export interface AdminVO {
  /** 主键ID */
  id: number
  /** 管理员工号 */
  adminNo: string
  /** 管理员姓名/昵称 */
  nickname: string
  /** 管理员头像URL */
  avatarUrl: string | null
  /** 角色编码 */
  roleCode: string
  /** 角色名称 */
  roleName: string
  /** 管理范围：ALL-全部团队、ASSIGNED-指定团队 */
  scopeType: string
  /** 管理范围描述 */
  scopeTypeDesc: string
  /** 管理员状态 */
  status: AdminStatus
  /** 状态描述 */
  statusDesc: string
  /** MFA是否启用 */
  mfaEnabled: boolean
  /** 创建时间 */
  createTime: string
  /** 数据版本 */
  dataVersion: number
}

/**
 * 管理员账号 VO
 */
export interface AdminAccountVO {
  /** 主键ID */
  id: number
  /** 关联的管理员ID */
  adminId: number
  /** 账号类型 */
  accountType: string
  /** 账号类型描述 */
  accountTypeDesc: string
  /** 账号标识（邮箱/手机号） */
  identifier: string
  /** 是否已验证 */
  verified: boolean
  /** 验证时间 */
  verifiedAt: string | null
  /** 最后登录时间 */
  lastLoginTime: string | null
  /** 最后登录IP */
  lastLoginIp: string | null
  /** 账号状态 */
  status: boolean
  /** 数据版本 */
  dataVersion: number
}

/**
 * 管理员详情 VO
 */
export interface AdminDetailVO {
  /** 主键ID */
  id: number
  /** 管理员工号 */
  adminNo: string
  /** 管理员姓名/昵称 */
  nickname: string
  /** 管理员头像URL */
  avatarUrl: string | null
  /** 角色编码 */
  roleCode: string
  /** 角色名称 */
  roleName: string
  /** 额外权限JSON */
  permissions: string | null
  /** 管理范围：ALL-全部团队、ASSIGNED-指定团队 */
  scopeType: string
  /** 管理范围描述 */
  scopeTypeDesc: string
  /** 可管理的团队ID列表JSON */
  scopeTeamIds: string | null
  /** 管理员状态 */
  status: AdminStatus
  /** 状态描述 */
  statusDesc: string
  /** 停用时间 */
  suspendedAt: string | null
  /** 停用原因 */
  suspendedReason: string | null
  /** 停用操作人ID */
  suspendedBy: number | null
  /** MFA是否启用 */
  mfaEnabled: boolean
  /** IP白名单JSON */
  allowedIps: string | null
  /** 备注信息 */
  remark: string | null
  /** 创建时间 */
  createTime: string
  /** 修改时间 */
  updateTime: string
  /** 数据版本 */
  dataVersion: number
  /** 关联的账号列表 */
  accounts: AdminAccountVO[]
}

/**
 * 管理员登录日志 VO
 */
export interface AdminLoginRecordVO {
  /** 主键ID */
  id: number
  /** 登录方式 */
  loginType: string
  /** 登录方式描述 */
  loginTypeDesc: string
  /** 登录时输入的账号标识 */
  identifier: string
  /** 登录结果状态 */
  status: string
  /** 状态描述 */
  statusDesc: string
  /** 登录失败原因 */
  failReason: string | null
  /** 客户端IP地址 */
  clientIp: string
  /** IP地理位置 */
  ipLocation: string | null
  /** 设备类型 */
  deviceType: string | null
  /** 操作系统 */
  os: string | null
  /** 浏览器 */
  browser: string | null
  /** 是否异常登录 */
  isAbnormal: boolean
  /** 异常原因 */
  abnormalReason: string | null
  /** 登录时间 */
  loginTime: string
  /** 登出时间 */
  logoutTime: string | null
  /** 登出方式 */
  logoutType: string | null
}

/**
 * 管理员操作日志 VO
 */
export interface AdminOperationLogVO {
  /** 主键ID */
  id: number
  /** 操作模块 */
  module: string
  /** 模块描述 */
  moduleDesc: string
  /** 操作类型 */
  action: string
  /** 操作类型描述 */
  actionDesc: string
  /** 操作目标类型 */
  targetType: string | null
  /** 操作目标ID */
  targetId: string | null
  /** 操作目标名称 */
  targetName: string | null
  /** 变更前数据JSON */
  beforeData: string | null
  /** 变更后数据JSON */
  afterData: string | null
  /** 请求方法 */
  requestMethod: string
  /** 请求URL */
  requestUrl: string
  /** 操作结果状态 */
  status: string
  /** 状态描述 */
  statusDesc: string
  /** 错误信息 */
  errorMsg: string | null
  /** 操作耗时（毫秒） */
  durationMs: number
  /** 客户端IP */
  clientIp: string
  /** 创建时间（操作时间） */
  createTime: string
}

/**
 * MFA设置 VO
 */
export interface MfaSetupVO {
  /** MFA Secret（Base32编码） */
  secret: string
  /** QR 码 Data URI */
  qrCodeDataUri: string
  /** otpauth URI */
  otpAuthUri: string
}

/**
 * 管理员列表查询参数
 */
export interface AdminListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 关键词（工号/姓名） */
  keyword?: string
  /** 管理员状态 */
  status?: AdminStatus
  /** 角色编码 */
  roleCode?: AdminRoleCode
}

/**
 * 创建管理员请求
 */
export interface CreateAdminRequest {
  /** 管理员工号 */
  adminNo: string
  /** 管理员姓名/昵称 */
  nickname: string
  /** 登录邮箱 */
  email: string
  /** 初始密码，为空时系统生成随机密码 */
  password?: string
  /** 角色编码 */
  roleCode: AdminRoleCode
  /** 角色名称 */
  roleName?: string
  /** 备注信息 */
  remark?: string
}

/**
 * 更新管理员请求
 */
export interface UpdateAdminRequest {
  /** 管理员姓名/昵称 */
  nickname?: string
  /** 备注信息 */
  remark?: string
}

/**
 * 设置管理员角色请求
 */
export interface SetAdminRoleRequest {
  /** 角色编码 */
  roleCode: AdminRoleCode
  /** 角色名称 */
  roleName?: string
  /** 额外权限JSON */
  permissions?: string
}

/**
 * 设置管理范围请求
 */
export interface SetAdminScopeRequest {
  /** 管理范围类型 */
  scopeType: AdminScopeType
  /** 可管理的团队ID列表 */
  scopeTeamIds?: number[]
}

/**
 * 设置MFA请求
 */
export interface SetAdminMfaRequest {
  /** 是否启用MFA */
  mfaEnabled: boolean
  /** TOTP验证码 */
  verifyCode?: string
}

/**
 * 设置IP白名单请求
 */
export interface SetAdminIpWhitelistRequest {
  /** IP白名单列表 */
  allowedIps?: string[]
}

/**
 * 更新管理员账号请求
 */
export interface UpdateAdminAccountRequest {
  /** 账号类型：EMAIL-邮箱、PHONE-手机 */
  accountType: string
  /** 账号标识：邮箱地址/手机号 */
  identifier: string
}

/**
 * 日志查询参数
 */
export interface AdminLogParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 关键词 */
  keyword?: string
  /** 状态 */
  status?: string
}
