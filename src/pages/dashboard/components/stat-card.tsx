import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type ColorScheme = 'blue' | 'green' | 'amber' | 'rose' | 'purple' | 'cyan'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    type: 'up' | 'down'
  }
  colorScheme?: ColorScheme
  delay?: number
}

const colorSchemes: Record<ColorScheme, { bg: string; icon: string; gradient: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-500',
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
  },
  green: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-500',
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-500',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
  },
  rose: {
    bg: 'bg-rose-500/10',
    icon: 'text-rose-500',
    gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-500',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    icon: 'text-cyan-500',
    gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
  },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorScheme = 'blue',
  delay = 0,
}: StatCardProps) {
  const colors = colorSchemes[colorScheme]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1, ease: 'easeOut' }}
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
        {/* 背景渐变 */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity',
            colors.gradient
          )}
        />

        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <motion.p
                className="text-3xl font-bold tracking-tight"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: delay * 0.1 + 0.2, type: 'spring' }}
              >
                {value}
              </motion.p>
              {(trend || description) && (
                <div className="flex items-center gap-2">
                  {trend && (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-medium',
                        trend.type === 'up' ? 'text-emerald-500' : 'text-rose-500'
                      )}
                    >
                      {trend.type === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {trend.value}%
                    </span>
                  )}
                  {description && (
                    <span className="text-xs text-muted-foreground">{description}</span>
                  )}
                </div>
              )}
            </div>

            {/* 图标 */}
            <motion.div
              className={cn(
                'rounded-xl p-3 transition-transform group-hover:scale-110',
                colors.bg
              )}
              whileHover={{ rotate: 5 }}
            >
              <Icon className={cn('h-6 w-6', colors.icon)} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
