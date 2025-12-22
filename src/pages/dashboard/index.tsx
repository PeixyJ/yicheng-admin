import { useEffect, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import {
  Users,
  UserPlus,
  Building2,
  Zap,
  RefreshCw,
  TrendingUp,
  Coins,
  Clock,
  Lock,
  CreditCard
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

import { getDashboardStatistics } from '@/services/dashboard'
import type { DashboardStatisticsVO } from '@/types/dashboard'

import { DashboardSkeleton } from './components/dashboard-skeleton'

const Dashboard = () => {
  const [data, setData] = useState<DashboardStatisticsVO | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true)
      const response = await getDashboardStatistics()
      setData(response.data)
      if (showRefreshToast) {
        toast.success('数据已刷新')
      }
    } catch (error) {
      toast.error('获取数据失败')
      console.error(error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => {
    fetchData(true)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">加载数据失败</p>
          <Button onClick={() => fetchData()}>重试</Button>
        </div>
      </div>
    )
  }

  const { user, team, payment, point } = data

  // 用户状态数据
  const userStatusData = [
    { name: '正常用户', value: user.activeUsers, color: 'bg-emerald-500' },
    { name: '待激活', value: user.pendingUsers, color: 'bg-amber-500' },
    { name: '已封禁', value: user.suspendedUsers, color: 'bg-rose-500' },
    { name: '已注销', value: user.deletedUsers, color: 'bg-gray-400' }
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-hidden">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">仪表板</h1>
          <p className="text-sm text-muted-foreground">最后更新: {data.lastUpdateTime}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </motion.div>

      {/* 核心指标 - 4列 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Users className="size-4" />}
          title="用户总数"
          value={user.totalUsers.toLocaleString()}
          subValue={user.todayNewUsers > 0 ? `今日 +${user.todayNewUsers}` : undefined}
          colorClass="text-blue-500 bg-blue-500/10"
          delay={0}
        />
        <StatCard
          icon={<Building2 className="size-4" />}
          title="团队总数"
          value={team.totalTeams.toLocaleString()}
          subValue={`${team.activeTeams} 活跃`}
          colorClass="text-emerald-500 bg-emerald-500/10"
          delay={1}
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          title="MRR"
          value={team.mrrFormatted}
          subValue={`${team.activeSubscriptions} 订阅`}
          colorClass="text-purple-500 bg-purple-500/10"
          delay={2}
        />
        <StatCard
          icon={<Zap className="size-4" />}
          title="总收入"
          value={payment.totalRevenueFormatted}
          subValue={`今日 ${payment.todayRevenueFormatted}`}
          colorClass="text-amber-500 bg-amber-500/10"
          delay={3}
        />
      </div>

      {/* 第二行 - 用户状态 + 订阅分布 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 用户状态分布 */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                用户状态分布
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 堆叠进度条 */}
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                {userStatusData.map((item) => {
                  const percentage = user.totalUsers > 0 ? (item.value / user.totalUsers) * 100 : 0
                  return (
                    <div
                      key={item.name}
                      className={`h-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  )
                })}
              </div>
              {/* 图例 */}
              <div className="grid grid-cols-2 gap-2">
                {userStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-lg px-3 py-2 bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 订阅计划分布 */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                订阅计划分布
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {team.planDistribution.length > 0 ? (
                team.planDistribution.map((plan) => (
                  <div key={plan.planId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{plan.planName}</span>
                      <span className="text-muted-foreground">
                        {plan.subscriptionCount} 订阅 ({plan.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={plan.percentage}
                      className="h-2"
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">暂无数据</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 第三行 - 支付统计 + 支付渠道 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 支付统计 */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                订单统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">订单总数</p>
                  <p className="text-xl font-semibold">{payment.totalOrders.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">今日订单</p>
                  <p className="text-xl font-semibold">{payment.todayOrders.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">今日交易额</p>
                  <p className="text-xl font-semibold">{payment.todayRevenueFormatted}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">支付成功率</p>
                  <p className="text-xl font-semibold">{payment.successRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 支付渠道分布 */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                支付渠道分布
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payment.channelDistribution.length > 0 ? (
                payment.channelDistribution.map((channel) => (
                  <div key={channel.channel} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{channel.channelName}</span>
                      <span className="text-muted-foreground">
                        {channel.orderCount} 笔 ({channel.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={channel.percentage} className="h-2" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">暂无数据</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 第四行 - 点数概览 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              点数概览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <PointStatItem
                icon={<Coins className="h-4 w-4 text-emerald-500" />}
                label="总可用点数"
                value={point.totalAvailable}
                bgColor="bg-emerald-500/10"
              />
              <PointStatItem
                icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
                label="今日消费"
                value={point.todayConsumption}
                bgColor="bg-blue-500/10"
              />
              <PointStatItem
                icon={<Clock className="h-4 w-4 text-amber-500" />}
                label="7日内过期"
                value={point.expiringIn7Days}
                bgColor="bg-amber-500/10"
              />
              <PointStatItem
                icon={<Lock className="h-4 w-4 text-gray-500" />}
                label="冻结点数"
                value={point.totalFrozen}
                bgColor="bg-gray-500/10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// 统计卡片组件
interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subValue?: string
  colorClass: string
  delay: number
}

function StatCard({ icon, title, value, subValue, colorClass, delay }: StatCardProps) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <Card className="h-full transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`shrink-0 rounded-lg p-2 ${colorClass}`}>
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground truncate">{title}</p>
              <p className="text-xl font-bold truncate">{value}</p>
              <p className="text-xs text-muted-foreground truncate h-4">
                {subValue || '\u00A0'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// 点数统计项组件
interface PointStatItemProps {
  icon: React.ReactNode
  label: string
  value: number
  bgColor: string
}

function PointStatItem({ icon, label, value, bgColor }: PointStatItemProps) {
  return (
    <div className="h-full rounded-lg border p-3 transition-all hover:shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`shrink-0 rounded-lg p-1.5 ${bgColor}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className="text-lg font-semibold">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
