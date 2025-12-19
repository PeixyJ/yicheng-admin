import * as React from 'react'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { SidebarBrand } from './sidebar-brand'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { menuConfig } from '@/constants/menu'

// 用户数据（后续可从 store 或 API 获取）
const userData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        {menuConfig.groups.map((group) => (
          <NavMain key={group.id} group={group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
