import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { removeToken } from "@/utils/request"
import { getAdminMe } from "@/services/admin-me"
import type { AdminMeVO } from "@/types/admin-me"
import { AccountDialog } from "./account-dialog"

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const [accountDialogOpen, setAccountDialogOpen] = useState(false)
  const [adminInfo, setAdminInfo] = useState<AdminMeVO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminMe()
      .then((res) => {
        setAdminInfo(res.data)
      })
      .catch((error) => {
        console.error('Failed to fetch admin info:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }

  const handleAccountClick = () => {
    setAccountDialogOpen(true)
  }

  // 获取用户名首字母作为头像回退
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase()
  }

  // 从账号列表获取主要邮箱
  const primaryEmail = adminInfo?.accounts?.find(
    (account) => account.accountType === 'EMAIL'
  )?.identifier || ''

  const displayName = adminInfo?.nickname || ''
  const avatarUrl = adminInfo?.avatarUrl || ''

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="grid flex-1 gap-1">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {displayName ? getInitials(displayName) : 'AD'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{primaryEmail}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="rounded-lg">
                      {displayName ? getInitials(displayName) : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-xs">{primaryEmail}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleAccountClick}>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <AccountDialog
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
      />
    </>
  )
}
