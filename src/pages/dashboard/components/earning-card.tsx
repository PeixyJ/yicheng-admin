import { motion } from 'motion/react'
import { ChevronUpIcon, ChevronDownIcon, EllipsisVerticalIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { PlanDistribution } from '@/types/dashboard'

interface EarningCardProps {
  className?: string
  title: string
  mrrFormatted: string
  trend: 'up' | 'down'
  percentage: number
  comparisonText: string
  planDistribution: PlanDistribution[]
  delay?: number
}

const listItems = ['分享', '更新', '刷新']

const planColors = [
  { bg: 'bg-blue-500/10', icon: 'text-blue-500' },
  { bg: 'bg-emerald-500/10', icon: 'text-emerald-500' },
  { bg: 'bg-amber-500/10', icon: 'text-amber-500' },
  { bg: 'bg-purple-500/10', icon: 'text-purple-500' }
]

const EarningCard = ({
  className,
  title,
  mrrFormatted,
  trend,
  percentage,
  comparisonText,
  planDistribution,
  delay = 0
}: EarningCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <Card className={cn('', className)}>
        <CardHeader className="flex items-center justify-between">
          <span className="text-lg font-semibold">{title}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground size-6 rounded-full">
                <EllipsisVerticalIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {listItems.map((item, index) => (
                  <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <motion.span
                className="text-2xl font-semibold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: delay * 0.1 + 0.2, type: 'spring' }}
              >
                {mrrFormatted}
              </motion.span>
              <span
                className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                )}
              >
                {trend === 'up' ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                {percentage}%
              </span>
            </div>
            <span className="text-muted-foreground text-sm">{comparisonText}</span>
          </div>
          <div className="flex flex-1 flex-col justify-evenly gap-4">
            {planDistribution.slice(0, 3).map((plan, index) => {
              const colors = planColors[index % planColors.length]
              return (
                <motion.div
                  key={plan.planId}
                  className="flex items-center justify-between gap-2.5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: delay * 0.1 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <Avatar className="size-11 rounded-sm">
                      <AvatarFallback className={cn('shrink-0 rounded-sm font-semibold', colors.bg, colors.icon)}>
                        {plan.planName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{plan.planName}</span>
                      <span className="text-muted-foreground text-sm">{plan.subscriptionCount} 个订阅</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-right">{plan.percentage.toFixed(1)}%</p>
                    <Progress value={plan.percentage} className="w-24" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default EarningCard
