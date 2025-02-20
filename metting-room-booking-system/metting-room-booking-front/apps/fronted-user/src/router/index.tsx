import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import Layout from '../components/Layout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import UpdatePassword from '../pages/UpdatePassword'
import ErrorPage from '../pages/ErrorPage'
import UpdateInfo from '@/pages/UpdateInfo'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={'/welcome'} />,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    element: <Layout />,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/welcome',
        element: <div>Welcome</div>,
      },
      {
        path: '/updateInfo',
        element: <UpdateInfo></UpdateInfo>,
      },
    ],
  },
  {
    path: 'login',
    element: <Login></Login>,
  },
  {
    path: 'register',
    element: <Register></Register>,
  },
  {
    path: 'updatePassword',
    element: <UpdatePassword></UpdatePassword>,
  },
  {
    path: '*',
    element: <Navigate to={'/404'} />,
  },
  {
    path: '404',
    element: <ErrorPage></ErrorPage>,
  },
]

export default createBrowserRouter(routes)
