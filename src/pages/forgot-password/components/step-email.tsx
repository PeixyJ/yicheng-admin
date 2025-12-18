'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface StepEmailProps {
  onNext: () => void
}

const StepEmail = ({ onNext }: StepEmailProps) => {
  return (
    <form className='space-y-4' onSubmit={e => { e.preventDefault(); onNext() }}>
      <div className='space-y-1'>
        <Label className='leading-5' htmlFor='resetEmail'>
          Email address*
        </Label>
        <Input
          type='email'
          id='resetEmail'
          placeholder='Enter your email address'
        />
        <p className='text-muted-foreground text-xs'>
          We'll send a verification code to this email
        </p>
      </div>

      <Button className='w-full' type='submit'>
        Send Verification Code
      </Button>
    </form>
  )
}

export default StepEmail
