import { useEffect, useState } from 'react'
import './App.css'
import service from './service'

function App() {
  const [aaa, setAaa] = useState()
  const [bbb, setBbb] = useState()

  const fetchData = async () => {
    try {
      const { data: dataA } = await service.get('/aaa')
      const { data: dataB } = await service.get('/bbb')
      setAaa(dataA)
      setBbb(dataB)

    } catch (error) {
      console.log('请求出错了:', error);
    }
  }

  const handleLogin = async () => {
    try {
      const { data = {} } = await service.post('/user/login', {
        username: 'mrnan',
        password: '123456'
      })
      const {
        token,
        refresh_token
      } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refresh_token);

    } catch (error) {
      console.log('登录失败:', error);

    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <button onClick={handleLogin} >登录</button>
      <div>aaa:{aaa}</div>
      <div>bbb:{bbb}</div>
    </div>
  )
}

export default App
