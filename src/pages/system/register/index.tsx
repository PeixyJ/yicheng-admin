import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import Logo from '@/components/logo'
import RegisterForm from './components/register-form'
import RegisterEmailOTPForm from './components/register-email-otp'

type RegisterMethod = 'password' | 'email-otp'

const Register = () => {
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod>('password')

  return (
    <>
      <Link to='/' className='text-muted-foreground group mb-12 flex items-center gap-2 sm:mb-16 lg:mb-20'>
        <ChevronLeftIcon className='transition-transform duration-200 group-hover:-translate-x-0.5' />
        <p>返回首页</p>
      </Link>

      <div className='flex flex-col gap-6'>
        <Logo className='gap-3' />

        <div>
          <h2 className='mb-1.5 text-2xl font-semibold'>创建账户</h2>
          <p className='text-muted-foreground'>开启您的奕成之旅</p>
        </div>

        {/* Form */}
        {registerMethod === 'password' ? (
          <RegisterForm />
        ) : (
          <RegisterEmailOTPForm />
        )}

        <div className='space-y-4'>
          <p className='text-muted-foreground text-center'>
            已有账户？{' '}
            <Link to='/login' className='text-foreground hover:underline'>
              立即登录
            </Link>
          </p>

          <div className='flex items-center gap-4'>
            <Separator className='flex-1' />
            <p>或</p>
            <Separator className='flex-1' />
          </div>

          <div className='flex justify-center gap-3'>
            {/* Email Password */}
            <Button
              variant='outline'
              size='icon'
              className='size-11'
              onClick={() => setRegisterMethod('password')}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span className='sr-only'>使用邮箱密码注册</span>
            </Button>
            {/* Email OTP */}
            <Button
              variant='outline'
              size='icon'
              className='size-11'
              onClick={() => setRegisterMethod('email-otp')}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span className='sr-only'>使用邮箱验证码注册</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
