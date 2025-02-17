import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import Layout from '../components/Layout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import UpdatePassword from '../pages/UpdatePassword'
import ErrorPage from '../pages/ErrorPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={'/welcome'} />,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/welcome',
        element: <div>Welcome</div>
      },
      {
        path: 'login',
        element: <Login></Login>
      },
      {
        path: 'register',
        element: <Register></Register>
      },
      {
        path: 'updatePassword',
        element: <UpdatePassword></UpdatePassword>
      }
    ]
  }
]

export default createBrowserRouter(routes)
