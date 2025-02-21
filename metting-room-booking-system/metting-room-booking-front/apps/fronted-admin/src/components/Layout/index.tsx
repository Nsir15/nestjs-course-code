import { FC, memo } from 'react'
import styles from './index.module.scss'
import { Outlet } from 'react-router-dom'
import NavMenu from '../NavMenu'
import NavHeader from '../NavHeader'

export enum ELayoutEnum {
  layoutContainer = 'layoutContainer',
  userEditorContainer = 'userEditorContainer',
}

interface IProps {
  layoutType?: ELayoutEnum
}

const Component: FC<IProps> = (props) => {
  const { layoutType = ELayoutEnum.layoutContainer } = props

  return (
    <div className={styles.layoutContainer}>
      <NavHeader></NavHeader>
      <div className={styles.body}>
        <div className={styles.aside}>
          <NavMenu layoutType={layoutType}></NavMenu>
        </div>
        <div className={styles.content}>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  )
}

export default memo(Component)
