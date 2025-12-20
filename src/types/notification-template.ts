/**
 * 通知大分类
 */
export type NotificationParentType = 'INBOX' | 'SYSTEM'

/**
 * 按钮类型
 */
export type NotificationButtonType = 'REDIRECT' | 'FUNCTION'

/**
 * 模板参数定义
 */
export interface NotificationParam {
  /** 参数名称 */
  name: string
  /** 参数类型 */
  type: string
  /** 是否必填 */
  required: boolean
}

/**
 * 模板按钮配置
 */
export interface NotificationButton {
  /** 按钮类型 */
  type: NotificationButtonType
  /** 按钮标签 */
  label: string
  /** 动作 */
  action: string
  /** 样式 */
  style?: string
  /** 跳转链接 */
  redirect_url?: string
}

/**
 * 通知模板 VO
 */
export interface NotificationTemplateVO {
  /** ID */
  id: number
  /** 模板编码 */
  code: string
  /** 模板名称 */
  name: string
  /** 通知大分类 */
  parentType: NotificationParentType
  /** 标题模板 */
  titleTemplate: string
  /** 内容模板 */
  contentTemplate: string
  /** 参数定义 JSON 字符串 */
  params: string
  /** 按钮配置 JSON 字符串 */
  buttons: string
  /** 过期天数 */
  expireDays: number
  /** 状态 */
  status: boolean
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 模板列表查询参数
 */
export interface TemplateListParams {
  /** 页码 */
  page: number
  /** 每页大小 */
  size: number
  /** 模板编码 */
  code?: string
  /** 模板名称 */
  name?: string
  /** 通知大分类 */
  parentType?: NotificationParentType
  /** 状态 */
  status?: boolean
}

/**
 * 创建模板请求
 */
export interface CreateTemplateRequest {
  /** 模板编码 */
  code: string
  /** 模板名称 */
  name: string
  /** 通知大分类 */
  parentType: NotificationParentType
  /** 标题模板 */
  titleTemplate: string
  /** 内容模板 */
  contentTemplate: string
  /** 参数定义 */
  params?: NotificationParam[]
  /** 按钮配置 */
  buttons?: NotificationButton[]
  /** 过期天数 */
  expireDays?: number
  /** 状态 */
  status?: boolean
}

/**
 * 更新模板请求
 */
export interface UpdateTemplateRequest {
  /** 模板名称 */
  name?: string
  /** 通知大分类 */
  parentType?: NotificationParentType
  /** 标题模板 */
  titleTemplate?: string
  /** 内容模板 */
  contentTemplate?: string
  /** 参数定义 */
  params?: NotificationParam[]
  /** 按钮配置 */
  buttons?: NotificationButton[]
  /** 过期天数 */
  expireDays?: number
  /** 状态 */
  status?: boolean
}
