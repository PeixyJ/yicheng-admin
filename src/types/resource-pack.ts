/**
 * 资源类型枚举
 */
export type ResourceType = 'PROJECT' | 'MEMBER' | 'STORAGE'

/**
 * 扩展记录来源枚举
 */
export type ExtensionSource = 'PURCHASE' | 'GRANT'

/**
 * 扩展记录状态枚举
 */
export type ExtensionStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED'

/**
 * 订阅资源包 VO
 */
export interface SubscribeResourcePackageVO {
  /** 主键ID */
  id: number
  /** 扩展包编码 */
  packCode: string
  /** 扩展包名称 */
  packName: string
  /** 资源类型 */
  resourceType: ResourceType
  /** 扩展包提供的资源数量 */
  resourceAmount: number
  /** 销售价格 */
  price: number
  /** 原价/划线价 */
  originalPrice: number | null
  /** 货币类型 */
  currency: string
  /** 资源有效天数 */
  durationDays: number | null
  /** 扩展包详细描述 */
  description: string | null
  /** 是否在商城展示 */
  isVisible: boolean
  /** 排序序号 */
  sortOrder: number
  /** 启用状态 */
  status: boolean
  /** 创建时间 */
  createTime: string
  /** 修改时间 */
  updateTime: string
  /** 数据版本 */
  dataVersion: number
}

/**
 * 资源扩展记录 VO
 */
export interface ResourceExtensionRecordVO {
  /** 主键ID */
  id: number
  /** 团队ID */
  teamId: number
  /** 团队名称 */
  teamName: string | null
  /** 资源类型 */
  resourceType: ResourceType
  /** 资源类型描述 */
  resourceTypeDesc: string | null
  /** 获取来源 */
  source: ExtensionSource
  /** 来源描述 */
  sourceDesc: string | null
  /** 扩展的资源数量 */
  amount: number
  /** 资源过期时间 */
  expireTime: string | null
  /** 关联的订单ID */
  orderId: number | null
  /** 关联的资源包ID */
  packId: number | null
  /** 资源包名称 */
  packName: string | null
  /** 赠送操作的管理员ID */
  grantUserId: number | null
  /** 赠送管理员名称 */
  grantUserName: string | null
  /** 赠送原因 */
  grantReason: string | null
  /** 资源状态 */
  status: ExtensionStatus
  /** 状态描述 */
  statusDesc: string | null
  /** 创建时间 */
  createTime: string
  /** 数据版本 */
  dataVersion: number
}

/**
 * 资源包列表查询参数
 */
export interface ResourcePackageListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 资源包编码 */
  packCode?: string
  /** 资源包名称 */
  packName?: string
  /** 资源类型 */
  resourceType?: ResourceType
  /** 启用状态 */
  status?: boolean
}

/**
 * 扩展记录列表查询参数
 */
export interface ExtensionRecordListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 团队ID */
  teamId?: number
  /** 资源类型 */
  resourceType?: ResourceType
  /** 获取来源 */
  source?: ExtensionSource
  /** 资源状态 */
  status?: ExtensionStatus
}

/**
 * 创建资源包请求
 */
export interface CreateResourcePackageRequest {
  /** 扩展包编码 */
  packCode: string
  /** 扩展包名称 */
  packName: string
  /** 资源类型 */
  resourceType: ResourceType
  /** 资源数量 */
  resourceAmount: number
  /** 销售价格 */
  price: number
  /** 原价 */
  originalPrice?: number
  /** 货币类型 */
  currency: string
  /** 有效天数 */
  durationDays?: number
  /** 描述 */
  description?: string
  /** 排序序号 */
  sortOrder?: number
}

/**
 * 更新资源包请求
 */
export interface UpdateResourcePackageRequest {
  /** 扩展包名称 */
  packName?: string
  /** 资源类型 */
  resourceType?: ResourceType
  /** 资源数量 */
  resourceAmount?: number
  /** 销售价格 */
  price?: number
  /** 原价 */
  originalPrice?: number
  /** 货币类型 */
  currency?: string
  /** 有效天数 */
  durationDays?: number
  /** 描述 */
  description?: string
  /** 是否可见 */
  isVisible?: boolean
  /** 排序序号 */
  sortOrder?: number
  /** 数据版本 */
  dataVersion?: number
}

/**
 * 赠送资源请求
 */
export interface GrantResourceExtensionRequest {
  /** 团队ID */
  teamId: number
  /** 资源类型 */
  resourceType: ResourceType
  /** 资源数量 */
  amount: number
  /** 有效天数 */
  durationDays?: number
  /** 关联资源包ID */
  packId?: number
  /** 赠送原因 */
  grantReason: string
}
