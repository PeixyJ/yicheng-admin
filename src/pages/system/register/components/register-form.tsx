'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const RegisterForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <form className='space-y-4' onSubmit={e => e.preventDefault()}>
      {/* Email */}
      <div className='space-y-1'>
        <Label className='leading-5' htmlFor='userEmail'>
          邮箱地址*
        </Label>
        <Input type='email' id='userEmail' placeholder='请输入邮箱地址' />
      </div>

      {/* Password */}
      <div className='w-full space-y-1'>
        <Label className='leading-5' htmlFor='password'>
          密码*
        </Label>
        <div className='relative'>
          <Input
            id='password'
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder='请设置密码'
            className='pr-9'
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setIsPasswordVisible(prev => !prev)}
            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className='sr-only'>{isPasswordVisible ? '隐藏密码' : '显示密码'}</span>
          </Button>
        </div>
        <p className='text-muted-foreground text-xs'>
          密码至少需要 8 个字符
        </p>
      </div>

      {/* Terms and Conditions */}
      <div className='flex items-start gap-3'>
        <Checkbox id='agreeTerms' className='mt-0.5 size-5' />
        <Label htmlFor='agreeTerms' className='text-sm leading-5'>
          我已阅读并同意{' '}
          <Link to='/terms' className='text-foreground hover:underline'>
            服务条款
          </Link>{' '}
          和{' '}
          <Link to='/privacy' className='text-foreground hover:underline'>
            隐私政策
          </Link>
        </Label>
      </div>

      <Button className='w-full' type='submit'>
        创建账户
      </Button>
    </form>
  )
}

export default RegisterForm
