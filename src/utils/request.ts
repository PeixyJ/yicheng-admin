import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { type ApiResponse, BusinessError } from '@/types/api'

// Token 存储的 key
const TOKEN_KEY = 'access_token'

// 不需要 token 的白名单路径（精确匹配）
const WHITE_LIST = ['/v1/login', '/v1/register', '/v1/auth/']

/**
 * 创建 axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 获取 token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 设置 token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 移除 token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    const isWhiteListed = WHITE_LIST.some((path) => config.url === path)

    // 添加 token
    if (token && !isWhiteListed) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    // 业务成功
    if (data.code === 'success') {
      return response
    }

    // 业务错误 - 由调用方处理错误显示
    return Promise.reject(new BusinessError(data.code, data.message))
  },
  (error: AxiosError) => {
    // 网络错误或请求超时 - 由调用方处理错误显示
    const message = error.message === 'Network Error' ? 'Network connection failed' : 'Request timeout'
    return Promise.reject(new Error(message))
  }
)

/**
 * GET 请求
 */
export function get<T>(
  url: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<ApiResponse<T>> {
  // 过滤掉 undefined 值
  const filteredParams = params
    ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    : undefined

  return instance.get(url, { params: filteredParams }).then((res) => res.data)
}

/**
 * POST 请求
 */
export function post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  return instance.post(url, data).then((res) => res.data)
}

/**
 * PUT 请求
 */
export function put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  return instance.put(url, data).then((res) => res.data)
}

/**
 * PATCH 请求
 */
export function patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  return instance.patch(url, data).then((res) => res.data)
}

/**
 * DELETE 请求
 */
export function del<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
  return instance.delete(url, { params }).then((res) => res.data)
}

/**
 * 文件上传
 */
export function upload<T>(url: string, file: File, fieldName = 'file'): Promise<ApiResponse<T>> {
  const formData = new FormData()
  formData.append(fieldName, file)

  return instance
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
}

/**
 * 文件下载
 */
export function download(url: string, filename: string, params?: Record<string, unknown>): Promise<void> {
  return instance
    .get(url, {
      params,
      responseType: 'blob',
    })
    .then((res) => {
      const blob = new Blob([res.data])
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      URL.revokeObjectURL(link.href)
    })
}

export default instance
