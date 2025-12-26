import { motion } from 'motion/react'
import { Bar, BarChart, Label, Pie, PieChart } from 'recharts'
import {
  TrendingUpIcon,
  BadgePercentIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  ChartNoAxesCombinedIcon,
  CirclePercentIcon
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface RevenueChartProps {
  className?: string
  mrrFormatted: string
  totalRevenueFormatted: string
  todayRevenueFormatted: string
  totalOrders: number
  successRate: number
  delay?: number
}

const revenueChartData = [
  { month: 'january', sales: 340, fill: 'var(--color-january)' },
  { month: 'february', sales: 200, fill: 'var(--color-february)' },
  { month: 'march', sales: 200, fill: 'var(--color-march)' }
]

const revenueChartConfig = {
  sales: {
    label: 'Sales'
  },
  january: {
    label: '本月',
    color: 'var(--primary)'
  },
  february: {
    label: '上月',
    color: 'color-mix(in oklab, var(--primary) 60%, transparent)'
  },
  march: {
    label: '其他',
    color: 'color-mix(in oklab, var(--primary) 20%, transparent)'
  }
} satisfies ChartConfig

const salesChartConfig = {
  sales: {
    label: 'Sales'
  }
} satisfies ChartConfig

const RevenueChart = ({
  className,
  mrrFormatted,
  totalRevenueFormatted,
  todayRevenueFormatted,
  totalOrders,
  successRate,
  delay = 0
}: RevenueChartProps) => {
  const salesPlanPercentage = Math.round(successRate)
  const totalBars = 24
  const filledBars = Math.round((salesPlanPercentage * totalBars) / 100)

  const salesChartData = Array.from({ length: totalBars }, (_, index) => ({
    date: `${index + 1}`,
    sales: index < filledBars ? 315 : 0
  }))

  const metricsData = [
    {
      icons: <TrendingUpIcon className="size-5" />,
      title: 'MRR',
      value: mrrFormatted
    },
    {
      icons: <BadgePercentIcon className="size-5" />,
      title: '今日收入',
      value: todayRevenueFormatted
    },
    {
      icons: <DollarSignIcon className="size-5" />,
      title: '总收入',
      value: totalRevenueFormatted
    },
    {
      icons: <ShoppingBagIcon className="size-5" />,
      title: '总订单',
      value: totalOrders.toLocaleString()
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <Card className={className}>
        <CardContent className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="flex flex-col gap-7 lg:col-span-3">
              <span className="text-lg font-semibold">销售指标</span>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  <ChartNoAxesCombinedIcon className="text-primary size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-medium">业务概览</span>
                  <span className="text-muted-foreground text-sm">实时数据统计</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {metricsData.map((metric, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 rounded-md border px-4 py-2 transition-all hover:shadow-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: delay * 0.1 + index * 0.05 }}
                  >
                    <Avatar className="size-8.5 rounded-sm">
                      <AvatarFallback className="bg-primary/10 text-primary shrink-0 rounded-sm">
                        {metric.icons}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground text-sm font-medium">{metric.title}</span>
                      <span className="text-lg font-medium">{metric.value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <Card className="gap-4 py-4 shadow-none lg:col-span-2">
              <CardHeader className="gap-1">
                <CardTitle className="text-lg font-semibold">收入目标</CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <ChartContainer config={revenueChartConfig} className="h-38.5 w-full">
                  <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={revenueChartData}
                      dataKey="sales"
                      nameKey="month"
                      startAngle={300}
                      endAngle={660}
                      innerRadius={58}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) - 12}
                                  className="fill-card-foreground text-lg font-medium"
                                >
                                  {successRate.toFixed(1)}%
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 19}
                                  className="fill-muted-foreground text-sm"
                                >
                                  成功率
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>

              <CardFooter className="justify-between">
                <span className="text-xl">计划完成</span>
                <span className="text-2xl font-medium">{successRate.toFixed(0)}%</span>
              </CardFooter>
            </Card>
          </div>

          <Card className="shadow-none">
            <CardContent className="grid gap-4 px-4 lg:grid-cols-5">
              <div className="flex flex-col justify-center gap-6">
                <span className="text-lg font-semibold">销售计划</span>
                <span className="max-lg:5xl text-6xl">{salesPlanPercentage}%</span>
                <span className="text-muted-foreground text-sm">总销售百分比利润</span>
              </div>
              <div className="flex flex-col gap-6 text-lg md:col-span-4">
                <span className="font-medium">业务分析指标</span>
                <span className="text-muted-foreground text-wrap">
                  分析同一时期加入产品/服务的一组用户的行为，在一定时期内的变化趋势。
                </span>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <ChartNoAxesCombinedIcon className="size-6" />
                    <span className="text-lg font-medium">统计概览</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CirclePercentIcon className="size-6" />
                    <span className="text-lg font-medium">变化百分比</span>
                  </div>
                </div>

                <ChartContainer config={salesChartConfig} className="h-8 w-full">
                  <BarChart
                    accessibilityLayer
                    data={salesChartData}
                    margin={{
                      left: 0,
                      right: 0
                    }}
                    maxBarSize={16}
                  >
                    <Bar
                      dataKey="sales"
                      fill="var(--primary)"
                      background={{ fill: 'color-mix(in oklab, var(--primary) 10%, transparent)', radius: 12 }}
                      radius={12}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default RevenueChart
