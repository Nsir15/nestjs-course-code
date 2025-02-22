import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import ContainerLayout from '../components/ContainerLayout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import UpdatePassword from '../pages/UpdatePassword'
import ErrorPage from '../pages/ErrorPage'
import UpdateInfo from '@/pages/UpdateInfo'
import MenuLayout from '@/components/MenuLayout'
import MeetingRoom from '@/pages/MeetingRoom'
import BookingHistory from '@/pages/BookingHistory'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ContainerLayout />,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/updateInfo',
        element: <UpdateInfo></UpdateInfo>,
      },
      {
        path: '/',
        element: <MenuLayout />,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
          {
            index: true,
            element: <Navigate to={'/meetingRoom'} />,
          },
          {
            path: '/meetingRoom',
            element: <MeetingRoom></MeetingRoom>,
          },
          {
            path: '/bookingHistory',
            element: <BookingHistory></BookingHistory>,
          },
        ],
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
