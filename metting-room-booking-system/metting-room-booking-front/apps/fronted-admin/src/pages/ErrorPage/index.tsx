import { FC, memo } from 'react'

interface IProps {}
const Component: FC<IProps> = (props) => {
  // const {} = props
  return <div>404</div>
}

export default memo(Component)
