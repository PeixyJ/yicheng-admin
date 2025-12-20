import { ShoppingCart, CheckCircle, Clock, DollarSign } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PaymentStatisticsVO } from '@/types/payment-order'

interface StatisticsCardsProps {
  statistics: PaymentStatisticsVO | null
  loading: boolean
}

export function StatisticsCards({ statistics, loading }: StatisticsCardsProps) {
  const cards = [
    {
      title: '订单总数',
      value: statistics?.totalOrders.toLocaleString() ?? '0',
      subValue: `今日 ${statistics?.todayOrders.toLocaleString() ?? '0'}`,
      icon: ShoppingCart,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: '已支付订单',
      value: statistics?.paidOrders.toLocaleString() ?? '0',
      subValue: `今日 ${statistics?.todayPaidOrders.toLocaleString() ?? '0'}`,
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: '待支付订单',
      value: statistics?.pendingOrders.toLocaleString() ?? '0',
      subValue: `失败 ${statistics?.failedOrders.toLocaleString() ?? '0'}`,
      icon: Clock,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: '总实收金额',
      value: statistics?.totalAmountPaidFormatted ?? '$0.00',
      subValue: `今日 ${statistics?.todayAmountFormatted ?? '$0.00'}`,
      icon: DollarSign,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className='h-7 w-24 mb-1' />
                <Skeleton className='h-4 w-16' />
              </>
            ) : (
              <>
                <div className='text-2xl font-bold'>{card.value}</div>
                <p className='text-xs text-muted-foreground'>{card.subValue}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
