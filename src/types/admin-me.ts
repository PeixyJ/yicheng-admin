import type { AdminAccountVO } from './admin'

/**
 * 当前管理员信息 VO
 */
export interface AdminMeVO {
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
  /** 管理员状态 */
  status: string
  /** 状态描述 */
  statusDesc: string
  /** MFA是否启用 */
  mfaEnabled: boolean
  /** 创建时间 */
  createTime: string
  /** 关联的账号列表 */
  accounts: AdminAccountVO[]
}

/**
 * 更新个人信息请求
 */
export interface UpdateMyProfileRequest {
  /** 昵称 */
  nickname: string
}

/**
 * 修改密码请求
 */
export interface ChangePasswordRequest {
  /** 旧密码 */
  oldPassword: string
  /** 新密码 */
  newPassword: string
  /** 确认新密码 */
  confirmPassword: string
}
