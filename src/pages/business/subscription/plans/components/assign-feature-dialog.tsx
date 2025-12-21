import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'

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
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getFeatureList } from '@/services/feature'
import { assignFeaturesToPlan } from '@/services/plan'
import type { FeatureVO, FeatureType } from '@/types/feature'

function getFeatureTypeLabel(type: FeatureType | undefined | null) {
  switch (type) {
    case 'BOOLEAN':
      return '开关型'
    case 'POINTS':
      return '计量型'
    default:
      return type || '-'
  }
}

interface AssignFeatureDialogProps {
  planId: number
  existingFeatureIds: number[]
  onSuccess?: () => void
}

export function AssignFeatureDialog({
  planId,
  existingFeatureIds,
  onSuccess,
}: AssignFeatureDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [features, setFeatures] = useState<FeatureVO[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    if (open) {
      loadFeatures()
      setSelectedIds([])
      setSearchKeyword('')
    }
  }, [open])

  const loadFeatures = async () => {
    setLoading(true)
    try {
      const response = await getFeatureList({
        page: 1,
        size: 1000,
        status: true,
      })
      if (response.code === 'success') {
        // Filter out features that are already assigned to this plan
        const availableFeatures = response.data.records.filter(
          (f) => !existingFeatureIds.includes(f.id)
        )
        setFeatures(availableFeatures)
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (featureId: number) => {
    setSelectedIds((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    )
  }

  const handleSelectAll = () => {
    const filteredFeatures = getFilteredFeatures()
    const filteredIds = filteredFeatures.map((f) => f.id)
    const allSelected = filteredIds.every((id) => selectedIds.includes(id))

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...filteredIds])])
    }
  }

  const getFilteredFeatures = () => {
    if (!searchKeyword.trim()) return features
    const keyword = searchKeyword.toLowerCase()
    return features.filter(
      (f) =>
        f.featureName.toLowerCase().includes(keyword) ||
        f.featureCode.toLowerCase().includes(keyword)
    )
  }

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return

    setSubmitting(true)
    try {
      const response = await assignFeaturesToPlan(planId, {
        featureIds: selectedIds,
      })
      if (response.code === 'success') {
        setOpen(false)
        onSuccess?.()
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const filteredFeatures = getFilteredFeatures()
  const allSelected =
    filteredFeatures.length > 0 &&
    filteredFeatures.every((f) => selectedIds.includes(f.id))
  const someSelected =
    filteredFeatures.some((f) => selectedIds.includes(f.id)) && !allSelected

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm'>
          <Plus className='mr-2 size-4' />
          关联功能
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>关联功能</DialogTitle>
          <DialogDescription>
            选择要关联到该订阅计划的功能
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='搜索功能名称或编码...'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className='pl-9'
            />
          </div>

          <ScrollArea className='h-[400px] rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-12'>
                    <Checkbox
                      checked={someSelected ? 'indeterminate' : allSelected}
                      onCheckedChange={handleSelectAll}
                      disabled={loading || filteredFeatures.length === 0}
                    />
                  </TableHead>
                  <TableHead>功能名称</TableHead>
                  <TableHead>功能编码</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>消耗点数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className='size-4' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-24' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-28' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-5 w-14' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-8' />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredFeatures.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='h-24 text-center text-muted-foreground'
                    >
                      {features.length === 0
                        ? '暂无可关联的功能'
                        : '未找到匹配的功能'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFeatures.map((feature) => (
                    <TableRow
                      key={feature.id}
                      className='cursor-pointer'
                      onClick={() => handleToggle(feature.id)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(feature.id)}
                          onCheckedChange={() => handleToggle(feature.id)}
                        />
                      </TableCell>
                      <TableCell className='font-medium'>
                        {feature.featureName}
                      </TableCell>
                      <TableCell>
                        <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                          {feature.featureCode}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            feature.featureType === 'BOOLEAN'
                              ? 'outline'
                              : 'secondary'
                          }
                        >
                          {getFeatureTypeLabel(feature.featureType)}
                        </Badge>
                      </TableCell>
                      <TableCell>{feature.pointsCost ?? '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {selectedIds.length > 0 && (
            <p className='text-sm text-muted-foreground'>
              已选择 {selectedIds.length} 个功能
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || selectedIds.length === 0}
          >
            {submitting ? '关联中...' : '确认关联'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
