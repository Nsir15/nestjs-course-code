import { FC, memo } from 'react'
import styles from './index.module.scss'
import { Button, Form, Input } from 'antd'
import { Login } from '@/types/api'
import { wrapRequest, message, Storage } from '@meeting-room/shared'
import { login } from '@/api/login'
import { useNavigate } from 'react-router-dom'

interface IProps {}

const defaultLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}

const Component: FC<IProps> = (props) => {
  // const {} = props
  const [form] = Form.useForm<Login.ILoginParams>()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const [, data] = await wrapRequest(login(values))
    if (data) {
      message.success('登录成功')
      Storage.set('token', data.accessToken)
      Storage.set('refreshToken', data.refreshToken)
      navigate('/', { replace: true })
    }
  }

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>登录</h1>
      <Form form={form} autoComplete="off" {...defaultLayout}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '用户名不能为空' }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input.Password></Input.Password>
        </Form.Item>
        <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 18, offset: 6 }}>
          <Button type="primary" style={{ width: '100%' }} onClick={handleSubmit}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default memo(Component)
