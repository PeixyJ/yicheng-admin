import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface MenuItem {
  // 基础信息
  id: string
  title: string
  icon?: LucideIcon

  // 路由信息
  path?: string
  element?: ReactNode
  index?: boolean

  // 菜单行为
  isActive?: boolean
  hidden?: boolean // 是否在菜单中隐藏

  // 子菜单
  children?: MenuItem[]
}

export interface MenuGroup {
  id: string
  label: string
  items: MenuItem[]
}

export interface MenuConfig {
  groups: MenuGroup[]
}
