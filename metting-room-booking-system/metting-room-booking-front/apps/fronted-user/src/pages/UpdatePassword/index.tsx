import { FC, memo } from 'react'
import styles from './index.module.scss'
import { Button, Col, Form, Input, InputNumber, Row } from 'antd'
import { wrapRequest } from '@meeting-room/shared'
import { getCaptcha, updatePassword } from '@/api'
import { EGetCaptchaAllowTypes } from '@/types/api'
import { message } from '@meeting-room/shared'
import { useNavigate } from 'react-router-dom'

interface IProps {}

export interface UpdatePassword {
  username: string
  email: string
  captcha: string
  password: string
  confirmPassword: string
}

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

const Component: FC<IProps> = () => {
  const [form] = Form.useForm<UpdatePassword>()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (values.password !== values.confirmPassword) {
      message.error('两次密码不一致')
      return
    }
    const [error] = await wrapRequest(updatePassword(values))
    if (!error) {
      message.success('修改成功')
      form.resetFields()
      navigate('/login')
    }
  }

  const sendCaptcha = async () => {
    const email = form.getFieldValue('email')
    const [error] = await wrapRequest(
      getCaptcha({ email, type: EGetCaptchaAllowTypes.UpdatePassword })
    )
    if (!error) {
      message.success('验证码已发送')
    }
  }

  return (
    <div className={styles.updatePasswordContainer}>
      <h1>会议室预定系统</h1>
      <Form<UpdatePassword> form={form} {...defaultLayout}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '用户名不能为空' }]}
        >
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label="新密码" name="password">
          <Input.Password allowClear></Input.Password>
        </Form.Item>
        <Form.Item label="确认密码" name="confirmPassword">
          <Input.Password allowClear></Input.Password>
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label="验证码" required>
          <Row gutter={6}>
            <Col span={16}>
              <Form.Item
                noStyle
                name="captcha"
                rules={[{ required: true, message: '请输入验证码!' }]}
              >
                <InputNumber style={{ width: '100%' }} controls={false}></InputNumber>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={sendCaptcha}>
                发送验证码
              </Button>
            </Col>
          </Row>
        </Form.Item>
        {/* <div className={styles.captchaWrapper}>
          <Form.Item
            label="验证码"
            name="captcha"
            rules={[{ required: true, message: '请输入验证码!' }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" onClick={sendCaptcha}>
            发送验证码
          </Button>
        </div> */}

        <Form.Item {...layout1}>
          <Button type="primary" style={{ width: '100%' }} onClick={handleSubmit}>
            修改密码
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default memo(Component)
