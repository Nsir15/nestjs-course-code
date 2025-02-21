import { FC, memo } from 'react'
import styles from './index.module.scss'
import { Button, Col, Form, Input, Row } from 'antd'

interface IProps {}
const Component: FC<IProps> = (props) => {
  // const {} = props
  const [form] = Form.useForm()

  return (
    <div className={styles.updatePasswordContainer}>
      <div className={styles.formContent}>
        <Form form={form} autoComplete="off" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="确认密码" name="confirmPassword" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="验证码" required>
            <Row gutter={0}>
              <Col span={15}>
                <Form.Item name="captcha" noStyle rules={[{ required: true }]}>
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col span={4} offset={1}>
                <Button type="primary">发送验证码</Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 18, offset: 6 }}>
            <Button type="primary" style={{ width: '100%' }}>
              修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default memo(Component)
