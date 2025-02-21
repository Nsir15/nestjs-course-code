import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import Layout from '@/components/Layout'
import ErrorPage from '@/pages/ErrorPage'
import Login from '@/pages/Login'
import UserManagement from '@/pages/UserManagement'

export const routes: RouteObject[] = [
  {
    path: '/',
    errorElement: <ErrorPage></ErrorPage>,
    element: <Layout></Layout>,
    children: [
      {
        path: '/userManagement',
        element: <UserManagement />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login></Login>,
  },
  {
    path: '*',
    element: <Navigate to={'/404'}></Navigate>,
  },
  {
    path: '/404',
    element: <div>404</div>,
  },
]

export default createBrowserRouter(routes)
