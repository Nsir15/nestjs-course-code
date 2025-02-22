import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import styles from './index.module.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu, MenuProps } from 'antd'

interface IProps {}
const Component: FC<IProps> = (props) => {
  // const {} = props
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([''])
  const menuItems: MenuProps['items'] = useMemo(() => {
    return [
      {
        label: '会议室',
        key: '/meetingRoom',
      },
      {
        label: '预定记录',
        key: '/bookingHistory',
      },
    ]
  }, [])

  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    navigate(key)
  }, [])

  useEffect(() => {
    setSelectedKeys([pathname])
  }, [pathname])

  return (
    <div className={styles.menuLayoutContainer}>
      <div className={styles.aside}>
        <Menu items={menuItems} selectedKeys={selectedKeys} onClick={handleMenuClick}></Menu>
      </div>
      <div className={styles.content}>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default memo(Component)
