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

## 路由配置

路由配置位于 `src/router/index.tsx`，使用 React Router 的 `createBrowserRouter`：

```tsx
// 添加新路由
{
  path: 'users',
  element: <Users />,
}
```

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