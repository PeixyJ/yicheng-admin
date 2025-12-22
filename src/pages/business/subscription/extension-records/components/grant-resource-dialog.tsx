import {useState, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {Check, ChevronsUpDown, Gift, HelpCircle} from 'lucide-react'

import {cn} from '@/lib/utils'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {Textarea} from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {NumberInput} from '@/components/shadcn-studio/input/number-input'
import {grantResourceExtension, getResourcePackageList} from '@/services/resource-pack'
import {getTeamList} from '@/services/team'
import type {ResourceType, SubscribeResourcePackageVO} from '@/types/resource-pack'
import type {AdminTeamVO} from '@/types/team'

const formSchema = z.object({
    teamId: z.number().min(1, '请选择团队'),
    resourceType: z.enum(['PROJECT', 'MEMBER', 'STORAGE'] as const),
    amount: z.number().min(1, '资源数量必须大于0'),
    durationDays: z.number().min(0, '有效天数不能小于0').optional(),
    packId: z.number().optional(),
    grantReason: z.string().min(1, '请输入赠送原因'),
})

type FormValues = z.infer<typeof formSchema>

interface GrantResourceDialogProps {
    onSuccess?: () => void
}

export function GrantResourceDialog({onSuccess}: GrantResourceDialogProps) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [teamOpen, setTeamOpen] = useState(false)
    const [teams, setTeams] = useState<AdminTeamVO[]>([])
    const [teamSearch, setTeamSearch] = useState('')
    const [teamsLoading, setTeamsLoading] = useState(false)

    const [packOpen, setPackOpen] = useState(false)
    const [packs, setPacks] = useState<SubscribeResourcePackageVO[]>([])
    const [packSearch, setPackSearch] = useState('')
    const [packsLoading, setPacksLoading] = useState(false)

    // 搜索团队
    useEffect(() => {
        if (!open) return

        const searchTeams = async () => {
            setTeamsLoading(true)
            try {
                const res = await getTeamList({
                    page: 1,
                    size: 50,
                    keyword: teamSearch || undefined,
                })
                if (res.code === 'success') {
                    setTeams(res.data.records)
                }
            } catch {
                // Error handled by interceptor
            } finally {
                setTeamsLoading(false)
            }
        }

        const debounce = setTimeout(searchTeams, 300)
        return () => clearTimeout(debounce)
    }, [open, teamSearch])

    // 搜索资源包
    useEffect(() => {
        if (!open) return

        const searchPacks = async () => {
            setPacksLoading(true)
            try {
                const res = await getResourcePackageList({
                    page: 1,
                    size: 50,
                    packName: packSearch || undefined,
                })
                if (res.code === 'success') {
                    setPacks(res.data.records)
                }
            } catch {
                // Error handled by interceptor
            } finally {
                setPacksLoading(false)
            }
        }

        const debounce = setTimeout(searchPacks, 300)
        return () => clearTimeout(debounce)
    }, [open, packSearch])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamId: undefined,
            resourceType: undefined,
            amount: 1,
            durationDays: undefined,
            packId: undefined,
            grantReason: '',
        },
    })

    const onSubmit = async (values: FormValues) => {
        setSubmitting(true)
        try {
            const res = await grantResourceExtension({
                teamId: values.teamId,
                resourceType: values.resourceType as ResourceType,
                amount: values.amount,
                durationDays: values.durationDays,
                packId: values.packId,
                grantReason: values.grantReason,
            })
            if (res.code === 'success') {
                setOpen(false)
                form.reset()
                onSuccess?.()
            }
        } catch (error) {
            console.error('Failed to grant resource:', error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Gift className='mr-2 size-4'/>
                    赠送资源
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-lg' onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>赠送资源</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        {/* 团队 */}
                        <FormField
                            control={form.control}
                            name='teamId'
                            render={({field}) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>团队</FormLabel>
                                    <Popover open={teamOpen} onOpenChange={setTeamOpen} modal>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant='outline'
                                                    role='combobox'
                                                    aria-expanded={teamOpen}
                                                    className={cn(
                                                        'w-full justify-between font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    {field.value
                                                        ? teams.find((team) => team.id === field.value)?.name ?? `团队 ID: ${field.value}`
                                                        : '选择团队'}
                                                    <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50'/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className='w-(--radix-popover-trigger-width)! p-0'
                                            align='start'
                                            onOpenAutoFocus={(e) => e.preventDefault()}
                                        >
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder='搜索团队名称或编码...'
                                                    value={teamSearch}
                                                    onValueChange={setTeamSearch}
                                                    onPointerDown={(e) => e.stopPropagation()}
                                                />
                                                <CommandList>
                                                    {teamsLoading ? (
                                                        <CommandEmpty>加载中...</CommandEmpty>
                                                    ) : teams.length === 0 ? (
                                                        <CommandEmpty>未找到团队</CommandEmpty>
                                                    ) : (
                                                        <CommandGroup>
                                                            {teams.map((team) => (
                                                                <CommandItem
                                                                    key={team.id}
                                                                    value={String(team.id)}
                                                                    onSelect={() => {
                                                                        field.onChange(team.id)
                                                                        setTeamOpen(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 size-4 shrink-0',
                                                                            field.value === team.id ? 'opacity-100' : 'opacity-0'
                                                                        )}
                                                                    />
                                                                    <Avatar className='mr-2 size-6 shrink-0'>
                                                                        <AvatarImage src={team.logoUrl || undefined}
                                                                                     alt={team.name}/>
                                                                        <AvatarFallback className='text-xs'>
                                                                            {team.name.slice(0, 1)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className='flex flex-col min-w-0'>
                                                                        <span className='truncate'>{team.name}</span>
                                                                        <span className='text-xs text-muted-foreground truncate'>
                                                                            {team.teamType === 'PERSONAL' ? '个人' : '协作'} · {team.teamCode} · {team.statusDesc}
                                                                        </span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    )}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-2 gap-4'>
                            {/* 资源类型 */}
                            <FormField
                                control={form.control}
                                name='resourceType'
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>资源类型</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='选择资源类型'/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='PROJECT'>项目数</SelectItem>
                                                <SelectItem value='MEMBER'>成员数</SelectItem>
                                                <SelectItem value='STORAGE'>存储空间</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* 资源数量 */}
                            <FormField
                                control={form.control}
                                name='amount'
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>资源数量</FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                minValue={1}
                                                step={1}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            {/* 有效天数 */}
                            <FormField
                                control={form.control}
                                name='durationDays'
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-1'>
                                            有效天数
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className='size-3.5 text-muted-foreground cursor-help'/>
                                                </TooltipTrigger>
                                                <TooltipContent>留空或为0表示永久有效</TooltipContent>
                                            </Tooltip>
                                        </FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                value={field.value ?? 0}
                                                onChange={(v) => field.onChange(v || undefined)}
                                                minValue={0}
                                                step={1}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* 关联资源包 */}
                            <FormField
                                control={form.control}
                                name='packId'
                                render={({field}) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel className='flex items-center gap-1'>
                                            关联资源包
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className='size-3.5 text-muted-foreground cursor-help'/>
                                                </TooltipTrigger>
                                                <TooltipContent>可选，关联已有的资源包</TooltipContent>
                                            </Tooltip>
                                        </FormLabel>
                                        <Popover open={packOpen} onOpenChange={setPackOpen} modal>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant='outline'
                                                        role='combobox'
                                                        aria-expanded={packOpen}
                                                        className={cn(
                                                            'w-full justify-between font-normal',
                                                            !field.value && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        {field.value
                                                            ? packs.find((pack) => pack.id === field.value)?.packName ?? `资源包 ID: ${field.value}`
                                                            : '选择资源包（可选）'}
                                                        <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50'/>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className='w-(--radix-popover-trigger-width)! p-0'
                                                align='start'
                                                onOpenAutoFocus={(e) => e.preventDefault()}
                                            >
                                                <Command shouldFilter={false}>
                                                    <CommandInput
                                                        placeholder='搜索资源包名称...'
                                                        value={packSearch}
                                                        onValueChange={setPackSearch}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                    />
                                                    <CommandList>
                                                        {packsLoading ? (
                                                            <CommandEmpty>加载中...</CommandEmpty>
                                                        ) : packs.length === 0 ? (
                                                            <CommandEmpty>未找到资源包</CommandEmpty>
                                                        ) : (
                                                            <CommandGroup>
                                                                {packs.map((pack) => (
                                                                    <CommandItem
                                                                        key={pack.id}
                                                                        value={String(pack.id)}
                                                                        onSelect={() => {
                                                                            field.onChange(pack.id)
                                                                            setPackOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                'mr-2 size-4 shrink-0',
                                                                                field.value === pack.id ? 'opacity-100' : 'opacity-0'
                                                                            )}
                                                                        />
                                                                        <div className='flex flex-col min-w-0'>
                                                                            <span className='truncate'>{pack.packName}</span>
                                                                            <span className='text-xs text-muted-foreground truncate'>
                                                                                {pack.packCode} · {pack.resourceType}
                                                                            </span>
                                                                        </div>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        )}
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 赠送原因 */}
                        <FormField
                            control={form.control}
                            name='grantReason'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>赠送原因</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='请输入赠送原因...'
                                            className='resize-none'
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className='flex justify-end gap-3 pt-2'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => setOpen(false)}
                                disabled={submitting}
                            >
                                取消
                            </Button>
                            <Button type='submit' disabled={submitting}>
                                {submitting ? '赠送中...' : '确认赠送'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
