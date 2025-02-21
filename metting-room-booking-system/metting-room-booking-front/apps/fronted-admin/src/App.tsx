import { RouterProvider } from 'react-router-dom'
import { App as AntdApp } from 'antd'
import { AntdGlobal } from '@meeting-room/shared'
import router from './router'
import './App.css'

function App() {
  return (
    <AntdApp>
      {/* 这个空组件加载仅仅是为了让全局变量可以绑定值,方便后续调用 message 之类的 */}
      <AntdGlobal></AntdGlobal>
      <RouterProvider router={router}></RouterProvider>
    </AntdApp>
  )
}

export default App
