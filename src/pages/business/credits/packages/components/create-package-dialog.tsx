import { useState } from 'react'
import { Plus, Package } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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

import { createPointPackage } from '@/services/point-package'
import type { Currency } from '@/types/point-package'

interface CreatePackageDialogProps {
  onSuccess?: () => void
}

export function CreatePackageDialog({ onSuccess }: CreatePackageDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [packCode, setPackCode] = useState('')
  const [packName, setPackName] = useState('')
  const [points, setPoints] = useState('')
  const [currency, setCurrency] = useState<Currency>('CNY')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [validDays, setValidDays] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [badge, setBadge] = useState('')
  const [purchaseLimit, setPurchaseLimit] = useState('')
  const [minQuantity, setMinQuantity] = useState('1')
  const [maxQuantity, setMaxQuantity] = useState('1')
  const [description, setDescription] = useState('')

  const resetForm = () => {
    setPackCode('')
    setPackName('')
    setPoints('')
    setCurrency('CNY')
    setPrice('')
    setOriginalPrice('')
    setValidDays('')
    setSortOrder('0')
    setBadge('')
    setPurchaseLimit('')
    setMinQuantity('1')
    setMaxQuantity('1')
    setDescription('')
  }

  const handleSubmit = async () => {
    if (!packCode.trim() || !packName.trim() || !points || !price) return

    setSubmitting(true)
    try {
      const response = await createPointPackage({
        packCode: packCode.trim().toUpperCase(),
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
      })
      if (response.code === 'success') {
        setOpen(false)
        resetForm()
        onSuccess?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const isValid = packCode.trim() && packName.trim() && points && price

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          创建套餐
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto' onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <Package className='h-5 w-5 text-primary' />
            </div>
            创建点数套餐
          </DialogTitle>
          <DialogDescription>创建一个新的点数套餐</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>套餐编码 <span className='text-destructive'>*</span></Label>
              <Input
                className='mt-1.5'
                placeholder='如：PACK_STARTER'
                value={packCode}
                onChange={(e) => setPackCode(e.target.value.toUpperCase())}
                maxLength={50}
              />
              <p className='mt-1 text-xs text-muted-foreground'>大写字母开头，只含大写字母/数字/下划线</p>
            </div>
            <div>
              <Label>套餐名称 <span className='text-destructive'>*</span></Label>
              <Input
                className='mt-1.5'
                placeholder='如：入门套餐'
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                maxLength={100}
              />
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <Label>点数数量 <span className='text-destructive'>*</span></Label>
              <Input
                className='mt-1.5'
                type='number'
                placeholder='如：1000'
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
                placeholder='最小单位（分/美分）'
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
                placeholder='可选'
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
                placeholder='数值越小越靠前'
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                min={0}
              />
            </div>
          </div>

          <div className='grid grid-cols-4 gap-4'>
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

          <div>
            <Label>套餐描述</Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入套餐描述（可选）'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
          >
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
