import type { ReactNode } from 'react'
import { motion } from 'motion/react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatisticsCardProps = {
  icon: ReactNode
  value: string
  title: string
  changePercentage?: string
  className?: string
  delay?: number
}

const StatisticsCard = ({ icon, value, title, changePercentage, className, delay = 0 }: StatisticsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <Card className={cn('gap-4 transition-all hover:shadow-lg hover:-translate-y-0.5', className)}>
        <CardHeader className="flex items-center">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
            {icon}
          </div>
          <motion.span
            className="text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay * 0.1 + 0.2, type: 'spring' }}
          >
            {value}
          </motion.span>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <span className="font-semibold">{title}</span>
          {changePercentage && (
            <p className="space-x-2">
              <span
                className={cn(
                  'text-sm font-medium',
                  changePercentage.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'
                )}
              >
                {changePercentage}
              </span>
              <span className="text-muted-foreground text-sm">vs 上周</span>
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default StatisticsCard
