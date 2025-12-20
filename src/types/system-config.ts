/**
 * 配置值类型枚举
 */
export type ConfigValueType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'TEXT'

/**
 * 系统配置列表 VO
 */
export interface SystemConfigVO {
  /** 配置ID */
  id: number
  /** 配置键 */
  configKey: string
  /** 配置值 */
  configValue: string
  /** 值类型 */
  valueType: string
  /** 值类型描述 */
  valueTypeDesc: string
  /** 配置分组 */
  configGroup: string
  /** 配置分组描述 */
  configGroupDesc: string
  /** 描述 */
  description: string | null
  /** 是否只读 */
  isReadonly: boolean
  /** 数据版本 */
  dataVersion: number
  /** 更新时间 */
  updateTime: string
}

/**
 * 系统配置详情 VO
 */
export interface SystemConfigDetailVO {
  /** 配置ID */
  id: number
  /** 配置键 */
  configKey: string
  /** 配置值 */
  configValue: string
  /** 值类型 */
  valueType: string
  /** 值类型描述 */
  valueTypeDesc: string
  /** 配置分组 */
  configGroup: string
  /** 配置分组描述 */
  configGroupDesc: string
  /** 描述 */
  description: string | null
  /** 默认值 */
  defaultValue: string | null
  /** 是否加密 */
  isEncrypted: boolean
  /** 是否只读 */
  isReadonly: boolean
  /** 排序 */
  sortOrder: number
  /** 数据版本 */
  dataVersion: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 系统配置变更日志 VO
 */
export interface SystemConfigLogVO {
  /** 日志ID */
  id: number
  /** 配置ID */
  configId: number
  /** 配置键 */
  configKey: string
  /** 操作类型 */
  action: string
  /** 操作类型描述 */
  actionDesc: string
  /** 修改前值 */
  beforeValue: string | null
  /** 修改后值 */
  afterValue: string | null
  /** 修改原因 */
  changeReason: string | null
  /** 操作人ID */
  adminId: number
  /** 操作人名称 */
  adminName: string
  /** 客户端IP */
  clientIp: string
  /** 创建时间 */
  createTime: string
}

/**
 * 系统配置列表查询参数
 */
export interface SystemConfigListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 配置键（模糊匹配） */
  configKey?: string
  /** 配置分组 */
  configGroup?: string
  /** 关键词（配置键或描述中搜索） */
  keyword?: string
}

/**
 * 创建系统配置请求
 */
export interface CreateSystemConfigRequest {
  /** 配置键 */
  configKey: string
  /** 配置值 */
  configValue: string
  /** 值类型 */
  valueType?: ConfigValueType
  /** 配置分组 */
  configGroup: string
  /** 描述 */
  description?: string
  /** 默认值 */
  defaultValue?: string
  /** 是否加密 */
  isEncrypted?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 排序 */
  sortOrder?: number
}

/**
 * 更新系统配置请求
 */
export interface UpdateSystemConfigRequest {
  /** 配置值 */
  configValue: string
  /** 描述 */
  description?: string
  /** 数据版本（乐观锁） */
  dataVersion: number
}

/**
 * 配置日志查询参数
 */
export interface SystemConfigLogParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
}
