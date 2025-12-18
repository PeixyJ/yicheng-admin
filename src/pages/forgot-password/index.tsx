import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, MailIcon, ShieldCheckIcon, KeyRoundIcon } from 'lucide-react'

import { BorderBeam } from '@/components/ui/border-beam'

import Logo from '@/components/logo'
import AuthFullBackgroundShape from '@/assets/svg/auth-full-background-shape'
import StepEmail from './components/step-email'
import StepVerify from './components/step-verify'
import StepReset from './components/step-reset'

type ResetStep = 'email' | 'verify' | 'reset'

const stepConfig = {
  email: {
    title: 'Forgot your password?',
    description: 'No worries, we\'ll send you reset instructions.',
    icon: MailIcon,
  },
  verify: {
    title: 'Check your email',
    description: 'We sent a verification code to your email.',
    icon: ShieldCheckIcon,
  },
  reset: {
    title: 'Set new password',
    description: 'Your new password must be different from previous passwords.',
    icon: KeyRoundIcon,
  },
}

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<ResetStep>('email')

  const config = stepConfig[currentStep]
  const StepIcon = config.icon

  const renderStep = () => {
    switch (currentStep) {
      case 'email':
        return <StepEmail onNext={() => setCurrentStep('verify')} />
      case 'verify':
        return (
          <StepVerify
            onNext={() => setCurrentStep('reset')}
            onBack={() => setCurrentStep('email')}
          />
        )
      case 'reset':
        return <StepReset />
    }
  }

  return (
    <div className='h-dvh lg:grid lg:grid-cols-6'>
      {/* Dashboard Preview */}
      <div className='max-lg:hidden lg:col-span-3 xl:col-span-4'>
        <div className='bg-muted relative z-1 flex h-full items-center justify-center px-6'>
          <div className='outline-border relative shrink rounded-4xl p-2.5 outline-2 -outline-offset-2'>
            <img
              src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-1.png'
              className='max-h-111 w-full rounded-lg object-contain dark:hidden'
              alt='Dashboards'
            />
            <img
              src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/auth/image-1-dark.png'
              className='hidden max-h-111 w-full rounded-lg object-contain dark:inline-block'
              alt='Dashboards'
            />

            <BorderBeam duration={8} borderWidth={2} size={100} />
          </div>

          <div className='absolute -z-1'>
            <AuthFullBackgroundShape />
          </div>
        </div>
      </div>

      {/* Reset Password Form */}
      <div className='flex h-full flex-col items-center justify-center py-10 sm:px-5 lg:col-span-3 xl:col-span-2'>
        <div className='w-full max-w-md px-6'>
          <Link to='/login' className='text-muted-foreground group mb-12 flex items-center gap-2 sm:mb-16 lg:mb-20'>
            <ChevronLeftIcon className='transition-transform duration-200 group-hover:-translate-x-0.5' />
            <p>Back to login</p>
          </Link>

          <div className='flex flex-col gap-6'>
            <Logo className='gap-3' />

            {/* Step Indicator */}
            <div className='flex items-center justify-center gap-2'>
              {(['email', 'verify', 'reset'] as ResetStep[]).map((step, index) => (
                <div key={step} className='flex items-center gap-2'>
                  <div
                    className={`flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      currentStep === step
                        ? 'bg-primary text-primary-foreground'
                        : index < ['email', 'verify', 'reset'].indexOf(currentStep)
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div
                      className={`h-0.5 w-8 transition-colors ${
                        index < ['email', 'verify', 'reset'].indexOf(currentStep)
                          ? 'bg-primary/50'
                          : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className='text-center'>
              <div className='bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full'>
                <StepIcon className='text-foreground size-6' />
              </div>
              <h2 className='mb-1.5 text-2xl font-semibold'>{config.title}</h2>
              <p className='text-muted-foreground'>{config.description}</p>
            </div>

            {/* Form */}
            {renderStep()}

            <p className='text-muted-foreground text-center'>
              Remember your password?{' '}
              <Link to='/login' className='text-foreground hover:underline'>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
