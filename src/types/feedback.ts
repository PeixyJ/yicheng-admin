/**
 * 反馈类型枚举
 */
export type FeedbackType = 'BUG' | 'FEATURE' | 'COMPLAINT' | 'QUESTION' | 'OTHER'

/**
 * 反馈状态枚举
 */
export type FeedbackStatus = 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'CLOSED'

/**
 * 反馈优先级枚举
 */
export type FeedbackPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

/**
 * 反馈列表项 VO
 */
export interface AdminFeedbackVO {
  /** 反馈ID */
  id: number
  /** 用户ID */
  userId: number
  /** 用户昵称 */
  userNickname: string
  /** 反馈类型 */
  feedbackType: FeedbackType
  /** 反馈类型描述 */
  feedbackTypeDesc: string
  /** 反馈标题 */
  title: string
  /** 处理状态 */
  status: FeedbackStatus
  /** 处理状态描述 */
  statusDesc: string
  /** 优先级 */
  priority: FeedbackPriority
  /** 优先级描述 */
  priorityDesc: string
  /** 处理人ID */
  handlerId: number | null
  /** 处理人昵称 */
  handlerNickname: string | null
  /** 创建时间 */
  createTime: string
  /** 开始处理时间 */
  handleTime: string | null
}

/**
 * 反馈详情 VO
 */
export interface AdminFeedbackDetailVO {
  /** 反馈ID */
  id: number
  /** 用户ID */
  userId: number
  /** 用户昵称 */
  userNickname: string
  /** 反馈类型 */
  feedbackType: FeedbackType
  /** 反馈类型描述 */
  feedbackTypeDesc: string
  /** 反馈标题 */
  title: string
  /** 反馈内容 */
  content: string
  /** 附件图片列表 */
  images: string[]
  /** 联系邮箱 */
  contactEmail: string | null
  /** 联系电话 */
  contactPhone: string | null
  /** 处理状态 */
  status: FeedbackStatus
  /** 处理状态描述 */
  statusDesc: string
  /** 优先级 */
  priority: FeedbackPriority
  /** 优先级描述 */
  priorityDesc: string
  /** 处理人ID */
  handlerId: number | null
  /** 处理人昵称 */
  handlerNickname: string | null
  /** 开始处理时间 */
  handleTime: string | null
  /** 处理结果 */
  handleResult: string | null
  /** 客户端IP */
  clientIp: string | null
  /** User-Agent */
  userAgent: string | null
  /** 反馈页面URL */
  pageUrl: string | null
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 数据版本 */
  dataVersion: number
}

/**
 * 反馈列表查询参数
 */
export interface FeedbackListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 反馈类型 */
  feedbackType?: FeedbackType
  /** 处理状态 */
  status?: FeedbackStatus
  /** 优先级 */
  priority?: FeedbackPriority
  /** 处理人ID */
  handlerId?: number
  /** 用户ID */
  userId?: number
  /** 关键词搜索（标题/内容） */
  keyword?: string
}

/**
 * 领取/分配反馈请求
 */
export interface AssignFeedbackRequest {
  /** 处理人ID，为空时表示领取给当前管理员 */
  handlerId?: number
}

/**
 * 处理反馈请求
 */
export interface ResolveFeedbackRequest {
  /** 处理结果说明 */
  handleResult: string
}

/**
 * 关闭反馈请求
 */
export interface CloseFeedbackRequest {
  /** 关闭原因 */
  reason?: string
}

/**
 * 设置优先级请求
 */
export interface SetFeedbackPriorityRequest {
  /** 优先级 */
  priority: FeedbackPriority
}
