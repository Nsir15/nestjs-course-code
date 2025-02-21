import { FC, memo, useEffect } from 'react'
import styles from './index.module.scss'
import { Button, Form, Input } from 'antd'
import { message, UploadAvatar, wrapRequest } from '@meeting-room/shared'
import { getUpdateUserCaptcha, getUserInfo, updateUserInfo } from '@/api/userManagement'

interface IProps {}
const Component: FC<IProps> = (props) => {
  // const {} = props
  const [form] = Form.useForm()

  const fetchData = async () => {
    const [, data] = await wrapRequest(getUserInfo())
    if (data) {
      form.setFieldsValue(data)
    }
  }

  const handleSendCode = async () => {
    const [error] = await wrapRequest(getUpdateUserCaptcha())
    if (!error) {
      message.success('发送验证码成功')
    }
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const [error] = await wrapRequest(updateUserInfo(values))
    if (!error) {
      message.success('修改成功')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className={styles.updateUserInfoContainer}>
      <div className={styles.formContent}>
        <Form form={form} autoComplete="off" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="头像" name="headPic">
            <UploadAvatar action=""></UploadAvatar>
          </Form.Item>
          <Form.Item label="昵称" name="nickName">
            <Input></Input>
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input></Input>
          </Form.Item>
          <Form.Item label="验证码">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <Form.Item name="captcha" noStyle>
                  <Input></Input>
                </Form.Item>
              </div>
              <div style={{ width: 100, marginLeft: 10 }}>
                <Button type="primary" onClick={handleSendCode}>
                  发送验证码
                </Button>
              </div>
            </div>
          </Form.Item>
          <Form.Item labelCol={{ span: 0 }} wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" style={{ width: '100%' }} onClick={handleSubmit}>
              修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default memo(Component)
