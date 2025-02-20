import { FC, memo } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { UserOutlined } from '@ant-design/icons'

interface IProps {}

const Component: FC<IProps> = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.header}>
        <h1>会议室预定系统</h1>
        <UserOutlined className={styles.icon} onClick={() => navigate('/updateInfo')} />
      </div>
      <div className={styles.body}>
        <Outlet />
      </div>
    </div>
  )
}
const Layout = memo(Component)
export default Layout
