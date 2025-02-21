import { FC, memo, useEffect, useState } from 'react'
import styles from './index.module.scss'
import { Menu, MenuProps } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { ELayoutEnum } from '../Layout'

interface IProps {
  layoutType: ELayoutEnum
}

const Component: FC<IProps> = (props) => {
  const { layoutType } = props
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [selectedKeys, setSelectedKeys] = useState([pathname])

  const menuItems: MenuProps['items'] =
    layoutType === ELayoutEnum.layoutContainer
      ? [
          {
            key: '1',
            label: '会议室管理',
          },
          {
            key: '2',
            label: '预定管理',
          },
          {
            key: '/userManagement',
            label: '用户管理',
          },
          {
            key: '4',
            label: '统计',
          },
        ]
      : [
          {
            key: '/userEditor/userInfo',
            label: '信息修改',
          },
          {
            key: '/userEditor/password',
            label: '密码修改',
          },
        ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  useEffect(() => {
    setSelectedKeys([pathname])
  }, [pathname])

  return (
    <div className={styles.navMenuContainer}>
      <Menu selectedKeys={selectedKeys} items={menuItems} onClick={handleMenuClick}></Menu>
    </div>
  )
}

export default memo(Component)
