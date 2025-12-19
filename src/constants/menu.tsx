import {
  SquareTerminal,
  Bot,
  BookOpen,
  Settings2,
  Frame,
  PieChart,
  Map,
} from 'lucide-react'
import type { MenuConfig } from '@/types/menu'

// 懒加载页面组件
import { lazy } from 'react'

const DashboardPage = lazy(() => import('@/pages/dashboard'))
// 根据需要添加更多页面的懒加载

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
            {
              id: 'history',
              title: 'History',
              path: '/dashboard/playground/history',
            },
            {
              id: 'starred',
              title: 'Starred',
              path: '/dashboard/playground/starred',
            },
            {
              id: 'settings',
              title: 'Settings',
              path: '/dashboard/playground/settings',
            },
          ],
        },
        {
          id: 'models',
          title: 'Models',
          path: '/dashboard/models',
          icon: Bot,
          children: [
            {
              id: 'genesis',
              title: 'Genesis',
              path: '/dashboard/models/genesis',
            },
            {
              id: 'explorer',
              title: 'Explorer',
              path: '/dashboard/models/explorer',
            },
            {
              id: 'quantum',
              title: 'Quantum',
              path: '/dashboard/models/quantum',
            },
          ],
        },
        {
          id: 'documentation',
          title: 'Documentation',
          path: '/dashboard/documentation',
          icon: BookOpen,
          children: [
            {
              id: 'introduction',
              title: 'Introduction',
              path: '/dashboard/documentation/introduction',
            },
            {
              id: 'get-started',
              title: 'Get Started',
              path: '/dashboard/documentation/get-started',
            },
            {
              id: 'tutorials',
              title: 'Tutorials',
              path: '/dashboard/documentation/tutorials',
            },
            {
              id: 'changelog',
              title: 'Changelog',
              path: '/dashboard/documentation/changelog',
            },
          ],
        },
        {
          id: 'settings',
          title: 'Settings',
          path: '/dashboard/settings',
          icon: Settings2,
          children: [
            {
              id: 'general',
              title: 'General',
              path: '/dashboard/settings/general',
            },
            {
              id: 'team',
              title: 'Team',
              path: '/dashboard/settings/team',
            },
            {
              id: 'billing',
              title: 'Billing',
              path: '/dashboard/settings/billing',
            },
            {
              id: 'limits',
              title: 'Limits',
              path: '/dashboard/settings/limits',
            },
          ],
        },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      items: [
        {
          id: 'design-engineering',
          title: 'Design Engineering',
          path: '/dashboard/projects/design-engineering',
          icon: Frame,
        },
        {
          id: 'sales-marketing',
          title: 'Sales & Marketing',
          path: '/dashboard/projects/sales-marketing',
          icon: PieChart,
        },
        {
          id: 'travel',
          title: 'Travel',
          path: '/dashboard/projects/travel',
          icon: Map,
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
