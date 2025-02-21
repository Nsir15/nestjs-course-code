import { FC, memo } from 'react'
import styles from './index.module.scss'
import { UserOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router-dom'
import NavMenu from '../NavMenu'

interface IProps {}
const Component: FC<IProps> = (props) => {
  // const {} = props
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.header}>
        <h1>会议室预定系统</h1>
        <UserOutlined className={styles.icon}></UserOutlined>
      </div>
      <div className={styles.body}>
        <div className={styles.aside}>
          <NavMenu></NavMenu>
        </div>
        <div className={styles.content}>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  )
}

export default memo(Component)
