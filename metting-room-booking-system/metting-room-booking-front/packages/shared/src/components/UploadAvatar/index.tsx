import { FC, memo, useState } from 'react'
import styles from './index.module.scss'
import { Upload, UploadProps } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { DraggerProps, RcFile } from 'antd/es/upload'
import { message } from '../AntdGlobal'
import request from '../../request/request'
import axios from 'axios'

interface IProps {
  baseUrl?: string
  presignedUrl?: string
  useMinio?: boolean
  action?: ((file: RcFile) => string) | string | ((file: RcFile) => PromiseLike<string>)
  value?: string
  onChange?: (value: string) => void
}

const Component: FC<IProps> = (props) => {
  const { value } = props
  const [loading, setLoading] = useState(false)

  const handleBeforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的文件!')
      return false
    }
    if (file.size > 1024 * 1024 * 3) {
      message.error('文件大小不能超过 3MB!')
      return false
    }
    return true
  }

  const handleChange: UploadProps['onChange'] = ({ file }) => {
    const status = file.status
    if (status === 'uploading') {
      setLoading(true)
      return
    }
    if (status === 'done') {
      setLoading(false)
      props.onChange?.(file.response.data.url)
      return
    }
  }

  let action = props.action

  if (action && typeof action === 'function') {
    action = (file: RcFile): string => (props.action as (file: RcFile) => string)(file)
  }

  const defaultAction = async (file: RcFile) => {
    const presignedUrl = props.presignedUrl || `/minio/preSignedUrl`
    const res = await request.get<string>(presignedUrl, { name: file.name })
    return res
  }

  const uploadProps: DraggerProps = {
    name: 'file',
    showUploadList: false,
    listType: 'picture-card',
    maxCount: 1,
    action: action || defaultAction,
    beforeUpload: handleBeforeUpload,
    onChange: handleChange,
  }

  // 如果要使用 minio oss 直传，需要使用 customRequest
  // 因为默认 Dragger 是用 FormData 的格式上传的，也就是 key value 的格式。但是 minio 要求直接把文件放到 body 里。
  // 所以我们要用 customRequest 自定义请求方式
  if (props.useMinio) {
    uploadProps.customRequest = async ({ onSuccess, file, action }) => {
      // const res = await request.put(action, file)
      // MinIO 预签名 URL 上传成功后不会返回数据 上传成功后，直接使用预签名URL中的文件路径
      await axios.put(action, file)
      // 获取不带签名的 url
      const fileUrl = action.split('?')[0]
      // onSuccess 回调函数的数据最终会被传递给 handleChange 函数中的 file.response
      onSuccess?.({
        data: {
          url: fileUrl,
        },
      })
    }
  }

  return (
    <div className={styles.uploadAvatarContainer}>
      <Upload.Dragger {...uploadProps}>
        {value ? (
          <img
            src={value}
            alt="avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        ) : (
          <div>
            {loading ? <LoadingOutlined></LoadingOutlined> : <PlusOutlined></PlusOutlined>}
            <div className={styles.uploadText}>点击/拖拽上传头像</div>
          </div>
        )}
      </Upload.Dragger>
    </div>
  )
}

export default memo(Component)
