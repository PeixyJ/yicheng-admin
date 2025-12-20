import { useState } from 'react'
import { Plus, Settings } from 'lucide-react'

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
import { Switch } from '@/components/ui/switch'

import { createSystemConfig } from '@/services/system-config'
import type { ConfigValueType } from '@/types/system-config'

interface CreateConfigDialogProps {
  onSuccess?: () => void
}

const valueTypes: { value: ConfigValueType; label: string }[] = [
  { value: 'STRING', label: '字符串' },
  { value: 'NUMBER', label: '数值' },
  { value: 'BOOLEAN', label: '布尔值' },
  { value: 'JSON', label: 'JSON' },
  { value: 'TEXT', label: '长文本' },
]

const configGroups: { value: string; label: string }[] = [
  { value: 'SYSTEM', label: '系统配置' },
  { value: 'BUSINESS', label: '业务配置' },
  { value: 'SECURITY', label: '安全配置' },
  { value: 'NOTIFICATION', label: '通知配置' },
  { value: 'PAYMENT', label: '支付配置' },
  { value: 'FEATURE', label: '功能开关' },
]

export function CreateConfigDialog({ onSuccess }: CreateConfigDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [configKey, setConfigKey] = useState('')
  const [configValue, setConfigValue] = useState('')
  const [valueType, setValueType] = useState<ConfigValueType>('STRING')
  const [configGroup, setConfigGroup] = useState('SYSTEM')
  const [description, setDescription] = useState('')
  const [defaultValue, setDefaultValue] = useState('')
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [isReadonly, setIsReadonly] = useState(false)
  const [sortOrder, setSortOrder] = useState('0')

  const resetForm = () => {
    setConfigKey('')
    setConfigValue('')
    setValueType('STRING')
    setConfigGroup('SYSTEM')
    setDescription('')
    setDefaultValue('')
    setIsEncrypted(false)
    setIsReadonly(false)
    setSortOrder('0')
  }

  const handleSubmit = async () => {
    if (!configKey.trim() || !configValue.trim()) return

    setSubmitting(true)
    try {
      const response = await createSystemConfig({
        configKey: configKey.trim(),
        configValue: configValue.trim(),
        valueType,
        configGroup,
        description: description.trim() || undefined,
        defaultValue: defaultValue.trim() || undefined,
        isEncrypted,
        isReadonly,
        sortOrder: parseInt(sortOrder) || 0,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          添加配置
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-xl' onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
              <Settings className='h-5 w-5 text-primary' />
            </div>
            添加配置
          </DialogTitle>
          <DialogDescription>创建新的系统配置项</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 max-h-[60vh] overflow-y-auto py-2'>
          <div>
            <Label>配置键 <span className='text-destructive'>*</span></Label>
            <Input
              className='mt-1.5 font-mono'
              placeholder='例如：app.feature.enabled'
              value={configKey}
              onChange={(e) => setConfigKey(e.target.value)}
              maxLength={100}
            />
            <p className='mt-1 text-xs text-muted-foreground'>使用小写字母、数字、点号和下划线</p>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>值类型 <span className='text-destructive'>*</span></Label>
              <Select value={valueType} onValueChange={(v) => setValueType(v as ConfigValueType)}>
                <SelectTrigger className='mt-1.5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {valueTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>配置分组 <span className='text-destructive'>*</span></Label>
              <Select value={configGroup} onValueChange={setConfigGroup}>
                <SelectTrigger className='mt-1.5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {configGroups.map((group) => (
                    <SelectItem key={group.value} value={group.value}>
                      {group.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>配置值 <span className='text-destructive'>*</span></Label>
            <Textarea
              className='mt-1.5 font-mono min-h-24'
              placeholder='请输入配置值...'
              value={configValue}
              onChange={(e) => setConfigValue(e.target.value)}
            />
          </div>
          <div>
            <Label>默认值</Label>
            <Input
              className='mt-1.5 font-mono'
              placeholder='请输入默认值（可选）'
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
            />
          </div>
          <div>
            <Label>描述</Label>
            <Textarea
              className='mt-1.5'
              placeholder='请输入描述信息（可选）'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={2}
            />
          </div>
          <div>
            <Label>排序值</Label>
            <Input
              className='mt-1.5'
              type='number'
              placeholder='0'
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            <p className='mt-1 text-xs text-muted-foreground'>数值越小排序越靠前</p>
          </div>
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <Label>加密存储</Label>
              <p className='text-xs text-muted-foreground'>敏感配置建议开启加密</p>
            </div>
            <Switch
              checked={isEncrypted}
              onCheckedChange={setIsEncrypted}
            />
          </div>
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <Label>只读配置</Label>
              <p className='text-xs text-muted-foreground'>开启后配置不可修改</p>
            </div>
            <Switch
              checked={isReadonly}
              onCheckedChange={setIsReadonly}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!configKey.trim() || !configValue.trim() || submitting}
          >
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
