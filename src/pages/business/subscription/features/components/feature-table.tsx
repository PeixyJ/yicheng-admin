import { useState } from 'react'
import { Check, Copy, Pencil, Trash2 } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { FeatureVO, FeatureType } from '@/types/feature'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='size-6 opacity-0 group-hover:opacity-100 transition-opacity'
      onClick={handleCopy}
    >
      {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
    </Button>
  )
}

interface FeatureTableProps {
  features: FeatureVO[]
  loading: boolean
  onStatusChange?: (featureId: number, status: boolean) => void
  onEdit?: (feature: FeatureVO) => void
  onDelete?: (featureId: number) => void
}

function getFeatureTypeBadge(type: FeatureType) {
  switch (type) {
    case 'BOOLEAN':
      return <Badge variant='outline'>开关型</Badge>
    case 'POINTS':
      return <Badge variant='secondary'>计量型</Badge>
    default:
      return <Badge variant='outline'>{type}</Badge>
  }
}

export function FeatureTable({
  features,
  loading,
  onStatusChange,
  onEdit,
  onDelete,
}: FeatureTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [featureToDelete, setFeatureToDelete] = useState<number | null>(null)
  const [switchingIds, setSwitchingIds] = useState<Set<number>>(new Set())

  const handleDeleteClick = (e: React.MouseEvent, featureId: number) => {
    e.stopPropagation()
    setFeatureToDelete(featureId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (featureToDelete !== null) {
      onDelete?.(featureToDelete)
    }
    setDeleteDialogOpen(false)
    setFeatureToDelete(null)
  }

  const handleStatusChange = async (featureId: number, checked: boolean) => {
    setSwitchingIds((prev) => new Set(prev).add(featureId))
    try {
      await onStatusChange?.(featureId, checked)
    } finally {
      setSwitchingIds((prev) => {
        const next = new Set(prev)
        next.delete(featureId)
        return next
      })
    }
  }

  return (
    <>
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16'>ID</TableHead>
              <TableHead>功能名称</TableHead>
              <TableHead>功能编码</TableHead>
              <TableHead>功能类型</TableHead>
              <TableHead>点数消耗</TableHead>
              <TableHead>排序</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className='w-28'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className='h-4 w-8' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-28' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-16' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-12' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-10' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-6 w-10' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8 w-20' />
                  </TableCell>
                </TableRow>
              ))
            ) : features.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              features.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell className='font-medium'>
                    <div className='group flex items-center gap-1'>
                      <span>{feature.id}</span>
                      <CopyButton text={String(feature.id)} />
                    </div>
                  </TableCell>
                  <TableCell>{feature.featureName}</TableCell>
                  <TableCell>
                    <div className='group flex items-center gap-1'>
                      <code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
                        {feature.featureCode}
                      </code>
                      <CopyButton text={feature.featureCode} />
                    </div>
                  </TableCell>
                  <TableCell>{getFeatureTypeBadge(feature.featureType)}</TableCell>
                  <TableCell>
                    {feature.featureType === 'POINTS' ? (
                      <span className='font-medium'>{feature.pointsCost ?? '-'}</span>
                    ) : (
                      <span className='text-muted-foreground'>-</span>
                    )}
                  </TableCell>
                  <TableCell>{feature.sortOrder}</TableCell>
                  <TableCell>
                    <Switch
                      checked={feature.status}
                      disabled={switchingIds.has(feature.id)}
                      onCheckedChange={(checked) => handleStatusChange(feature.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8'
                        onClick={() => onEdit?.(feature)}
                      >
                        <Pencil className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8 text-destructive hover:text-destructive'
                        onClick={(e) => handleDeleteClick(e, feature.id)}
                      >
                        <Trash2 className='size-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除该功能吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
