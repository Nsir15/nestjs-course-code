import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import Layout, { ELayoutEnum } from '@/components/Layout'
import ErrorPage from '@/pages/ErrorPage'
import Login from '@/pages/Login'
import UserManagement from '@/pages/UserManagement'
import UpdatePassword from '@/pages/UpdatePassword'
import UpdateUserInfo from '@/pages/UpdateUserInfo'
import MeetingRoomManage from '@/pages/MeetingRoomManage'
import BookingManage from '@/pages/BookingManage'
import Statistics from '@/pages/Statistics'

export const routes: RouteObject[] = [
  {
    path: '/',
    errorElement: <ErrorPage></ErrorPage>,
    element: <Layout></Layout>,
    children: [
      {
        index: true,
        element: <Navigate to={'/userManagement'} replace></Navigate>,
      },
      {
        path: '/userManagement',
        element: <UserManagement />,
      },
      {
        path: '/meetingRoomManage',
        element: <MeetingRoomManage></MeetingRoomManage>,
      },
      {
        path: '/bookingManage',
        element: <BookingManage></BookingManage>,
      },
      {
        path: '/statistics',
        element: <Statistics></Statistics>,
      },
    ],
  },
  {
    path: '/userEditor',
    element: <Layout layoutType={ELayoutEnum.userEditorContainer}></Layout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        element: <Navigate to={'/userEditor/userInfo'} replace></Navigate>,
      },
      {
        path: '/userEditor/userInfo',
        element: <UpdateUserInfo></UpdateUserInfo>,
      },
      {
        path: '/userEditor/password',
        element: <UpdatePassword></UpdatePassword>,
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
