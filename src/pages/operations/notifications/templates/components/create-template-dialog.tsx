import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createTemplate } from '@/services/notification-template'
import type {
  NotificationParentType,
  NotificationParam,
  NotificationButton,
  NotificationButtonType,
} from '@/types/notification-template'

interface CreateTemplateDialogProps {
  onSuccess?: () => void
}

export function CreateTemplateDialog({ onSuccess }: CreateTemplateDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [parentType, setParentType] = useState<NotificationParentType>('INBOX')
  const [titleTemplate, setTitleTemplate] = useState('')
  const [contentTemplate, setContentTemplate] = useState('')
  const [expireDays, setExpireDays] = useState('30')
  const [status, setStatus] = useState(true)
  const [params, setParams] = useState<NotificationParam[]>([])
  const [buttons, setButtons] = useState<NotificationButton[]>([])

  const resetForm = () => {
    setCode('')
    setName('')
    setParentType('INBOX')
    setTitleTemplate('')
    setContentTemplate('')
    setExpireDays('30')
    setStatus(true)
    setParams([])
    setButtons([])
  }

  const handleSubmit = async () => {
    if (!code.trim() || !name.trim() || !titleTemplate.trim() || !contentTemplate.trim()) {
      return
    }

    setSubmitting(true)
    try {
      const response = await createTemplate({
        code: code.trim(),
        name: name.trim(),
        parentType,
        titleTemplate: titleTemplate.trim(),
        contentTemplate: contentTemplate.trim(),
        expireDays: Number(expireDays) || 30,
        status,
        params: params.length > 0 ? params : undefined,
        buttons: buttons.length > 0 ? buttons : undefined,
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

  const addParam = () => {
    setParams([...params, { name: '', type: 'string', required: false }])
  }

  const updateParam = (index: number, field: keyof NotificationParam, value: string | boolean) => {
    const newParams = [...params]
    newParams[index] = { ...newParams[index], [field]: value }
    setParams(newParams)
  }

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index))
  }

  const addButton = () => {
    setButtons([...buttons, { type: 'REDIRECT', label: '', action: '' }])
  }

  const updateButton = (index: number, field: keyof NotificationButton, value: string) => {
    const newButtons = [...buttons]
    newButtons[index] = { ...newButtons[index], [field]: value }
    setButtons(newButtons)
  }

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index))
  }

  const isValid = code.trim() && name.trim() && titleTemplate.trim() && contentTemplate.trim()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 size-4' />
          创建模板
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto' onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>创建通知模板</DialogTitle>
          <DialogDescription>创建新的通知模板，模板编码创建后不可修改</DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* 基本信息 */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>
                模板编码 <span className='text-destructive'>*</span>
              </Label>
              <Input
                className='mt-1.5'
                placeholder='如: ORDER_CREATED'
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
              <p className='mt-1 text-xs text-muted-foreground'>
                格式: 大写字母开头，仅含大写字母、数字、下划线
              </p>
            </div>
            <div>
              <Label>
                模板名称 <span className='text-destructive'>*</span>
              </Label>
              <Input
                className='mt-1.5'
                placeholder='请输入模板名称'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <Label>
                通知分类 <span className='text-destructive'>*</span>
              </Label>
              <Select value={parentType} onValueChange={(v) => setParentType(v as NotificationParentType)}>
                <SelectTrigger className='mt-1.5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='INBOX'>收件箱</SelectItem>
                  <SelectItem value='SYSTEM'>系统</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>过期天数</Label>
              <Input
                type='number'
                className='mt-1.5'
                placeholder='30'
                value={expireDays}
                onChange={(e) => setExpireDays(e.target.value)}
              />
              <p className='mt-1 text-xs text-muted-foreground'>0 表示永不过期</p>
            </div>
            <div>
              <Label>状态</Label>
              <div className='mt-3 flex items-center gap-2'>
                <Switch checked={status} onCheckedChange={setStatus} />
                <span className='text-sm'>{status ? '启用' : '禁用'}</span>
              </div>
            </div>
          </div>

          {/* 模板内容 */}
          <div>
            <Label>
              标题模板 <span className='text-destructive'>*</span>
            </Label>
            <Textarea
              className='mt-1.5 font-mono text-sm'
              placeholder='使用 FreeMarker 语法，如: 您的订单 ${orderNo} 已创建'
              value={titleTemplate}
              onChange={(e) => setTitleTemplate(e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label>
              内容模板 <span className='text-destructive'>*</span>
            </Label>
            <Textarea
              className='mt-1.5 font-mono text-sm'
              placeholder='使用 FreeMarker 语法'
              value={contentTemplate}
              onChange={(e) => setContentTemplate(e.target.value)}
              rows={4}
            />
          </div>

          {/* 参数定义 */}
          <div>
            <div className='flex items-center justify-between mb-2'>
              <Label>参数定义</Label>
              <Button type='button' variant='outline' size='sm' onClick={addParam}>
                <Plus className='mr-1 size-3' />
                添加参数
              </Button>
            </div>
            {params.length === 0 ? (
              <p className='text-sm text-muted-foreground'>暂无参数，点击添加</p>
            ) : (
              <div className='space-y-2'>
                {params.map((param, index) => (
                  <div key={index} className='flex items-center gap-2 rounded-lg border p-2'>
                    <Input
                      placeholder='参数名'
                      value={param.name}
                      onChange={(e) => updateParam(index, 'name', e.target.value)}
                      className='flex-1'
                    />
                    <Select
                      value={param.type}
                      onValueChange={(v) => updateParam(index, 'type', v)}
                    >
                      <SelectTrigger className='w-28'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='string'>string</SelectItem>
                        <SelectItem value='number'>number</SelectItem>
                        <SelectItem value='boolean'>boolean</SelectItem>
                        <SelectItem value='date'>date</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className='flex items-center gap-1'>
                      <Checkbox
                        checked={param.required}
                        onCheckedChange={(checked) => updateParam(index, 'required', !!checked)}
                      />
                      <span className='text-xs'>必填</span>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='size-8 text-destructive'
                      onClick={() => removeParam(index)}
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 按钮配置 */}
          <div>
            <div className='flex items-center justify-between mb-2'>
              <Label>按钮配置</Label>
              <Button type='button' variant='outline' size='sm' onClick={addButton}>
                <Plus className='mr-1 size-3' />
                添加按钮
              </Button>
            </div>
            {buttons.length === 0 ? (
              <p className='text-sm text-muted-foreground'>暂无按钮，点击添加</p>
            ) : (
              <div className='space-y-3'>
                {buttons.map((button, index) => (
                  <div key={index} className='rounded-lg border p-3 space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Select
                        value={button.type}
                        onValueChange={(v) => updateButton(index, 'type', v as NotificationButtonType)}
                      >
                        <SelectTrigger className='w-28'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='REDIRECT'>跳转</SelectItem>
                          <SelectItem value='FUNCTION'>功能</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder='按钮标签'
                        value={button.label}
                        onChange={(e) => updateButton(index, 'label', e.target.value)}
                        className='flex-1'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='size-8 text-destructive'
                        onClick={() => removeButton(index)}
                      >
                        <Trash2 className='size-4' />
                      </Button>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <Input
                        placeholder='动作标识'
                        value={button.action}
                        onChange={(e) => updateButton(index, 'action', e.target.value)}
                      />
                      <Input
                        placeholder='样式（可选）'
                        value={button.style || ''}
                        onChange={(e) => updateButton(index, 'style', e.target.value)}
                      />
                    </div>
                    {button.type === 'REDIRECT' && (
                      <Input
                        placeholder='跳转链接'
                        value={button.redirect_url || ''}
                        onChange={(e) => updateButton(index, 'redirect_url', e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || submitting}>
            {submitting ? '创建中...' : '确认创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
