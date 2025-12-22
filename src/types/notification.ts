// 通知父类型
export type NotificationParentType = 'INBOX' | 'SYSTEM'

// 通知状态
export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED'

// 发送者类型
export type NotificationSenderType = 'SYSTEM' | 'USER'

// 按钮执行状态
export type ButtonExecutionStatus = 'SUCCESS' | 'FAILED'

// 通知列表项
export interface NotificationVO {
  id: number
  userId: number
  teamId: number
  templateCode: string
  parentType: NotificationParentType
  title: string
  content: string
  senderType: NotificationSenderType
  senderId: number | null
  status: NotificationStatus
  readTime: string | null
  expireTime: string | null
  createTime: string
}

// 按钮执行记录
export interface ButtonExecutionVO {
  id: number
  buttonKey: string
  executionStatus: ButtonExecutionStatus
  executionResult: string | null
  errorMessage: string | null
  executedTime: string
}

// 通知详情
export interface NotificationDetailVO extends NotificationVO {
  params: string | null
  buttons: string | null
  buttonExecutions: ButtonExecutionVO[]
}

// 通知列表请求参数
export interface NotificationListParams {
  page: number
  size: number
  userId?: number
  teamId?: number
  parentType?: NotificationParentType
  status?: NotificationStatus
}

// 发送通知请求参数
export interface SendNotificationRequest {
  /** 模板编码 */
  templateCode: string
  /** 接收用户ID */
  userId: number
  /** 所属团队ID */
  teamId?: number
  /** 模板参数 */
  params?: Record<string, unknown>
  /** 发送者类型 */
  senderType?: NotificationSenderType
  /** 发送者用户ID */
  senderId?: number
}
