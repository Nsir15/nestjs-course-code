import { FC, memo } from 'react'
import styles from './index.module.scss'
import { Button, Form, Input, message } from 'antd'
import { loginRequest } from '@/api'
import { Storage, wrapRequest } from '@meeting-room/shared'
import { useNavigate } from 'react-router-dom'

const layout1 = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

const layout2 = {
  labelCol: {
    span: 0,
  },
  wrapperCol: { span: 24 },
}

interface IProps {}

const Component: FC<IProps> = (props) => {
  // const {} = props
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const [, data] = await wrapRequest(loginRequest(values))
    if (data) {
      Storage.set('token', data.accessToken)
      Storage.set('refreshToken', data.refreshToken)
      Storage.set('userInfo', data.userInfo)
      message.success('登录成功')
      navigate('/', { replace: true })
    }
    console.log(data)
  }

  return (
    <div className={styles.loginContainer}>
      <h1>会议预定系统</h1>
      <Form form={form} {...layout1} autoComplete="off">
        <Form.Item name="username" label="用户名">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item name="password" label="密码">
          <Input.Password allowClear></Input.Password>
        </Form.Item>
        <Form.Item {...layout2}>
          <div className={styles.links}>
            <a
              href=""
              onClick={(e) => {
                e.preventDefault()
                navigate('/register')
              }}
            >
              创建账号
            </a>
            <a
              href=""
              onClick={(e) => {
                e.preventDefault()
                navigate('/updatePassword')
              }}
            >
              忘记密码
            </a>
          </div>
        </Form.Item>
        <Form.Item {...layout2}>
          <Button type="primary" style={{ width: '100%' }} onClick={handleSubmit}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const Login = memo(Component)

export default Login
