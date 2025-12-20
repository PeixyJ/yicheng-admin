import { Coins, TrendingDown, TrendingUp, Users } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PointStatisticsVO } from '@/types/point'

interface StatisticsCardsProps {
  statistics: PointStatisticsVO | null
  loading: boolean
}

export function StatisticsCards({ statistics, loading }: StatisticsCardsProps) {
  if (loading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-8 w-24' />
                  <Skeleton className='h-3 w-16' />
                </div>
                <Skeleton className='h-12 w-12 rounded-full' />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: '总团队数',
      value: statistics?.totalTeams ?? 0,
      subValue: `${statistics?.teamsWithPoints ?? 0} 有点数`,
      icon: Users,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
    },
    {
      title: '可用点数',
      value: statistics?.totalAvailablePoints ?? 0,
      subValue: `${(statistics?.totalFrozenPoints ?? 0).toLocaleString()} 冻结中`,
      icon: Coins,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
    },
    {
      title: '今日发放',
      value: statistics?.todayGrantedPoints ?? 0,
      subValue: `本月 ${(statistics?.monthGrantedPoints ?? 0).toLocaleString()}`,
      icon: TrendingUp,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-500/10',
    },
    {
      title: '今日消耗',
      value: statistics?.todayUsedPoints ?? 0,
      subValue: `本月 ${(statistics?.monthUsedPoints ?? 0).toLocaleString()}`,
      icon: TrendingDown,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-500/10',
    },
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>{card.title}</p>
                <p className='mt-1 text-2xl font-bold'>{card.value.toLocaleString()}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{card.subValue}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.iconBg}`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
