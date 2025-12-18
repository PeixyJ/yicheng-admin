import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '@/pages/not-found'

// 页面组件将在这里导入
// import Home from '@/pages/Home'
// import Login from '@/pages/Login'

export const router = createBrowserRouter([
  {
    path: '/',
    // element: <Layout />,
    children: [
      {
        index: true,
        element: <div>Home</div>,
      },
      {
        path: 'dashboard',
        element: <div>Dashboard</div>,
      },
    ],
  },
  {
    path: '/login',
    element: <div>Login</div>,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])
