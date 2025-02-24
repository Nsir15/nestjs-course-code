import { RouterProvider } from 'react-router-dom'
import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import './App.css'
import router from './router'
import { AntdGlobal } from '@meeting-room/shared'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AntdApp>
        <AntdGlobal></AntdGlobal>
        <RouterProvider router={router}></RouterProvider>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
