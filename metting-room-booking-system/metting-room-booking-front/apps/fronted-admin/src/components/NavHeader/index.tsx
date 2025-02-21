import { UserOutlined } from '@ant-design/icons'
import { FC, memo } from 'react'
import styles from './index.module.scss'
import { Link, useNavigate } from 'react-router-dom'

interface IProps {}
const Component: FC<IProps> = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.navHeader}>
      <Link to={'/'}>
        <h1>会议室预定系统</h1>
      </Link>
      <UserOutlined
        className={styles.icon}
        onClick={() => {
          navigate('/userEditor')
        }}
      ></UserOutlined>
    </div>
  )
}

export default memo(Component)
