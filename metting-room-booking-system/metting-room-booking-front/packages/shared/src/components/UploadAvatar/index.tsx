import { FC, memo, useState } from 'react'
import styles from './index.module.scss'
import { Upload, UploadProps } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import { message } from '../AntdGlobal'

interface IProps {
  action?: string
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

  return (
    <div className={styles.uploadAvatarContainer}>
      <Upload.Dragger
        name="file"
        showUploadList={false}
        listType="picture-card"
        maxCount={1}
        action={props.action}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
      >
        {value ? (
          <img
            src={value}
            alt="avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
