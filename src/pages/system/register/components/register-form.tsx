'use client'

import { useState } from 'react'

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
          Email address*
        </Label>
        <Input type='email' id='userEmail' placeholder='Enter your email address' />
      </div>

      {/* Password */}
      <div className='w-full space-y-1'>
        <Label className='leading-5' htmlFor='password'>
          Password*
        </Label>
        <div className='relative'>
          <Input
            id='password'
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder='Create a password'
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

      {/* Terms and Conditions */}
      <div className='flex items-start gap-3'>
        <Checkbox id='agreeTerms' className='mt-0.5 size-5' />
        <Label htmlFor='agreeTerms' className='text-sm leading-5'>
          I agree to the{' '}
          <a href='#' className='text-foreground hover:underline'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href='#' className='text-foreground hover:underline'>
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button className='w-full' type='submit'>
        Create Account
      </Button>
    </form>
  )
}

export default RegisterForm
