import { get, post } from '@/utils/request'
import { encryptPassword } from '@/utils/crypto'
import type { LoginRequest, LoginVO } from '@/types/auth'

/**
 * 检查登录状态
 */
export async function checkLoginStatus() {
  return get<boolean>('/v1/login/check')
}

/**
 * 管理员邮箱密码登录
 */
export async function loginByEmailPassword(
  email: string,
  password: string,
  rememberMe: boolean = false,
  mfaCode?: string
) {
  // 对密码进行 SHA256 加密
  const encryptedPassword = await encryptPassword(password)

  const request: LoginRequest = {
    loginType: 'ADMIN_EMAIL_PASSWORD',
    identifier: email,
    password: encryptedPassword,
    rememberMe,
    captcha: '',
    captchaKey: '',
    mfaCode,
  }

  return post<LoginVO>('/v1/login', request)
}
