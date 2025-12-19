import {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ChevronLeftIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'

import Logo from '@/components/logo'
import LoginEmailPasswordForm from './components/login-email-password'
import {checkLoginStatus} from '@/services/auth'


const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {
        checkLoginStatus()
            .then((response) => {
                if (response.code === 'success' && response.data) {
                    navigate('/dashboard', {replace: true})
                }
            })
            .catch(() => {
                // 检查失败时忽略，继续显示登录页面
            })
    }, [navigate])

    return (
        <>
            <Link to='/' className='text-muted-foreground group mb-12 flex items-center gap-2 sm:mb-16 lg:mb-24'>
                <ChevronLeftIcon className='transition-transform duration-200 group-hover:-translate-x-0.5'/>
                <p>返回首页</p>
            </Link>

            <div className='flex flex-col gap-6'>
                <Logo className='gap-3'/>

                <div>
                    <h2 className='mb-1.5 text-2xl font-semibold'>登录奕成管理后台</h2>
                    <p className='text-muted-foreground'>高效管理，专注增长</p>
                </div>

                {/* Form */}
                <LoginEmailPasswordForm/>

                <div className='space-y-4'>

                    <div className='flex items-center gap-4'>
                        <Separator className='flex-1'/>
                        <p>或</p>
                        <Separator className='flex-1'/>
                    </div>

                    <div className='flex justify-center gap-3'>
                        <Button variant='outline' size='icon' className='size-11'>
                            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor"
                                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/>
                                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
                            </svg>
                            <span className='sr-only'>使用 Passkey 登录</span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
