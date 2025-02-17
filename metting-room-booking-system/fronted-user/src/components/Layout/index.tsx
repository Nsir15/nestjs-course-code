import { FC, memo } from 'react'
import { Outlet } from 'react-router-dom'

interface IProps {}

const Component: FC<IProps> = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}
const Layout = memo(Component)
export default Layout
