# 菜单配置指南

本项目使用统一的 JSON 配置来管理侧边栏菜单和路由，配置一次即可同时生效。

## 文件结构

```
src/
├── types/menu.ts           # 菜单类型定义
├── constants/menu.tsx      # 菜单配置文件
├── utils/menu.tsx          # 菜单工具函数
└── router/index.tsx        # 路由（自动从配置生成）
```

## 类型定义

### MenuItem（菜单项）

```typescript
interface MenuItem {
  // 基础信息（必填）
  id: string              // 唯一标识
  title: string           // 显示名称

  // 可选信息
  icon?: LucideIcon       // 图标（来自 lucide-react）
  path?: string           // 路由路径
  element?: ReactNode     // 页面组件（有页面时必填）
  index?: boolean         // 是否为索引路由
  isActive?: boolean      // 是否默认展开（有子菜单时）
  hidden?: boolean        // 是否在菜单中隐藏
  children?: MenuItem[]   // 子菜单
}
```

### MenuGroup（菜单分组）

```typescript
interface MenuGroup {
  id: string              // 分组唯一标识
  label: string           // 分组标题（显示在侧边栏）
  items: MenuItem[]       // 分组下的菜单项
}
```

### MenuConfig（菜单配置）

```typescript
interface MenuConfig {
  groups: MenuGroup[]     // 所有分组
}
```

## 配置示例

### 1. 添加简单菜单项（无子菜单）

```tsx
// src/constants/menu.tsx
{
  id: 'users',
  title: 'Users',
  path: '/dashboard/users',
  icon: Users,
  element: <UsersPage />,
}
```

### 2. 添加带子菜单的菜单项

```tsx
{
  id: 'settings',
  title: 'Settings',
  path: '/dashboard/settings',
  icon: Settings2,
  isActive: true,  // 默认展开
  children: [
    {
      id: 'general',
      title: 'General',
      path: '/dashboard/settings/general',
      element: <GeneralSettingsPage />,
    },
    {
      id: 'security',
      title: 'Security',
      path: '/dashboard/settings/security',
      element: <SecuritySettingsPage />,
    },
  ],
}
```

### 3. 添加新的菜单分组

```tsx
export const menuConfig: MenuConfig = {
  groups: [
    // 已有分组...
    {
      id: 'admin',
      label: 'Administration',
      items: [
        {
          id: 'user-management',
          title: 'User Management',
          path: '/dashboard/admin/users',
          icon: UserCog,
          element: <UserManagementPage />,
        },
      ],
    },
  ],
}
```

### 4. 使用懒加载（推荐）

```tsx
import { lazy } from 'react'

// 懒加载页面组件
const UsersPage = lazy(() => import('@/pages/users'))
const SettingsPage = lazy(() => import('@/pages/settings'))

// 在配置中使用
{
  id: 'users',
  title: 'Users',
  path: '/dashboard/users',
  icon: Users,
  element: <UsersPage />,
}
```

## 完整配置流程

### 步骤 1：创建页面组件

```tsx
// src/pages/users/index.tsx
const UsersPage = () => {
  return (
    <div>
      <h1>Users</h1>
    </div>
  )
}

export default UsersPage
```

### 步骤 2：在菜单配置中添加

```tsx
// src/constants/menu.tsx
import { lazy } from 'react'
import { Users } from 'lucide-react'

const UsersPage = lazy(() => import('@/pages/users'))

export const menuConfig: MenuConfig = {
  groups: [
    {
      id: 'platform',
      label: 'Platform',
      items: [
        // 添加新菜单项
        {
          id: 'users',
          title: 'Users',
          path: '/dashboard/users',
          icon: Users,
          element: <UsersPage />,
        },
        // 其他菜单项...
      ],
    },
  ],
}
```

### 步骤 3：完成

侧边栏菜单和路由会自动更新，无需手动修改 `router/index.tsx`。

## 工具函数

`src/utils/menu.tsx` 提供以下工具函数：

```typescript
// 将菜单配置转换为路由配置
menuToRoutes(config: MenuConfig, basePath?: string): RouteObject[]

// 获取所有菜单项的扁平列表
flattenMenuItems(config: MenuConfig): MenuItem[]

// 根据路径查找菜单项
findMenuItemByPath(config: MenuConfig, path: string): MenuItem | undefined

// 获取面包屑路径
getBreadcrumbs(config: MenuConfig, path: string): MenuItem[]
```

## 注意事项

1. **路径格式**：所有路径必须以 `/dashboard` 开头
2. **唯一 ID**：每个菜单项的 `id` 必须唯一
3. **图标**：使用 `lucide-react` 图标库
4. **懒加载**：建议使用 `lazy()` 懒加载页面组件以优化性能
5. **未实现页面**：没有 `element` 的菜单项会显示"页面开发中"占位符

## 图标参考

常用图标导入：

```tsx
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart,
  Mail,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  // 更多图标见 https://lucide.dev/icons
} from 'lucide-react'
```
