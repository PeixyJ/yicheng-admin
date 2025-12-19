import { BorderBeam } from '@/components/ui/border-beam'
import AuthFullBackgroundShape from '@/assets/svg/auth-full-background-shape'

export function AuthPreview() {
  return (
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
  )
}
