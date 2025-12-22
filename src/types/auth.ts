/**
 * 登录类型
 */
export type LoginType =
  | 'USER_EMAIL_PASSWORD'
  | 'USER_EMAIL_CODE'
  | 'USER_PASSKEY'
  | 'USER_GITHUB_OAUTH'
  | 'USER_WECHAT_OAUTH'
  | 'USER_APPLE_OAUTH'
  | 'ADMIN_EMAIL_PASSWORD'
  | 'ADMIN_PASSKEY'

/**
 * 登录请求
 */
export interface LoginRequest {
  /** 登录类型 */
  loginType: LoginType
  /** 登录标识（邮箱/手机/用户名等） */
  identifier: string
  /** 密码（已加密） */
  password?: string
  /** 记住登录状态 */
  rememberMe?: boolean
  /** 验证码 */
  captcha?: string
  /** 验证码Key */
  captchaKey?: string
  /** MFA 验证码 */
  mfaCode?: string
}

/**
 * 登录状态
 */
export type LoginStatus = 'SUCCESS' | 'MFA_REQUIRED' | 'PWD_EXPIRED' | 'FORCE_PWD_CHANGE'

/**
 * MFA 类型
 */
export type MfaType = 'TOTP' | 'EMAIL' | 'SMS'

/**
 * 登录响应
 */
export interface LoginVO {
  /** 登录状态码 */
  status: LoginStatus
  /** 状态描述 */
  statusDesc?: string
  /** 访问令牌 */
  token?: string
  /** 令牌过期时间 */
  tokenExpireAt?: string
  /** MFA 令牌 */
  mfaToken?: string
  /** 支持的 MFA 类型列表 */
  mfaTypes?: MfaType[]
  /** 是否需要强制修改密码 */
  forcePwdChange?: boolean
  /** 密码过期时间 */
  pwdExpireAt?: string
  /** 用户ID */
  userId?: number
}

