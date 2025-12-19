import { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import ErrorPage from '@/pages/not-found'
import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'
import ForgotPasswordPage from '@/pages/forgot-password'
import LoadingPage from '@/pages/loading'

import AuthLayout from '@/layouts/auth-layout'
import MenuLayout from '@/layouts/menu-layout'

import { menuConfig, dashboardIndex } from '@/constants/menu'
import { menuToRoutes } from '@/utils/menu'

// 从菜单配置生成路由
const menuRoutes = menuToRoutes(menuConfig)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoadingPage />,
  },
  {
    path: '/dashboard',
    element: <MenuLayout />,
    children: [
      // Dashboard 首页
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            {dashboardIndex.element}
          </Suspense>
        ),
      },
      // 从菜单配置生成的路由
      ...menuRoutes,
      // 通配符路由 - 用于未实现的页面
      {
        path: '*',
        element: (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <h1 className='text-2xl font-semibold'>页面开发中</h1>
            <p className='text-muted-foreground'>此页面尚未实现</p>
          </div>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])
