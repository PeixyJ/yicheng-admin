'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

const LoginEmailOTPForm = () => {
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
        <Label className='leading-5' htmlFor='userEmailOtp'>
          Email address*
        </Label>
        <div className='flex gap-2'>
          <Input
            type='email'
            id='userEmailOtp'
            placeholder='Enter your email address'
            className='flex-1'
          />
          <Button
            type='button'
            variant='outline'
            onClick={handleSendOtp}
            disabled={isOtpSent}
          >
            {isOtpSent ? 'Sent' : 'Send Code'}
          </Button>
        </div>
      </div>

      {/* OTP Input */}
      <div className='space-y-2'>
        <Label className='leading-5'>
          Verification Code*
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
          Enter the 6-digit code sent to your email
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
            Didn't receive the code? Resend
          </button>
        </div>
      )}

      <Button className='w-full' type='submit' disabled={otpValue.length !== 6}>
        Verify & Sign in
      </Button>
    </form>
  )
}

export default LoginEmailOTPForm
