'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

interface StepVerifyProps {
  onNext: () => void
  onBack: () => void
}

const StepVerify = ({ onNext, onBack }: StepVerifyProps) => {
  const [otpValue, setOtpValue] = useState('')

  return (
    <form className='space-y-4' onSubmit={e => { e.preventDefault(); onNext() }}>
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

      <div className='text-center'>
        <button
          type='button'
          className='text-muted-foreground hover:text-foreground text-sm hover:underline'
        >
          Didn't receive the code? Resend
        </button>
      </div>

      <div className='flex gap-3'>
        <Button
          type='button'
          variant='outline'
          className='flex-1'
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          className='flex-1'
          type='submit'
          disabled={otpValue.length !== 6}
        >
          Verify Code
        </Button>
      </div>
    </form>
  )
}

export default StepVerify
