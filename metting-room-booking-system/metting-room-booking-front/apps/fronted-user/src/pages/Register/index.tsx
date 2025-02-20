import { FC, memo } from 'react'
import styles from './index.module.scss'
import { Button, Col, Form, Input, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import { wrapRequest } from '@meeting-room/shared'
import { getRegisterCaptcha, registerRequest } from '@/api'
import { message } from '@meeting-room/shared'

interface IProps {}

const defaultLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

const layout1 = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
}

const Component: FC<IProps> = (props) => {
  // const {} = props
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const [, data] = await wrapRequest(registerRequest(values))
    if (data) {
      message.success('注册成功')
      navigate('/login')
    }
    console.log(values)
  }

  const handleSendCaptcha = async () => {
    const email = form.getFieldValue('email')
    const [err] = await wrapRequest(getRegisterCaptcha(email))
    if (!err) {
      message.success('验证码已发送')
    }
  }

  return (
    <div className={styles.registerContainer}>
      <h1>会议室预定系统</h1>
      <Form form={form} {...defaultLayout}>
        <Form.Item name="username" label="用户名">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item name="nickName" label="昵称">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item name="password" label="密码">
          <Input.Password allowClear></Input.Password>
        </Form.Item>
        <Form.Item name="confirmPassword" label="确认密码">
          <Input.Password allowClear></Input.Password>
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input allowClear></Input>
        </Form.Item>

        <Form.Item label="验证码">
          <Row gutter={0}>
            <Col span={16}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[{ required: true, message: 'Please input the captcha you got!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button type="primary" onClick={handleSendCaptcha}>
                发送验证码
              </Button>
            </Col>
          </Row>
        </Form.Item>
        {/* <div className={styles.captchaRow}>
          <Form.Item name="captchaCode" label="验证码">
            <Input allowClear></Input>
          </Form.Item>
          <Button type="primary">发送验证码</Button>
        </div> */}
        <Form.Item {...layout1}>
          <div className={styles.link}>
            <a
              href=""
              onClick={(e) => {
                e.preventDefault()
                navigate('/login')
              }}
            >
              已有账号？去登录
            </a>
          </div>
        </Form.Item>
        <Form.Item {...layout1}>
          <Button type="primary" style={{ width: '100%' }} onClick={handleSubmit}>
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default memo(Component)
