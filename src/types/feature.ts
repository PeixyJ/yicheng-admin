/**
 * 功能类型枚举
 */
export type FeatureType = 'BOOLEAN' | 'POINTS'

/**
 * 功能信息 VO
 */
export interface FeatureVO {
  /** 主键ID */
  id: number
  /** 功能编码，系统唯一标识 */
  featureCode: string
  /** 功能名称 */
  featureName: string
  /** 功能类型：BOOLEAN-开关型、POINTS-计量型 */
  featureType: FeatureType
  /** 功能类型名称 */
  featureTypeName: string
  /** 功能描述 */
  description: string | null
  /** 每次使用消耗的点数 */
  pointsCost: number | null
  /** 排序序号 */
  sortOrder: number
  /** 启用状态 */
  status: boolean
}

/**
 * 功能列表查询参数
 */
export interface FeatureListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  size: number
  /** 功能名称 */
  featureName?: string
  /** 功能编码 */
  featureCode?: string
  /** 功能类型 */
  featureType?: FeatureType
  /** 启用状态 */
  status?: boolean
}

/**
 * 创建功能请求
 */
export interface CreateFeatureRequest {
  /** 功能编码 */
  featureCode: string
  /** 功能名称 */
  featureName: string
  /** 功能类型 */
  featureType: FeatureType
  /** 功能描述 */
  description?: string
  /** 每次使用消耗的点数 */
  pointsCost?: number
  /** 排序序号 */
  sortOrder?: number
  /** 启用状态 */
  status?: boolean
}

/**
 * 修改功能请求
 */
export interface UpdateFeatureRequest {
  /** 功能名称 */
  featureName?: string
  /** 功能类型 */
  featureType?: FeatureType
  /** 功能描述 */
  description?: string
  /** 每次使用消耗的点数 */
  pointsCost?: number
  /** 排序序号 */
  sortOrder?: number
}
