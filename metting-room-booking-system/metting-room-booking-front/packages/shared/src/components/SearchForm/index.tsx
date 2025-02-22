import { FC, memo, PropsWithChildren } from 'react'
import styles from './index.module.scss'
import { Button, Form, FormInstance, Input, Select, Space } from 'antd'

export interface ISearchFormProps {
  form?: FormInstance<any>
  formFieldsConfig: Array<{
    label: string
    name: string
    rules?: Array<{
      required: boolean
      message: string
    }>
    width?: number
    type: 'select' | 'input'
    placeholder?: string
    options?: Array<{
      label: string
      value: string
    }>
  }>
  onSubmit: () => void
  onReset: () => void
}

const Component: FC<PropsWithChildren<ISearchFormProps>> = (props) => {
  const { formFieldsConfig, form } = props

  return (
    <div className={styles.searchFormContainer}>
      <Form form={form} autoComplete="off" layout="inline">
        {formFieldsConfig.map((item) => {
          switch (item.type) {
            case 'input':
              return (
                <Form.Item
                  key={item.name}
                  label={item.label}
                  name={item.name}
                  rules={item.rules}
                  style={{ width: item.width }}
                >
                  <Input placeholder={item.placeholder}></Input>
                </Form.Item>
              )

            case 'select':
              return (
                <Form.Item key={item.name} label={item.label} name={item.name} rules={item.rules}>
                  <Select style={{ width: item.width || 120 }} options={item.options}></Select>
                </Form.Item>
              )
            default:
              return null
          }
        })}
        {props.children}
        <Form.Item>
          <Space>
            <Button type="primary" onClick={props.onSubmit}>
              搜索
            </Button>
            <Button type="primary" onClick={props.onReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default memo(Component)
