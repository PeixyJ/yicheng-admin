'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

const RegisterEmailOTPForm = () => {
  const [otpValue, setOtpValue] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)

  const handleSendOtp = () => {
    // TODO: Implement send OTP logic
    setIsOtpSent(true)
  }

  return (
    <form className='space-y-4' onSubmit={e => e.preventDefault()}>
      {/* Email */}
      <div className='space-y-1'>
        <Label className='leading-5' htmlFor='registerEmailOtp'>
          邮箱地址*
        </Label>
        <div className='flex gap-2'>
          <Input
            type='email'
            id='registerEmailOtp'
            placeholder='请输入邮箱地址'
            className='flex-1'
          />
          <Button
            type='button'
            variant='outline'
            onClick={handleSendOtp}
            disabled={isOtpSent}
          >
            {isOtpSent ? '已发送' : '发送验证码'}
          </Button>
        </div>
      </div>

      {/* OTP Input */}
      <div className='space-y-2'>
        <Label className='leading-5'>
          验证码*
        </Label>
        <div className='flex justify-center'>
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={setOtpValue}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className='size-9' />
              <InputOTPSlot index={1} className='size-9' />
              <InputOTPSlot index={2} className='size-9' />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className='size-9' />
              <InputOTPSlot index={4} className='size-9' />
              <InputOTPSlot index={5} className='size-9' />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className='text-muted-foreground text-center text-sm'>
          请输入发送至您邮箱的 6 位验证码
        </p>
      </div>

      {/* Resend */}
      {isOtpSent && (
        <div className='text-center'>
          <button
            type='button'
            className='text-muted-foreground hover:text-foreground text-sm hover:underline'
            onClick={handleSendOtp}
          >
            没有收到验证码？重新发送
          </button>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className='flex items-start gap-3'>
        <Checkbox id='agreeTermsOtp' className='mt-0.5 size-5' />
        <Label htmlFor='agreeTermsOtp' className='text-sm leading-5'>
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

      <Button className='w-full' type='submit' disabled={otpValue.length !== 6}>
        验证并创建账户
      </Button>
    </form>
  )
}

export default RegisterEmailOTPForm
