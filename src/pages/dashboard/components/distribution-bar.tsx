import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface DistributionItem {
  name: string
  value: number
  percentage: number
  color?: string
}

interface DistributionBarProps {
  items: DistributionItem[]
  title: string
  valueFormatter?: (value: number) => string
  delay?: number
}

const defaultColors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-purple-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-pink-500',
]

export function DistributionBar({
  items,
  title,
  valueFormatter = (v) => v.toLocaleString(),
  delay = 0,
}: DistributionBarProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">
                {valueFormatter(item.value)} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  item.color || defaultColors[index % defaultColors.length]
                )}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{
                  duration: 0.8,
                  delay: delay * 0.1 + index * 0.1,
                  ease: 'easeOut',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
