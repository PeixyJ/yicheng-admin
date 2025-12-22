import { motion } from 'motion/react'
import { Bar, BarChart } from 'recharts'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface InsightsCardProps {
  className?: string
  totalUsers: number
  todayNewUsers: number
  activeUsers: number
  delay?: number
}

const InsightsCard = ({ className, totalUsers, todayNewUsers, activeUsers, delay = 0 }: InsightsCardProps) => {
  const userChartData = [
    { month: 'January', value: Math.round(totalUsers * 0.6) },
    { month: 'February', value: Math.round(totalUsers * 0.8) },
    { month: 'March', value: Math.round(totalUsers * 0.7) },
    { month: 'April', value: Math.round(totalUsers * 0.9) },
    { month: 'May', value: totalUsers }
  ]

  const activeChartData = [
    { month: 'January', value: Math.round(activeUsers * 0.7) },
    { month: 'February', value: Math.round(activeUsers * 0.85) },
    { month: 'March', value: Math.round(activeUsers * 0.75) },
    { month: 'April', value: Math.round(activeUsers * 0.95) },
    { month: 'May', value: activeUsers }
  ]

  const userChartConfig = {
    value: {
      label: '用户数',
      color: 'var(--primary)'
    }
  } satisfies ChartConfig

  const activeChartConfig = {
    value: {
      label: '活跃用户',
      color: 'color-mix(in oklab, var(--primary) 60%, transparent)'
    }
  } satisfies ChartConfig

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <Card className={cn('gap-4', className)}>
        <CardHeader className="flex justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">用户洞察</span>
            <span className="text-muted-foreground text-sm">
              今日新增: +{todayNewUsers.toLocaleString()}
            </span>
          </div>
          <div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
            <span className="text-primary text-lg font-bold">
              {Math.round((activeUsers / totalUsers) * 100)}%
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">用户总数</span>
              <span className="text-2xl font-semibold">{totalUsers.toLocaleString()}</span>
            </div>
            <ChartContainer config={userChartConfig} className="min-h-13 max-w-18">
              <BarChart accessibilityLayer data={userChartData} barSize={8}>
                <Bar dataKey="value" fill="var(--color-value)" radius={2} />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">活跃用户</span>
              <span className="text-2xl font-semibold">{activeUsers.toLocaleString()}</span>
            </div>
            <ChartContainer config={activeChartConfig} className="min-h-13 max-w-18">
              <BarChart accessibilityLayer data={activeChartData} barSize={8}>
                <Bar dataKey="value" fill="var(--color-value)" radius={2} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default InsightsCard
