import { useState, useEffect } from 'react'
import {
  Calendar,
  Check,
  Copy,
  Package,
  Star,
  Users,
} from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/pagination'
import {
  getPlanDetail,
  getPlanFeatures,
  getPlanSubscribes,
  switchPlanFeatureStatus,
} from '@/services/plan'
import type {
  SubscribePlanVO,
  FeatureVO,
  SubscribeVO,
  PlanType,
  SubscribeStatus,
  SubscribeSource,
} from '@/types/plan'

interface PlanDetailSheetProps {
  planId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlanUpdated?: () => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-6 text-muted-foreground hover:text-foreground'
      onClick={handleCopy}
    >
      {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
    </Button>
  )
}

function InfoCard({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className='rounded-lg border bg-card p-4'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className='mt-1 text-sm font-medium'>{value ?? '-'}</p>
    </div>
  )
}

function getPlanTypeBadge(type: PlanType) {
  switch (type) {
    case 'FREE':
      return <Badge variant='secondary'>免费版</Badge>
    case 'TRIAL':
      return <Badge variant='outline'>试用版</Badge>
    case 'PAID':
      return <Badge variant='default'>付费版</Badge>
    default:
      return <Badge variant='secondary'>{type}</Badge>
  }
}

function getSubscribeStatusBadge(status: SubscribeStatus) {
  switch (status) {
    case 'PENDING':
      return <Badge variant='secondary'>待生效</Badge>
    case 'ACTIVE':
      return <Badge variant='default'>生效中</Badge>
    case 'EXPIRED':
      return <Badge variant='outline'>已过期</Badge>
    case 'CANCELLED':
      return <Badge variant='destructive'>已取消</Badge>
    case 'UPGRADED':
      return <Badge variant='secondary'>已升级</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

function getSubscribeSourceBadge(source: SubscribeSource) {
  switch (source) {
    case 'PURCHASE':
      return <Badge variant='outline'>购买</Badge>
    case 'GRANT':
      return <Badge variant='secondary'>赠送</Badge>
    case 'SYSTEM':
      return <Badge variant='default'>系统</Badge>
    default:
      return <Badge variant='secondary'>{source}</Badge>
  }
}

function formatPrice(price: number, currency: string) {
  if (currency === 'CNY') {
    return `¥${price.toFixed(2)}`
  } else if (currency === 'USD') {
    return `$${price.toFixed(2)}`
  }
  return `${price.toFixed(2)} ${currency}`
}

export function PlanDetailSheet({ planId, open, onOpenChange, onPlanUpdated }: PlanDetailSheetProps) {
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<SubscribePlanVO | null>(null)
  const [activeTab, setActiveTab] = useState('info')

  // 功能列表
  const [features, setFeatures] = useState<FeatureVO[]>([])
  const [featuresTotal, setFeaturesTotal] = useState(0)
  const [featuresPage, setFeaturesPage] = useState(1)
  const [featuresPageSize, setFeaturesPageSize] = useState(10)
  const [featuresLoading, setFeaturesLoading] = useState(false)

  // 订阅列表
  const [subscribes, setSubscribes] = useState<SubscribeVO[]>([])
  const [subscribesTotal, setSubscribesTotal] = useState(0)
  const [subscribesPage, setSubscribesPage] = useState(1)
  const [subscribesPageSize, setSubscribesPageSize] = useState(10)
  const [subscribesLoading, setSubscribesLoading] = useState(false)

  useEffect(() => {
    if (open && planId) {
      loadPlanDetail()
    }
  }, [open, planId])

  useEffect(() => {
    if (open && planId && activeTab === 'features') {
      loadFeatures()
    } else if (open && planId && activeTab === 'subscribes') {
      loadSubscribes()
    }
  }, [activeTab, open, planId, featuresPage, featuresPageSize, subscribesPage, subscribesPageSize])

  const loadPlanDetail = async () => {
    if (!planId) return
    setLoading(true)
    try {
      const response = await getPlanDetail(planId)
      if (response.code === 'success') {
        setPlan(response.data)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const loadFeatures = async () => {
    if (!planId) return
    setFeaturesLoading(true)
    try {
      const response = await getPlanFeatures(planId, {
        page: featuresPage,
        size: featuresPageSize,
      })
      if (response.code === 'success') {
        setFeatures(response.data.records)
        setFeaturesTotal(response.data.total)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setFeaturesLoading(false)
    }
  }

  const loadSubscribes = async () => {
    if (!planId) return
    setSubscribesLoading(true)
    try {
      const response = await getPlanSubscribes(planId, {
        page: subscribesPage,
        size: subscribesPageSize,
      })
      if (response.code === 'success') {
        setSubscribes(response.data.records)
        setSubscribesTotal(response.data.total)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubscribesLoading(false)
    }
  }

  const handleFeatureStatusChange = async (featureId: number, enable: boolean) => {
    if (!planId) return
    try {
      const response = await switchPlanFeatureStatus(planId, featureId, enable)
      if (response.code === 'success') {
        setFeatures((prev) =>
          prev.map((f) => (f.id === featureId ? { ...f, status: enable } : f))
        )
        onPlanUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    }
  }

  const handleFeaturesPageChange = (page: number, pageSize: number) => {
    setFeaturesPage(page)
    setFeaturesPageSize(pageSize)
  }

  const handleSubscribesPageChange = (page: number, pageSize: number) => {
    setSubscribesPage(page)
    setSubscribesPageSize(pageSize)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full max-w-3xl overflow-y-auto p-0 sm:max-w-3xl'>
        <SheetHeader className='border-b px-6 py-4'>
          <SheetTitle>计划详情</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className='p-6 space-y-6'>
            <div className='flex items-start gap-5'>
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-48' />
                <Skeleton className='h-4 w-64' />
              </div>
            </div>
          </div>
        ) : plan ? (
          <>
            {/* Plan Header */}
            <div className='border-b bg-muted/30 px-6 py-6'>
              <div className='flex items-start gap-5'>
                <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10'>
                  <Package className='h-8 w-8 text-primary' />
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-3'>
                    <h3 className='text-xl font-semibold tracking-tight'>{plan.planName}</h3>
                    {getPlanTypeBadge(plan.planType)}
                    {plan.isDefault && (
                      <Badge variant='default'>
                        <Star className='mr-1 size-3' />
                        默认
                      </Badge>
                    )}
                    <Badge variant={plan.status ? 'default' : 'secondary'}>
                      {plan.status ? '启用' : '禁用'}
                    </Badge>
                  </div>
                  <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                    <span>ID: {plan.id}</span>
                    <CopyButton text={String(plan.id)} />
                    <span>·</span>
                    <code className='rounded bg-muted px-1.5 py-0.5 text-xs'>{plan.planCode}</code>
                    <CopyButton text={plan.planCode} />
                  </div>
                  {plan.description && (
                    <p className='mt-2 text-sm text-muted-foreground'>{plan.description}</p>
                  )}
                </div>
              </div>

              {/* Price Display */}
              <div className='mt-5 flex items-baseline gap-2'>
                <span className='text-3xl font-bold'>{formatPrice(plan.price, plan.currency)}</span>
                {plan.originalPrice && plan.originalPrice > plan.price && (
                  <span className='text-lg text-muted-foreground line-through'>
                    {formatPrice(plan.originalPrice, plan.currency)}
                  </span>
                )}
                <span className='text-muted-foreground'>
                  / {plan.durationDays ? `${plan.durationDays}天` : '永久'}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
              <TabsList className='w-full justify-start rounded-none border-b bg-transparent px-6'>
                <TabsTrigger value='info' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                  基本信息
                </TabsTrigger>
                <TabsTrigger value='features' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                  关联功能
                </TabsTrigger>
                <TabsTrigger value='subscribes' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
                  订阅记录
                </TabsTrigger>
              </TabsList>

              {/* Info Tab */}
              <TabsContent value='info' className='mt-0 p-6'>
                <div className='grid gap-6'>
                  <div>
                    <h4 className='mb-4 text-sm font-semibold'>配额信息</h4>
                    <div className='grid grid-cols-3 gap-4'>
                      <InfoCard label='每日配额' value={plan.dailyQuota?.toLocaleString() ?? '不限制'} />
                      <InfoCard label='每月配额' value={plan.monthlyQuota?.toLocaleString() ?? '不限制'} />
                      <InfoCard label='计划等级' value={`Lv.${plan.planLevel}`} />
                    </div>
                  </div>

                  <div>
                    <h4 className='mb-4 text-sm font-semibold'>席位配置</h4>
                    <div className='grid grid-cols-4 gap-4'>
                      <InfoCard label='最小席位' value={plan.minSeats ?? '不限制'} />
                      <InfoCard label='最大席位' value={plan.maxSeats ?? '不限制'} />
                      <InfoCard
                        label='席位月付价'
                        value={plan.seatPrice ? formatPrice(plan.seatPrice, plan.currency) : '-'}
                      />
                      <InfoCard
                        label='席位年付价'
                        value={plan.seatPriceYearly ? formatPrice(plan.seatPriceYearly, plan.currency) : '-'}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className='mb-4 text-sm font-semibold'>限制配置</h4>
                    <div className='grid grid-cols-2 gap-4'>
                      <InfoCard label='最大购买次数' value={plan.maxPurchaseCount ?? '不限制'} />
                      <InfoCard label='最大赠送次数' value={plan.maxGrantCount ?? '不限制'} />
                    </div>
                  </div>

                  <div>
                    <h4 className='mb-4 text-sm font-semibold'>显示设置</h4>
                    <div className='grid grid-cols-3 gap-4'>
                      <InfoCard label='排序序号' value={plan.sortOrder} />
                      <InfoCard label='试用计划' value={plan.isTrial ? '是' : '否'} />
                      <InfoCard label='定价页可见' value={plan.isVisible ? '是' : '否'} />
                    </div>
                  </div>

                  {plan.resourceLimits && (
                    <div>
                      <h4 className='mb-4 text-sm font-semibold'>资源限制</h4>
                      <div className='rounded-lg border bg-muted/50 p-4'>
                        <pre className='text-sm text-muted-foreground whitespace-pre-wrap'>
                          {plan.resourceLimits}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value='features' className='mt-0 p-6'>
                <div className='space-y-4'>
                  <div className='rounded-lg border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>功能名称</TableHead>
                          <TableHead>功能编码</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>消耗点数</TableHead>
                          <TableHead>排序</TableHead>
                          <TableHead>状态</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {featuresLoading ? (
                          Array.from({ length: 3 }).map((_, index) => (
                            <TableRow key={index}>
                              <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                              <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                              <TableCell><Skeleton className='h-5 w-14' /></TableCell>
                              <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                              <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                              <TableCell><Skeleton className='h-5 w-10' /></TableCell>
                            </TableRow>
                          ))
                        ) : features.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                              暂无关联功能
                            </TableCell>
                          </TableRow>
                        ) : (
                          features.map((feature) => (
                            <TableRow key={feature.id}>
                              <TableCell className='font-medium'>{feature.featureName}</TableCell>
                              <TableCell>
                                <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                                  {feature.featureCode}
                                </code>
                              </TableCell>
                              <TableCell>
                                <Badge variant={feature.featureType === 'BOOLEAN' ? 'outline' : 'secondary'}>
                                  {feature.featureTypeName}
                                </Badge>
                              </TableCell>
                              <TableCell>{feature.pointsCost ?? '-'}</TableCell>
                              <TableCell>{feature.sortOrder}</TableCell>
                              <TableCell>
                                <Switch
                                  checked={feature.status}
                                  onCheckedChange={(checked) => handleFeatureStatusChange(feature.id, checked)}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {featuresTotal > 0 && (
                    <Pagination
                      current={featuresPage}
                      total={featuresTotal}
                      pageSize={featuresPageSize}
                      onChange={handleFeaturesPageChange}
                    />
                  )}
                </div>
              </TabsContent>

              {/* Subscribes Tab */}
              <TabsContent value='subscribes' className='mt-0 p-6'>
                <div className='space-y-4'>
                  <div className='rounded-lg border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>订阅ID</TableHead>
                          <TableHead>团队ID</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>来源</TableHead>
                          <TableHead>席位</TableHead>
                          <TableHead>开始时间</TableHead>
                          <TableHead>结束时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribesLoading ? (
                          Array.from({ length: 3 }).map((_, index) => (
                            <TableRow key={index}>
                              <TableCell><Skeleton className='h-4 w-12' /></TableCell>
                              <TableCell><Skeleton className='h-4 w-12' /></TableCell>
                              <TableCell><Skeleton className='h-5 w-14' /></TableCell>
                              <TableCell><Skeleton className='h-5 w-12' /></TableCell>
                              <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                              <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                              <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                            </TableRow>
                          ))
                        ) : subscribes.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                              暂无订阅记录
                            </TableCell>
                          </TableRow>
                        ) : (
                          subscribes.map((subscribe) => (
                            <TableRow key={subscribe.id}>
                              <TableCell className='font-medium'>{subscribe.id}</TableCell>
                              <TableCell>
                                <div className='flex items-center gap-1'>
                                  <Users className='size-4 text-muted-foreground' />
                                  {subscribe.teamId}
                                </div>
                              </TableCell>
                              <TableCell>{getSubscribeStatusBadge(subscribe.status)}</TableCell>
                              <TableCell>{getSubscribeSourceBadge(subscribe.source)}</TableCell>
                              <TableCell>{subscribe.seats}</TableCell>
                              <TableCell>
                                <div className='flex items-center gap-1 text-sm'>
                                  <Calendar className='size-3.5 text-muted-foreground' />
                                  {subscribe.startTime}
                                </div>
                              </TableCell>
                              <TableCell>
                                {subscribe.endTime ? (
                                  <div className='flex items-center gap-1 text-sm'>
                                    <Calendar className='size-3.5 text-muted-foreground' />
                                    {subscribe.endTime}
                                  </div>
                                ) : (
                                  <span className='text-muted-foreground'>永久</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {subscribesTotal > 0 && (
                    <Pagination
                      current={subscribesPage}
                      total={subscribesTotal}
                      pageSize={subscribesPageSize}
                      onChange={handleSubscribesPageChange}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
