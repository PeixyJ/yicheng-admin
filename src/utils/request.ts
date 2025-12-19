import type { ApiResponse } from '@/types/user'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>
}

/**
 * 构建带查询参数的 URL
 */
function buildUrl(url: string, params?: Record<string, string | number | undefined>): string {
  if (!params) return `${BASE_URL}${url}`

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return `${BASE_URL}${url}${queryString ? `?${queryString}` : ''}`
}

/**
 * 通用请求方法
 */
async function request<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options

  const response = await fetch(buildUrl(url, params), {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * GET 请求
 */
export function get<T>(url: string, params?: Record<string, string | number | undefined>): Promise<ApiResponse<T>> {
  return request<T>(url, { method: 'GET', params })
}

/**
 * POST 请求
 */
export function post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  return request<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUT 请求
 */
export function put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  return request<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE 请求
 */
export function del<T>(url: string): Promise<ApiResponse<T>> {
  return request<T>(url, { method: 'DELETE' })
}
