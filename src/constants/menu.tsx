import {
  LayoutDashboard,
  Users,
  UsersRound,
  CreditCard,
  Coins,
  Wallet,
  Megaphone,
  Bell,
  MessageSquareText,
  ShieldCheck,
  Settings,
} from 'lucide-react'
import type { MenuConfig } from '@/types/menu'

// 懒加载页面组件
import { lazy } from 'react'

const DashboardPage = lazy(() => import('@/pages/dashboard'))
// 根据需要添加更多页面的懒加载

/**
 * 菜单配置
 * 按业务优先级排序：
 * 1. 仪表盘 - 首页概览
 * 2. 用户管理 - 核心用户数据
 * 3. 团队管理 - 用户组织管理
 * 4. 订阅管理 - 商业模式核心
 * 5. 点数管理 - 资源/配额管理
 * 6. 支付管理 - 财务交易
 * 7. 营销管理 - 业务增长
 * 8. 通知管理 - 系统运营
 * 9. 反馈管理 - 用户反馈收集
 * 10. 管理员管理 - 系统后台管理
 * 11. 系统设置 - 系统配置
 */
export const menuConfig: MenuConfig = {
  groups: [
    {
      id: 'main',
      label: '主菜单',
      items: [
        {
          id: 'dashboard',
          title: '仪表盘',
          path: '/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      id: 'user-management',
      label: '用户与团队',
      items: [
        {
          id: 'users',
          title: '用户管理',
          path: '/dashboard/users',
          icon: Users,
        },
        {
          id: 'teams',
          title: '团队管理',
          path: '/dashboard/teams',
          icon: UsersRound,
        },
      ],
    },
    {
      id: 'business',
      label: '业务管理',
      items: [
        {
          id: 'subscriptions',
          title: '订阅管理',
          path: '/dashboard/subscriptions',
          icon: CreditCard,
        },
        {
          id: 'credits',
          title: '点数管理',
          path: '/dashboard/credits',
          icon: Coins,
        },
        {
          id: 'payments',
          title: '支付管理',
          path: '/dashboard/payments',
          icon: Wallet,
        },
      ],
    },
    {
      id: 'operations',
      label: '运营管理',
      items: [
        {
          id: 'marketing',
          title: '营销管理',
          path: '/dashboard/marketing',
          icon: Megaphone,
        },
        {
          id: 'notifications',
          title: '通知管理',
          path: '/dashboard/notifications',
          icon: Bell,
        },
        {
          id: 'feedback',
          title: '反馈管理',
          path: '/dashboard/feedback',
          icon: MessageSquareText,
        },
      ],
    },
    {
      id: 'system',
      label: '系统管理',
      items: [
        {
          id: 'admins',
          title: '管理员管理',
          path: '/dashboard/admins',
          icon: ShieldCheck,
        },
        {
          id: 'settings',
          title: '系统设置',
          path: '/dashboard/settings',
          icon: Settings,
        },
      ],
    },
  ],
}

// Dashboard 首页配置（不在菜单中显示）
export const dashboardIndex = {
  id: 'dashboard-home',
  title: 'Dashboard',
  path: '/dashboard',
  index: true,
  element: <DashboardPage />,
  hidden: true,
}
