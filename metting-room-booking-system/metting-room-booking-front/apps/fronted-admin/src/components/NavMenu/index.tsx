import { FC, memo, useState } from 'react'
import styles from './index.module.scss'
import { Menu, MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'

interface IProps {}

const Component: FC<IProps> = (props) => {
  // const {} = props
  const [selectedKeys, setSelectedKeys] = useState(['1'])
  const navigate = useNavigate()

  const menuItems: MenuProps['items'] = [
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

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('e', e)
    setSelectedKeys(e.keyPath)
    navigate(e.key)
  }

  return (
    <div className={styles.navMenuContainer}>
      <Menu selectedKeys={selectedKeys} items={menuItems} onClick={handleMenuClick}></Menu>
    </div>
  )
}

export default memo(Component)
