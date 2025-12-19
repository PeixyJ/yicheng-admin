import { Outlet } from 'react-router-dom'

import { AuthPreview } from './components/auth-preview'

const AuthLayout = () => {
  return (
    <div className='h-dvh lg:grid lg:grid-cols-6'>
      {/* Dashboard Preview */}
      <AuthPreview />

      {/* Auth Form Content */}
      <div className='flex h-full flex-col items-center justify-center py-10 sm:px-5 lg:col-span-3 xl:col-span-2'>
        <div className='w-full max-w-md px-6'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
