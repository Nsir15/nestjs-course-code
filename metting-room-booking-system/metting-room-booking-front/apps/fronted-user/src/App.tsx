import { RouterProvider } from 'react-router-dom'
import { App as AntdApp } from 'antd'
import './App.css'
import router from './router'
import { AntdGlobal } from '@meeting-room/shared'

function App() {
  return (
    <AntdApp>
      <AntdGlobal></AntdGlobal>
      <RouterProvider router={router}></RouterProvider>
    </AntdApp>
  )
}

export default App
