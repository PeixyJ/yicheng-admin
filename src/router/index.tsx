import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '@/pages/not-found'
import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'
import ForgotPasswordPage from '@/pages/forgot-password'
import LoadingPage from '@/pages/loading'
import DashboardPage from '@/pages/dashboard'
import AuthLayout from '@/layouts/auth-layout'
import AdminLayout from '@/layouts/admin-layout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoadingPage />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
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
