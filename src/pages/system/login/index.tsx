import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import Logo from '@/components/logo'
import LoginEmailPasswordForm from './components/login-email-password'
import LoginEmailOTPForm from './components/login-email-otp'

type LoginMethod = 'password' | 'email-otp'

const Login = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password')

  return (
    <>
      <Link to='/' className='text-muted-foreground group mb-12 flex items-center gap-2 sm:mb-16 lg:mb-24'>
        <ChevronLeftIcon className='transition-transform duration-200 group-hover:-translate-x-0.5' />
        <p>Back to the website</p>
      </Link>

      <div className='flex flex-col gap-6'>
        <Logo className='gap-3' />

        <div>
          <h2 className='mb-1.5 text-2xl font-semibold'>Sign in to YiCheng Admin</h2>
          <p className='text-muted-foreground'>Ship Faster and Focus on Growth.</p>
        </div>

        {/* Form */}
        {loginMethod === 'password' ? (
          <LoginEmailPasswordForm />
        ) : (
          <div className='space-y-4'>
            <LoginEmailOTPForm />
          </div>
        )}

        <div className='space-y-4'>
          <p className='text-muted-foreground text-center'>
            New on our platform?{' '}
            <Link to='/register' className='text-foreground hover:underline'>
              Create an account
            </Link>
          </p>

          <div className='flex items-center gap-4'>
            <Separator className='flex-1' />
            <p>or</p>
            <Separator className='flex-1' />
          </div>

          <div className='flex justify-center gap-3'>
            {/* Email Password */}
            <Button
              variant='outline'
              size='icon'
              className='size-11'
              onClick={() => setLoginMethod('password')}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span className='sr-only'>Sign in with Email Password</span>
            </Button>
            {/* Email OTP */}
            <Button
              variant='outline'
              size='icon'
              className='size-11'
              onClick={() => setLoginMethod('email-otp')}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span className='sr-only'>Sign in with Email OTP</span>
            </Button>
            {/* Passkey */}
            <Button variant='outline' size='icon' className='size-11'>
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
              </svg>
              <span className='sr-only'>Sign in with Passkey</span>
            </Button>
            {/* GitHub */}
            <Button variant='outline' size='icon' className='size-11'>
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className='sr-only'>Sign in with GitHub</span>
            </Button>
            {/* Google */}
            <Button variant='outline' size='icon' className='size-11'>
              <svg viewBox="0 0 24 24" className="size-5">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className='sr-only'>Sign in with Google</span>
            </Button>
            {/* WeChat */}
            <Button variant='outline' size='icon' className='size-11'>
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.007-.27-.018-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
              </svg>
              <span className='sr-only'>Sign in with WeChat</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
