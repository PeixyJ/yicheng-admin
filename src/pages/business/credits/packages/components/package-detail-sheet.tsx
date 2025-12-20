import { useState } from 'react'
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Package,
  Pencil,
  Power,
  PowerOff,
  RefreshCw,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  updatePointPackage,
  updatePointPackageStatus,
  updatePointPackageVisible,
  syncPointPackageToStripe,
} from '@/services/point-package'
import type { PointPackageVO, Currency } from '@/types/point-package'

interface PackageDetailSheetProps {
  pkg: PointPackageVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPackageUpdated?: () => void
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

function formatPrice(price: number, currency: Currency): string {
  const amount = price / 100
  return currency === 'CNY' ? `¥${amount.toFixed(2)}` : `$${amount.toFixed(2)}`
}

export function PackageDetailSheet({ pkg, open, onOpenChange, onPackageUpdated }: PackageDetailSheetProps) {
  const [activeTab, setActiveTab] = useState('info')
  const [submitting, setSubmitting] = useState(false)

  // Edit form state
  const [packName, setPackName] = useState('')
  const [points, setPoints] = useState('')
  const [currency, setCurrency] = useState<Currency>('CNY')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [validDays, setValidDays] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [badge, setBadge] = useState('')
  const [purchaseLimit, setPurchaseLimit] = useState('')
  const [minQuantity, setMinQuantity] = useState('')
  const [maxQuantity, setMaxQuantity] = useState('')
  const [description, setDescription] = useState('')
  const [stripePriceId, setStripePriceId] = useState('')
  const [stripeProductId, setStripeProductId] = useState('')

  const initEditForm = () => {
    if (pkg) {
      setPackName(pkg.packName)
      setPoints(String(pkg.points))
      setCurrency(pkg.currency)
      setPrice(String(pkg.price))
      setOriginalPrice(pkg.originalPrice ? String(pkg.originalPrice) : '')
      setValidDays(pkg.validDays ? String(pkg.validDays) : '')
      setSortOrder(String(pkg.sortOrder))
      setBadge(pkg.badge || '')
      setPurchaseLimit(pkg.purchaseLimit ? String(pkg.purchaseLimit) : '')
      setMinQuantity(String(pkg.minQuantity))
      setMaxQuantity(String(pkg.maxQuantity))
      setDescription(pkg.description || '')
      setStripePriceId(pkg.stripePriceId || '')
      setStripeProductId(pkg.stripeProductId || '')
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'edit') {
      initEditForm()
    }
  }

  const handleUpdate = async () => {
    if (!pkg?.id || !packName.trim() || !points || !price) return

    setSubmitting(true)
    try {
      const response = await updatePointPackage(pkg.id, {
        packName: packName.trim(),
        points: Number(points),
        currency,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        validDays: validDays ? Number(validDays) : undefined,
        sortOrder: sortOrder ? Number(sortOrder) : undefined,
        badge: badge.trim() || undefined,
        purchaseLimit: purchaseLimit ? Number(purchaseLimit) : undefined,
        minQuantity: minQuantity ? Number(minQuantity) : undefined,
        maxQuantity: maxQuantity ? Number(maxQuantity) : undefined,
        description: description.trim() || undefined,
        stripePriceId: stripePriceId.trim() || undefined,
        stripeProductId: stripeProductId.trim() || undefined,
      })
      if (response.code === 'success') {
        setActiveTab('info')
        onPackageUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (status: boolean) => {
    if (!pkg?.id) return
    setSubmitting(true)
    try {
      const response = await updatePointPackageStatus(pkg.id, status)
      if (response.code === 'success') {
        onPackageUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleVisibleChange = async (visible: boolean) => {
    if (!pkg?.id) return
    setSubmitting(true)
    try {
      const response = await updatePointPackageVisible(pkg.id, visible)
      if (response.code === 'success') {
        onPackageUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const handleSyncStripe = async () => {
    if (!pkg?.id) return
    setSubmitting(true)
    try {
      const response = await syncPointPackageToStripe(pkg.id)
      if (response.code === 'success') {
        onPackageUpdated?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  if (!pkg) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full max-w-2xl overflow-y-auto p-0 sm:max-w-2xl'>
        <SheetHeader className='border-b px-6 py-4'>
          <SheetTitle>套餐详情</SheetTitle>
        </SheetHeader>

        {/* Package Header */}
        <div className='border-b bg-muted/30 px-6 py-6'>
          <div className='flex items-start gap-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10'>
              <Package className='h-8 w-8 text-primary' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-3'>
                <h3 className='text-xl font-semibold tracking-tight'>{pkg.packName}</h3>
                {pkg.badge && <Badge variant='secondary'>{pkg.badge}</Badge>}
                <Badge variant={pkg.status ? 'default' : 'secondary'}>
                  {pkg.status ? '已上架' : '已下架'}
                </Badge>
                <Badge variant={pkg.visible ? 'default' : 'outline'}>
                  {pkg.visible ? '可见' : '隐藏'}
                </Badge>
              </div>
              <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                <code className='rounded bg-muted px-1.5 py-0.5'>{pkg.packCode}</code>
                <CopyButton text={pkg.packCode} />
              </div>
              {pkg.description && (
                <p className='mt-2 text-sm text-muted-foreground'>{pkg.description}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='mt-5 flex flex-wrap gap-3'>
            {pkg.status ? (
              <Button
                variant='outline'
                onClick={() => handleStatusChange(false)}
                disabled={submitting}
              >
                <PowerOff className='mr-2 h-4 w-4' />
                下架
              </Button>
            ) : (
              <Button
                variant='outline'
                onClick={() => handleStatusChange(true)}
                disabled={submitting}
              >
                <Power className='mr-2 h-4 w-4' />
                上架
              </Button>
            )}
            {pkg.visible ? (
              <Button
                variant='outline'
                onClick={() => handleVisibleChange(false)}
                disabled={submitting}
              >
                <EyeOff className='mr-2 h-4 w-4' />
                隐藏
              </Button>
            ) : (
              <Button
                variant='outline'
                onClick={() => handleVisibleChange(true)}
                disabled={submitting}
              >
                <Eye className='mr-2 h-4 w-4' />
                显示
              </Button>
            )}
            <Button
              variant='outline'
              onClick={handleSyncStripe}
              disabled={submitting}
            >
              <RefreshCw className='mr-2 h-4 w-4' />
              同步到 Stripe
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
          <TabsList className='w-full justify-start rounded-none border-b bg-transparent px-6'>
            <TabsTrigger value='info' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
              基本信息
            </TabsTrigger>
            <TabsTrigger value='edit' className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary'>
              <Pencil className='mr-1.5 h-3.5 w-3.5' />
              编辑信息
            </TabsTrigger>
          </TabsList>

          {/* Info Tab */}
          <TabsContent value='info' className='mt-0 p-6'>
            <div className='grid gap-6'>
              <div>
                <h4 className='mb-4 text-sm font-semibold'>价格信息</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <InfoCard label='售价' value={formatPrice(pkg.price, pkg.currency)} />
                  <InfoCard label='原价' value={pkg.originalPrice ? formatPrice(pkg.originalPrice, pkg.currency) : '-'} />
                  <InfoCard label='货币类型' value={pkg.currency === 'CNY' ? '人民币' : '美元'} />
                </div>
              </div>

              <div>
                <h4 className='mb-4 text-sm font-semibold'>点数信息</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <InfoCard label='点数数量' value={pkg.points.toLocaleString()} />
                  <InfoCard label='有效天数' value={pkg.validDays ? `${pkg.validDays} 天` : '永久'} />
                  <InfoCard label='排序序号' value={pkg.sortOrder} />
                </div>
              </div>

              <div>
                <h4 className='mb-4 text-sm font-semibold'>购买限制</h4>
                <div className='grid grid-cols-3 gap-4'>
                  <InfoCard label='限购次数' value={pkg.purchaseLimit ?? '不限购'} />
                  <InfoCard label='最小购买数量' value={pkg.minQuantity} />
                  <InfoCard label='最大购买数量' value={pkg.maxQuantity} />
                </div>
              </div>

              <div>
                <h4 className='mb-4 text-sm font-semibold'>Stripe 信息</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <InfoCard label='Stripe Price ID' value={pkg.stripePriceId} />
                  <InfoCard label='Stripe Product ID' value={pkg.stripeProductId} />
                </div>
              </div>

              {pkg.metadata && (
                <div>
                  <h4 className='mb-4 text-sm font-semibold'>扩展数据</h4>
                  <div className='rounded-lg border bg-muted/50 p-4'>
                    <pre className='text-sm whitespace-pre-wrap break-all'>{pkg.metadata}</pre>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value='edit' className='mt-0 p-6'>
            <div className='grid gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>套餐名称 <span className='text-destructive'>*</span></Label>
                  <Input
                    className='mt-1.5'
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label>角标文案</Label>
                  <Input
                    className='mt-1.5'
                    placeholder='如：热销'
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    maxLength={50}
                  />
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <Label>点数数量 <span className='text-destructive'>*</span></Label>
                  <Input
                    className='mt-1.5'
                    type='number'
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    min={1}
                  />
                </div>
                <div>
                  <Label>货币类型 <span className='text-destructive'>*</span></Label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                    <SelectTrigger className='mt-1.5'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='CNY'>人民币 (CNY)</SelectItem>
                      <SelectItem value='USD'>美元 (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>售价 <span className='text-destructive'>*</span></Label>
                  <Input
                    className='mt-1.5'
                    type='number'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min={1}
                  />
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <Label>原价（划线价）</Label>
                  <Input
                    className='mt-1.5'
                    type='number'
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    min={1}
                  />
                </div>
                <div>
                  <Label>有效天数</Label>
                  <Input
                    className='mt-1.5'
                    type='number'
                    placeholder='留空表示永久'
                    value={validDays}
                    onChange={(e) => setValidDays(e.target.value)}
                    min={1}
                  />
                </div>
                <div>
                  <Label>排序序号</Label>
                  <Input
                    className='mt-1.5'
                    type='number'
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    min={0}
                  />
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <Label>限购次数</Label>
                  <Input
                    className='mt-1.5'
                    type='number'
                    placeholder='不限购'
                    value={purchaseLimit}
                    onChange={(e) => setPurchaseLimit(e.target.value)}
                    min={1}
                  />
                </div>
                <div>
                  <Label>最小购买数量</Label>
                  <Input
                    className='mt-1.5'
                    type='number'
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(e.target.value)}
                    min={1}
                  />
                </div>
                <div>
                  <Label>最大购买数量</Label>
                  <Input
                    className='mt-1.5'
                    type='number'
                    value={maxQuantity}
                    onChange={(e) => setMaxQuantity(e.target.value)}
                    min={1}
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Stripe Price ID</Label>
                  <Input
                    className='mt-1.5'
                    placeholder='price_xxx'
                    value={stripePriceId}
                    onChange={(e) => setStripePriceId(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Stripe Product ID</Label>
                  <Input
                    className='mt-1.5'
                    placeholder='prod_xxx'
                    value={stripeProductId}
                    onChange={(e) => setStripeProductId(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>套餐描述</Label>
                <Textarea
                  className='mt-1.5'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
              </div>

              <div className='flex justify-end gap-3 pt-4'>
                <Button variant='outline' onClick={() => setActiveTab('info')}>
                  取消
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={!packName.trim() || !points || !price || submitting}
                >
                  保存修改
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
