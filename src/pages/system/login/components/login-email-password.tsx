'use client'

import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {EyeIcon, EyeOffIcon, Loader2Icon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {AlertSuccess, AlertError} from '@/components/shadcn-studio/alert'

import {loginByEmailPassword} from '@/services/auth'
import {setToken} from '@/utils/request'

const LoginEmailPasswordForm = () => {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {}

        if (!email) {
            newErrors.email = '请输入邮箱地址'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = '请输入有效的邮箱地址'
        }

        if (!password) {
            newErrors.password = '请输入密码'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAlert(null)

        if (!validate()) return

        setIsLoading(true)
        try {
            const response = await loginByEmailPassword(email, password, rememberMe)
            if (response.code === 'success' && response.data.token) {
                setToken(response.data.token)
                setAlert({ type: 'success', message: '登录成功' })
                setTimeout(() => navigate('/dashboard'), 500)
            } else {
                setAlert({ type: 'error', message: response.message || '登录失败' })
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : '登录失败'
            setAlert({ type: 'error', message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className='space-y-4' onSubmit={handleSubmit}>
            {/* Alert */}
            {alert && (
                alert.type === 'success'
                    ? <AlertSuccess message={alert.message} />
                    : <AlertError message={alert.message} />
            )}

            {/* Email */}
            <div className='space-y-1'>
                <Label className='leading-5' htmlFor='userEmail'>
                    邮箱地址*
                </Label>
                <Input
                    type='email'
                    id='userEmail'
                    placeholder='请输入邮箱地址'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                {errors.email && (
                    <p className='text-destructive text-sm'>{errors.email}</p>
                )}
            </div>

            {/* Password */}
            <div className='w-full space-y-1'>
                <Label className='leading-5' htmlFor='password'>
                    密码*
                </Label>
                <div className='relative'>
                    <Input
                        id='password'
                        type={isVisible ? 'text' : 'password'}
                        placeholder='请输入密码'
                        className='pr-9'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => setIsVisible((prev) => !prev)}
                        className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
                        disabled={isLoading}
                    >
                        {isVisible ? <EyeOffIcon/> : <EyeIcon/>}
                        <span className='sr-only'>
              {isVisible ? '隐藏密码' : '显示密码'}
            </span>
                    </Button>
                </div>
                {errors.password && (
                    <p className='text-destructive text-sm'>{errors.password}</p>
                )}
            </div>

            {/* Remember Me */}
            <div className='flex items-center gap-3'>
                <Checkbox
                    id='rememberMe'
                    className='size-5'
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={isLoading}
                />
                <Label htmlFor='rememberMe' className='cursor-pointer'>
                    记住我
                </Label>
            </div>

            <Button className='w-full' type='submit' disabled={isLoading}>
                {isLoading && <Loader2Icon className='mr-2 size-4 animate-spin'/>}
                登录
            </Button>
        </form>
    )
}

export default LoginEmailPasswordForm
