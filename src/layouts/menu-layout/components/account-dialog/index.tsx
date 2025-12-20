import { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

import { getAdminMe } from '@/services/admin-me'
import type { AdminMeVO } from '@/types/admin-me'

import { ProfileTab } from './components/profile-tab'
import { SecurityTab } from './components/security-tab'
import { AccountsTab } from './components/accounts-tab'
import { LoginLogsTab } from './components/login-logs-tab'
import { OperationLogsTab } from './components/operation-logs-tab'

interface AccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  const [adminMe, setAdminMe] = useState<AdminMeVO | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadAdminMe()
    }
  }, [open])

  const loadAdminMe = async () => {
    setLoading(true)
    try {
      const res = await getAdminMe()
      if (res.code === 'success') {
        setAdminMe(res.data)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = () => {
    loadAdminMe()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-w-3xl max-h-[85vh] flex flex-col'
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <Settings className='h-5 w-5 text-primary' />
            </div>
            账户设置
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className='space-y-4 py-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-32 w-full' />
            <Skeleton className='h-32 w-full' />
          </div>
        ) : adminMe ? (
          <Tabs defaultValue='profile' className='flex-1 flex flex-col min-h-0'>
            <TabsList className='w-full justify-start'>
              <TabsTrigger value='profile'>基本信息</TabsTrigger>
              <TabsTrigger value='security'>安全设置</TabsTrigger>
              <TabsTrigger value='accounts'>关联账号</TabsTrigger>
              <TabsTrigger value='login-logs'>登录日志</TabsTrigger>
              <TabsTrigger value='operation-logs'>操作日志</TabsTrigger>
            </TabsList>

            <ScrollArea className='flex-1 min-h-0'>
              <div className='py-4 pr-4'>
                <TabsContent value='profile' className='mt-0'>
                  <ProfileTab adminMe={adminMe} onUpdate={handleProfileUpdate} />
                </TabsContent>

                <TabsContent value='security' className='mt-0'>
                  <SecurityTab adminMe={adminMe} onUpdate={handleProfileUpdate} />
                </TabsContent>

                <TabsContent value='accounts' className='mt-0'>
                  <AccountsTab accounts={adminMe.accounts} />
                </TabsContent>

                <TabsContent value='login-logs' className='mt-0'>
                  <LoginLogsTab />
                </TabsContent>

                <TabsContent value='operation-logs' className='mt-0'>
                  <OperationLogsTab />
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        ) : (
          <div className='py-8 text-center text-muted-foreground'>
            加载失败，请重试
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
