/**
 * API 响应结构
 */
export interface ApiResponse<T = unknown> {
  /** 响应码，success 表示成功 */
  code: 'success' | string
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
  /** 时间戳 */
  date: number
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
 * 分页查询参数
 */
export interface PageParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
}

/**
 * 业务错误
 */
export class BusinessError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.name = 'BusinessError'
  }
}
