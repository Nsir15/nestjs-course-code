import { FC, memo, useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { UserOutlined } from '@ant-design/icons'
import { myUserStore } from '@/store'

interface IProps {}

const Component: FC<IProps> = () => {
  const navigate = useNavigate()
  const { userInfo } = myUserStore()
  const { headPic } = userInfo || {}

  useEffect(() => {
    if (!userInfo) {
      location.href = '/login'
    }
  }, [])

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.header}>
        <Link to={'/'}>
          <h1>会议室预定系统</h1>
        </Link>
        <div className={styles.icon} onClick={() => navigate('/updateInfo')}>
          {headPic ? (
            <img
              src={headPic}
              alt="头像"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            ></img>
          ) : (
            <UserOutlined />
          )}
        </div>
      </div>
      <div className={styles.body}>
        <Outlet />
      </div>
    </div>
  )
}
const Layout = memo(Component)
export default Layout
