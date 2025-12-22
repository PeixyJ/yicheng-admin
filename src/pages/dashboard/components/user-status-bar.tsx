import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface UserStatusBarProps {
  activeUsers: number
  pendingUsers: number
  suspendedUsers: number
  deletedUsers: number
  totalUsers: number
  delay?: number
}

interface StatusSegment {
  label: string
  value: number
  percentage: number
  color: string
  bgColor: string
}

export function UserStatusBar({
  activeUsers,
  pendingUsers,
  suspendedUsers,
  deletedUsers,
  totalUsers,
  delay = 0,
}: UserStatusBarProps) {
  const segments: StatusSegment[] = [
    {
      label: '正常',
      value: activeUsers,
      percentage: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: '待激活',
      value: pendingUsers,
      percentage: totalUsers > 0 ? (pendingUsers / totalUsers) * 100 : 0,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: '已封禁',
      value: suspendedUsers,
      percentage: totalUsers > 0 ? (suspendedUsers / totalUsers) * 100 : 0,
      color: 'bg-rose-500',
      bgColor: 'bg-rose-500/10',
    },
    {
      label: '已注销',
      value: deletedUsers,
      percentage: totalUsers > 0 ? (deletedUsers / totalUsers) * 100 : 0,
      color: 'bg-gray-400',
      bgColor: 'bg-gray-400/10',
    },
  ]

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <h4 className="text-sm font-medium text-muted-foreground">用户状态分布</h4>

      {/* 堆叠条形图 */}
      <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
        {segments.map((segment, index) => (
          <motion.div
            key={segment.label}
            className={cn('h-full first:rounded-l-full last:rounded-r-full', segment.color)}
            initial={{ width: 0 }}
            animate={{ width: `${segment.percentage}%` }}
            transition={{
              duration: 0.8,
              delay: delay * 0.1 + index * 0.1,
              ease: 'easeOut',
            }}
            title={`${segment.label}: ${segment.value.toLocaleString()} (${segment.percentage.toFixed(1)}%)`}
          />
        ))}
      </div>

      {/* 图例 */}
      <div className="grid grid-cols-2 gap-3">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={cn(
              'flex items-center justify-between rounded-lg px-3 py-2',
              segment.bgColor
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn('h-2.5 w-2.5 rounded-full', segment.color)} />
              <span className="text-sm font-medium">{segment.label}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {segment.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
