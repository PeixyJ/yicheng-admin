import { get, post, patch, del } from '@/utils/request'
import type { PageData } from '@/types/api'
import type {
  SubscribeResourcePackageVO,
  ResourceExtensionRecordVO,
  ResourcePackageListParams,
  ExtensionRecordListParams,
  CreateResourcePackageRequest,
  UpdateResourcePackageRequest,
  GrantResourceExtensionRequest,
} from '@/types/resource-pack'

// ==================== 资源包管理 ====================

/**
 * 分页查询资源包列表
 */
export function getResourcePackageList(params: ResourcePackageListParams) {
  return get<PageData<SubscribeResourcePackageVO>>('/v1/subscribe/package/pages', {
    page: params.page,
    size: params.size,
    packCode: params.packCode,
    packName: params.packName,
    resourceType: params.resourceType,
    status: params.status,
  })
}

/**
 * 获取资源包详情
 */
export function getResourcePackageDetail(packageId: number) {
  return get<SubscribeResourcePackageVO>(`/v1/subscribe/package/${packageId}`)
}

/**
 * 创建资源包
 */
export function createResourcePackage(data: CreateResourcePackageRequest) {
  return post<number>('/v1/subscribe/package', data)
}

/**
 * 更新资源包
 */
export function updateResourcePackage(packageId: number, data: UpdateResourcePackageRequest) {
  return patch<void>(`/v1/subscribe/package/${packageId}`, data)
}

/**
 * 上架/下架资源包
 */
export function switchResourcePackageStatus(packageId: number, enable: boolean) {
  return patch<void>(`/v1/subscribe/package/${packageId}/status?enable=${enable}`)
}

// ==================== 扩展记录管理 ====================

/**
 * 分页查询扩展记录列表
 */
export function getExtensionRecordList(params: ExtensionRecordListParams) {
  return get<PageData<ResourceExtensionRecordVO>>('/v1/subscribe/package/extension/pages', {
    page: params.page,
    size: params.size,
    teamId: params.teamId,
    resourceType: params.resourceType,
    source: params.source,
    status: params.status,
  })
}

/**
 * 获取扩展记录详情
 */
export function getExtensionRecordDetail(recordId: number) {
  return get<ResourceExtensionRecordVO>(`/v1/subscribe/package/extension/${recordId}`)
}

/**
 * 赠送资源
 */
export function grantResourceExtension(data: GrantResourceExtensionRequest) {
  return post<number>('/v1/subscribe/package/extension/grant', data)
}

/**
 * 撤销赠送记录
 */
export function revokeExtensionRecord(recordId: number) {
  return del<void>(`/v1/subscribe/package/extension/${recordId}/revoke`)
}
