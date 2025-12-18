'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const StepReset = () => {
  const navigate = useNavigate()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement password reset logic
    navigate('/login')
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <div className='w-full space-y-1'>
        <Label className='leading-5' htmlFor='newPassword'>
          New Password*
        </Label>
        <div className='relative'>
          <Input
            id='newPassword'
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder='Enter your new password'
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
            <span className='sr-only'>{isPasswordVisible ? 'Hide password' : 'Show password'}</span>
          </Button>
        </div>
        <p className='text-muted-foreground text-xs'>
          Must be at least 8 characters
        </p>
      </div>

      <Button className='w-full' type='submit'>
        Reset Password
      </Button>
    </form>
  )
}

export default StepReset
