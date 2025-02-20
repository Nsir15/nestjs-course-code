import { FC, memo, useEffect } from 'react'
import styles from './index.module.scss'
import { Button, Col, Form, Input, Row } from 'antd'
import { wrapRequest } from '@meeting-room/shared'
import { getUpdateUserCaptcha, getUserInfo, updateUserInfo } from '@/api'
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

  const fetchData = async () => {
    const [, data] = await wrapRequest(getUserInfo())
    if (data) {
      form.setFieldsValue({ ...data })
    }
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const [error] = await wrapRequest(updateUserInfo(values))
    if (!error) {
      message.success('修改成功')
      // form.resetFields()
    }
  }

  const handleSendCode = async () => {
    const [error] = await wrapRequest(getUpdateUserCaptcha())
    if (!error) {
      message.success('验证码发送成功！')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className={styles.updateInfoContainer}>
      <Form form={form} autoComplete="off" {...defaultLayout}>
        <Form.Item label="头像" name="headPic">
          <Input />
        </Form.Item>
        <Form.Item label="昵称" name="nickName">
          <Input />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input readOnly disabled></Input>
        </Form.Item>
        <Form.Item label="验证码" required>
          <Row gutter={10}>
            <Col span={16}>
              <Form.Item name="captcha" rules={[{ required: true }]}>
                <Input style={{ width: '100%' }} maxLength={6}></Input>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button type="primary" onClick={handleSendCode}>
                发送验证码
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item {...layout1}>
          <Button type="primary" style={{ width: '100%' }} onClick={handleSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default memo(Component)
