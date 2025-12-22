'use client'

import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon, ShieldCheckIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {AlertSuccess, AlertError} from '@/components/shadcn-studio/alert'
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp'

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

    // MFA 状态
    const [mfaRequired, setMfaRequired] = useState(false)
    const [totpCode, setTotpCode] = useState('')

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
            if (response.code === 'success') {
                if (response.data.status === 'MFA_REQUIRED') {
                    // 需要 MFA 验证
                    setMfaRequired(true)
                } else if (response.data.token) {
                    setToken(response.data.token)
                    setAlert({ type: 'success', message: '登录成功' })
                    setTimeout(() => navigate('/dashboard'), 500)
                } else {
                    setAlert({ type: 'error', message: response.message || '登录失败' })
                }
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

    const handleMfaSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAlert(null)

        if (totpCode.length !== 6) {
            setAlert({ type: 'error', message: '请输入 6 位验证码' })
            return
        }

        setIsLoading(true)
        try {
            const response = await loginByEmailPassword(email, password, rememberMe, totpCode)
            if (response.code === 'success' && response.data.token) {
                setToken(response.data.token)
                setAlert({ type: 'success', message: '登录成功' })
                setTimeout(() => navigate('/dashboard'), 500)
            } else {
                setAlert({ type: 'error', message: response.message || '验证失败' })
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : '验证失败'
            setAlert({ type: 'error', message })
        } finally {
            setIsLoading(false)
        }
    }

    const handleBackToLogin = () => {
        setMfaRequired(false)
        setTotpCode('')
        setAlert(null)
    }

    // MFA 验证界面
    if (mfaRequired) {
        return (
            <form className='space-y-6' onSubmit={handleMfaSubmit}>
                {/* Alert */}
                {alert && (
                    alert.type === 'success'
                        ? <AlertSuccess message={alert.message} />
                        : <AlertError message={alert.message} />
                )}

                <div className='flex flex-col items-center gap-4'>
                    <div className='flex size-14 items-center justify-center rounded-full bg-primary/10'>
                        <ShieldCheckIcon className='size-7 text-primary'/>
                    </div>
                    <div className='text-center'>
                        <h3 className='text-lg font-semibold'>两步验证</h3>
                        <p className='text-muted-foreground text-sm'>
                            请输入验证器应用中的 6 位验证码
                        </p>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <InputOTP
                        maxLength={6}
                        value={totpCode}
                        onChange={setTotpCode}
                        disabled={isLoading}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0}/>
                            <InputOTPSlot index={1}/>
                            <InputOTPSlot index={2}/>
                            <InputOTPSlot index={3}/>
                            <InputOTPSlot index={4}/>
                            <InputOTPSlot index={5}/>
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <div className='space-y-3'>
                    <Button className='w-full' type='submit' disabled={isLoading || totpCode.length !== 6}>
                        {isLoading && <Loader2Icon className='mr-2 size-4 animate-spin'/>}
                        验证
                    </Button>
                    <Button
                        type='button'
                        variant='ghost'
                        className='w-full'
                        onClick={handleBackToLogin}
                        disabled={isLoading}
                    >
                        <ArrowLeftIcon className='mr-2 size-4'/>
                        返回登录
                    </Button>
                </div>
            </form>
        )
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
