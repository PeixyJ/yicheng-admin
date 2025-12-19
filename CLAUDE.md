# Yicheng Admin

后台管理系统项目

## 技术栈

- Vite 7
- React 19
- TypeScript 5.9
- Tailwind CSS 4
- shadcn/ui
- React Router 7
- Zustand (状态管理)
- React Hook Form + Zod (表单验证)
- Day.js (日期处理)

## shadcn/ui 组件

已安装的组件位于 `src/components/ui/`：

- avatar, badge, button, card, checkbox
- dialog, dropdown-menu, form, input, label
- popover, scroll-area, select, separator, sheet
- sidebar, skeleton, sonner, table, tabs
- textarea, tooltip

使用示例：
```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

## 菜单与路由配置

菜单和路由使用统一的 JSON 配置，位于 `src/constants/menu.tsx`：

```tsx
// 菜单配置结构
export const menuConfig: MenuConfig = {
  groups: [
    {
      id: 'platform',
      label: 'Platform',
      items: [
        {
          id: 'playground',
          title: 'Playground',
          path: '/dashboard/playground',
          icon: SquareTerminal,
          isActive: true,
          children: [
            { id: 'history', title: 'History', path: '/dashboard/playground/history' },
          ],
        },
      ],
    },
  ],
}
```

**添加新菜单项：**

1. 在 `src/constants/menu.tsx` 的 `menuConfig.groups` 中添加菜单项
2. 如果需要页面，在菜单项中添加 `element` 属性（使用懒加载）
3. 侧边栏菜单和路由会自动同步

**相关文件：**

- `src/types/menu.ts` - 菜单类型定义
- `src/constants/menu.tsx` - 菜单配置
- `src/utils/menu.tsx` - 菜单工具函数（menuToRoutes, findMenuItemByPath 等）
- `src/router/index.tsx` - 路由配置（自动从 menuConfig 生成）

> 详细配置指南见 [docs/menu.md](docs/menu.md)

## 项目结构

```
src/
├── assets/          # 静态资源
│   ├── icons/       # 图标
│   └── images/      # 图片
├── components/      # 通用组件
├── constants/       # 常量定义
├── hooks/           # 自定义 Hooks
├── layouts/         # 布局组件
├── pages/           # 页面组件
├── router/          # 路由配置
├── services/        # API 请求
├── store/           # 状态管理
├── styles/          # 全局样式
├── types/           # TypeScript 类型定义
└── utils/           # 工具函数
```

## 组件目录规范

所有组件（layouts、pages、components）统一使用文件夹结构，通过 `index.tsx` 暴露主组件，子组件放在同级 `components/` 目录下：

```
component-name/
├── index.tsx           # 主组件入口
└── components/         # 子组件目录
    ├── sub-component-a.tsx
    └── sub-component-b.tsx
```

示例：

```
src/layouts/menu-layout/
├── index.tsx
└── components/
    ├── app-sidebar.tsx
    ├── nav-main.tsx
    └── nav-user.tsx

src/pages/login/
├── index.tsx
└── components/
    ├── login-email-password.tsx
    └── login-email-otp.tsx
```

导入方式：

```tsx
// 导入主组件（自动查找 index.tsx）
import MenuLayout from '@/layouts/menu-layout'
import LoginPage from '@/pages/login'

// 在组件内部导入子组件
import { AppSidebar } from './components/app-sidebar'
```

## 路径别名

项目配置了 `@/` 路径别名指向 `src/` 目录：

```ts
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'
```

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
npm run lint     # 运行 ESLint
```