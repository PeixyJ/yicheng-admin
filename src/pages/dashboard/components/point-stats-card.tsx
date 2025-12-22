import { motion } from 'motion/react'
import { Coins, TrendingDown, Clock, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PointStatsCardProps {
  totalAvailable: number
  todayConsumption: number
  expiringIn7Days: number
  totalFrozen: number
  delay?: number
}

interface PointItem {
  label: string
  value: number
  icon: typeof Coins
  color: string
  bgColor: string
}

export function PointStatsCard({
  totalAvailable,
  todayConsumption,
  expiringIn7Days,
  totalFrozen,
  delay = 0,
}: PointStatsCardProps) {
  const items: PointItem[] = [
    {
      label: '总可用点数',
      value: totalAvailable,
      icon: Coins,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: '今日消费',
      value: todayConsumption,
      icon: TrendingDown,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: '7日内过期',
      value: expiringIn7Days,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: '冻结点数',
      value: totalFrozen,
      icon: Lock,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
    },
  ]

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.label}
            className="rounded-xl border bg-card p-4 transition-all hover:shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: delay * 0.1 + index * 0.05 }}
          >
            <div className="flex items-center gap-3">
              <div className={cn('rounded-lg p-2', item.bgColor)}>
                <Icon className={cn('h-4 w-4', item.color)} />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold">{item.value.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
