import type { RouteObject } from 'react-router-dom'
import type { MenuItem, MenuConfig } from '@/types/menu'

/**
 * 将菜单配置转换为路由配置
 */
export function menuToRoutes(config: MenuConfig, basePath = '/dashboard'): RouteObject[] {
  const routes: RouteObject[] = []

  for (const group of config.groups) {
    for (const item of group.items) {
      const itemRoutes = menuItemToRoutes(item, basePath)
      routes.push(...itemRoutes)
    }
  }

  return routes
}

function menuItemToRoutes(item: MenuItem, basePath: string): RouteObject[] {
  const routes: RouteObject[] = []

  // 计算相对路径
  const fullPath = item.path || ''
  const relativePath = fullPath.startsWith(basePath)
    ? fullPath.slice(basePath.length + 1)
    : fullPath

  // 如果有 element，创建路由
  if (item.element) {
    routes.push({
      path: relativePath || undefined,
      index: item.index,
      element: item.element,
    })
  }

  // 处理子菜单
  if (item.children) {
    for (const child of item.children) {
      const childRoutes = menuItemToRoutes(child, basePath)
      routes.push(...childRoutes)
    }
  }

  return routes
}

/**
 * 获取所有菜单项的扁平列表（用于面包屑等）
 */
export function flattenMenuItems(config: MenuConfig): MenuItem[] {
  const items: MenuItem[] = []

  function traverse(menuItems: MenuItem[]) {
    for (const item of menuItems) {
      items.push(item)
      if (item.children) {
        traverse(item.children)
      }
    }
  }

  for (const group of config.groups) {
    traverse(group.items)
  }

  return items
}

/**
 * 根据路径查找菜单项
 */
export function findMenuItemByPath(config: MenuConfig, path: string): MenuItem | undefined {
  const items = flattenMenuItems(config)
  return items.find(item => item.path === path)
}

/**
 * 获取面包屑路径
 */
export function getBreadcrumbs(config: MenuConfig, path: string): MenuItem[] {
  const items = flattenMenuItems(config)

  // 按路径深度排序，找到匹配的父级路径
  return items
    .filter(item => item.path && path.startsWith(item.path))
    .sort((a, b) => (a.path?.length || 0) - (b.path?.length || 0))
}
